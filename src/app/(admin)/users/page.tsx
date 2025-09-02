"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level?: string | null;
};

type User = {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  memberId?: string | null;
  createdAt: string;
};

export default function AdminUsersPage() {
  // Create form state
  const [useMember, setUseMember] = useState<"YES" | "NO">("NO");
  const [memberQ, setMemberQ] = useState("");
  const [memberOptions, setMemberOptions] = useState<Member[]>([]);
  const [memberId, setMemberId] = useState<string>("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [password, setPassword] = useState("ChangeMe123!"); // default, editable

  const [saving, setSaving] = useState(false);

  // Users list
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Password edit inline
  const [pwEdit, setPwEdit] = useState<Record<string, string>>({}); // per-user password value
  const [pwSaving, setPwSaving] = useState<Record<string, boolean>>({});

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    const r = await fetch("/api/users");
    const j = await r.json();
    setRows(j.data as User[]);
    setLoading(false);
  };
  useEffect(() => {
    loadUsers();
  }, []);

  // Member search (when useMember = YES)
  useEffect(() => {
    if (useMember !== "YES") return;
    const t = setTimeout(async () => {
      const url = memberQ.trim()
        ? `/api/members?q=${encodeURIComponent(memberQ.trim())}`
        : "/api/members";
      const r = await fetch(url);
      const j = await r.json();
      setMemberOptions(j.data as Member[]);
    }, 250);
    return () => clearTimeout(t);
  }, [useMember, memberQ]);

  // If member is selected, suggest username/email
  const selectedMember = useMemo(
    () => memberOptions.find((m) => m.id === memberId) ?? null,
    [memberOptions, memberId]
  );
  useEffect(() => {
    if (useMember === "YES" && selectedMember) {
      const suggestedUsername =
        selectedMember.email ||
        `${selectedMember.firstName}.${selectedMember.lastName}`.toLowerCase();
      setUsername(suggestedUsername);
      setEmail(selectedMember.email);
    }
  }, [useMember, selectedMember]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !role) return;
    setSaving(true);

    const body = {
      username,
      email,
      role,
      memberId: useMember === "YES" ? memberId || null : null,
      password: password || "ChangeMe123!",
    };

    const r = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (r.ok) {
      // reset form
      setUseMember("NO");
      setMemberQ("");
      setMemberId("");
      setUsername("");
      setEmail("");
      setRole("MEMBER");
      setPassword("ChangeMe123!");
      loadUsers();
      alert("User created.");
    } else {
      const j = await r.json();
      alert(j.error || "Failed to create user");
    }
  };

  const changePassword = async (userId: string) => {
    const newPw = pwEdit[userId]?.trim();
    if (!newPw || newPw.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setPwSaving((s) => ({ ...s, [userId]: true }));
    const r = await fetch(`/api/users/${userId}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPw }),
    });
    setPwSaving((s) => ({ ...s, [userId]: false }));
    if (r.ok) {
      setPwEdit((s) => ({ ...s, [userId]: "" }));
      alert("Password updated.");
    } else {
      const j = await r.json();
      alert(j.error || "Failed to update password");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Create admin or member users (linked to a member or standalone). Set
          or edit default passwords.
        </p>
      </header>

      {/* Create User Form */}
      <form onSubmit={submit} className="space-y-4 border rounded-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div>
            <Label>Existing member</Label>
            <Select
              value={useMember}
              onValueChange={(v) => setUseMember(v as "YES" | "NO")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NO">Non Member</SelectItem>
                <SelectItem value="YES">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "ADMIN" | "MEMBER")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">MEMBER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label>Username</Label>
            <Input
              placeholder="e.g., email or handle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <Label>Default Password</Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ChangeMe123!"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              You can set a default here. It can be edited later below.
            </p>
          </div>
        </div>

        {useMember === "YES" && (
          <div className="space-y-2">
            <Label>Select member to link</Label>
            <Input
              placeholder="Search by name, email, or level"
              value={memberQ}
              onChange={(e) => setMemberQ(e.target.value)}
            />
            <div className="mt-2 border rounded-md max-h-48 overflow-auto">
              {memberOptions.length === 0 ? (
                <div className="p-2 text-xs text-muted-foreground">
                  No members
                </div>
              ) : (
                <ul className="text-sm">
                  <li
                    className={`px-3 py-2 cursor-pointer hover:bg-accent ${
                      memberId === "" ? "bg-accent" : ""
                    }`}
                    onClick={() => setMemberId("")}
                  >
                    — None —
                  </li>
                  {memberOptions.map((m) => (
                    <li
                      key={m.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-accent ${
                        memberId === m.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setMemberId(m.id)}
                    >
                      {m.firstName} {m.lastName}
                      {m.level ? (
                        <span className="text-muted-foreground">
                          {" "}
                          — {m.level}
                        </span>
                      ) : null}
                      <div className="text-xs text-muted-foreground">
                        {m.email}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {memberId ? (
                <>
                  Selected:{" "}
                  <b>
                    {selectedMember?.firstName} {selectedMember?.lastName}
                  </b>{" "}
                  &middot; {selectedMember?.email}
                </>
              ) : (
                <>
                  Selected: <b>None</b>
                </>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating…" : "Create User"}
          </Button>
        </div>
      </form>

      {/* Users table */}
      <section className="border rounded-md overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No users yet.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Member</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Change Password</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.memberId ?? "-"}</td>
                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="New password"
                        value={pwEdit[u.id] ?? ""}
                        onChange={(e) =>
                          setPwEdit((s) => ({ ...s, [u.id]: e.target.value }))
                        }
                        className="max-w-[200px]"
                      />
                      <Button
                        size="sm"
                        onClick={() => changePassword(u.id)}
                        disabled={pwSaving[u.id]}
                      >
                        {pwSaving[u.id] ? "Saving…" : "Update"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
