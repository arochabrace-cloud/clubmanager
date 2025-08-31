// src/lib/getRole.ts
import { auth } from "@/auth";
export type AppRole = "ADMIN" | "MEMBER" | "GUEST";

export async function getServerRole(): Promise<AppRole> {
  const session = await auth();
  const role = (session?.user as any)?.role as AppRole | undefined;
  return role === "ADMIN" || role === "MEMBER" || role === "GUEST"
    ? role
    : "GUEST";
}
