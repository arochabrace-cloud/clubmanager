import { User } from "@/types/user";

// raw in-memory store (demo only)
type UserRow = User & { passwordHash: string };

export const users: UserRow[] = [
  {
    id: "u_admin",
    username: "admin",
    email: "admin@example.com",
    role: "ADMIN",
    memberId: null,
    createdAt: "2025-08-01T08:00:00.000Z",
    passwordHash: "hash:ChangeMe123!", // demo only
  },
];

function genId(prefix = "u") {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function pseudoHash(pw: string) {
  return `hash:${pw}`;
}

export function listUsers(): User[] {
  return users.map(({ passwordHash, ...u }) => u);
}

export function createUser(input: {
  username: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  memberId?: string | null;
  password?: string;
}): User {
  const now = new Date().toISOString();
  const id = genId();
  const row: UserRow = {
    id,
    username: input.username,
    email: input.email,
    role: input.role,
    memberId: input.memberId ?? null,
    createdAt: now,
    passwordHash: pseudoHash(input.password ?? "ChangeMe123!"),
  };
  users.unshift(row);
  const { passwordHash, ...user } = row;
  return user;
}

export function updatePassword(id: string, newPassword: string): boolean {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users[idx].passwordHash = pseudoHash(newPassword);
  return true;
}
export function getUserById(id: string): User | null {
  const u = users.find((x) => x.id === id);
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}
