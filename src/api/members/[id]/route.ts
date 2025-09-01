export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getMember,
  updateMember,
  deleteMember,
  type UpdateMemberInput,
} from "../_store";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const m = getMember(params.id);
  if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: m });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = (await req.json()) as UpdateMemberInput;
  const updated = updateMember(params.id, patch);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ok = deleteMember(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
