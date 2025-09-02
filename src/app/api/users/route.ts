export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listUsers, createUser } from "./_store";
import type { UserRole } from "@/types/user";

export async function GET() {
  const data = listUsers();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<{
    username: string;
    email: string;
    role: UserRole;
    memberId?: string | null;
    password?: string;
  }>;

  if (!body.username || !body.email || !body.role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const created = createUser({
    username: body.username,
    email: body.email,
    role: body.role,
    memberId: body.memberId ?? null,
    password: body.password, // optional — default applied if undefined
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
