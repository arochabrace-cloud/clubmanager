import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { seedMembers } from "@/app/api/members/_store";

// This is a simple placeholder. In production, resolve from your auth/session.
export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get("memberId")?.value;

  if (!id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const me = seedMembers.find((m) => m.id === id);
  if (!me) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ data: me });
}
