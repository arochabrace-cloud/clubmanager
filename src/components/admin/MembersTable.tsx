"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MemberForm, { MemberFormValues } from "./MemberForm";
import type { Member } from "@/types/member";

async function apiList(): Promise<Member[]> {
  const res = await fetch("/api/members", { cache: "no-store" });
  const json = await res.json();
  return json.data as Member[];
}

async function apiCreate(values: MemberFormValues): Promise<Member> {
  const res = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("create failed");
  const json = await res.json();
  return json.data as Member;
}

async function apiUpdate(
  id: string,
  values: Partial<MemberFormValues>
): Promise<Member> {
  const res = await fetch(`/api/members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("update failed");
  const json = await res.json();
  return json.data as Member;
}

async function apiDelete(id: string): Promise<void> {
  const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("delete failed");
}

export default function MembersTable() {
  const [rows, setRows] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const data = await apiList();
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [
        r.firstName,
        r.lastName,
        r.email,
        r.phone ?? "",
        r.status,
        r.level ?? "",
      ].some((f) => f?.toLowerCase().includes(q))
    );
  }, [rows, search]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Members</h1>
        <Button onClick={() => setCreateOpen(true)}>New Member</Button>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="search" className="text-sm text-gray-600">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Name, email, status…"
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Name</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <th className="px-3 py-2 text-left font-medium">Level</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td className="px-3 py-6" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-6" colSpan={6}>
                  No members found.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="bg-white hover:bg-gray-50">
                  <td className="px-3 py-2">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-3 py-2">{m.email}</td>
                  <td className="px-3 py-2">{m.phone ?? "—"}</td>
                  <td className="px-3 py-2">{m.level ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {m.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setEditing(m);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await apiDelete(m.id);
                          await load();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Member</DialogTitle>
          </DialogHeader>
          <MemberForm
            submitting={false}
            onSubmit={async (values) => {
              await apiCreate(values);
              setCreateOpen(false);
              await load();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={editOpen}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
          setEditOpen(v);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <MemberForm
            initial={editing ?? undefined}
            submitting={false}
            onSubmit={async (values) => {
              if (!editing) return;
              await apiUpdate(editing.id, values);
              setEditOpen(false);
              setEditing(null);
              await load();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
