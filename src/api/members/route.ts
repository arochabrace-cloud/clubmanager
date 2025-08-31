import { NextResponse } from "next/server";
import { listMembers, createMember } from "./_store";

export async function GET() {
  return NextResponse.json({ data: listMembers() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, lastName, email, phone, level, status } = body ?? {};
  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const created = createMember({
    firstName,
    lastName,
    email,
    phone,
    level,
    status: status ?? "PROSPECT",
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
