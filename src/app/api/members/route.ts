export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listMembers, createMember, type CreateMemberInput } from "./_store";

export async function GET() {
  const data = listMembers();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreateMemberInput>;
  if (!body.firstName || !body.lastName || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const created = createMember({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    level: body.level ?? null,
    status: body.status ?? "PROSPECT",
    residentialAddress: body.residentialAddress,
    occupation: body.occupation,
    nationality: body.nationality,
    passportPictureUrl: body.passportPictureUrl ?? null,
    outstandingBalance:
      typeof body.outstandingBalance === "number" ? body.outstandingBalance : 0,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
