// src/app/api/members/[id]/route.ts
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getMember,
  updateMember,
  deleteMember,
  type UpdateMemberInput,
} from "../_store";

type RouteContext = { params: Record<string, string> };

export async function GET(_req: Request, { params }: RouteContext) {
  const id = params.id;
  const m = getMember(id);
  if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: m });
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const id = params.id;
  const patch = (await req.json()) as UpdateMemberInput;
  const updated = updateMember(id, patch);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const id = params.id;
  const ok = deleteMember(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
