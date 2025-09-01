// src/app/api/members/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { Member } from "@/types/member";
import { seedMembers } from "../_store"; // path note below

// If TS can't infer, define a helper type for the context params
type Context = { params: { id: string } };

// GET /api/members/:id
export async function GET(_req: NextRequest, { params }: Context) {
  const member = seedMembers.find((m) => m.id === params.id);
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  return NextResponse.json({ data: member });
}

// PATCH /api/members/:id
export async function PATCH(req: NextRequest, { params }: Context) {
  const idx = seedMembers.findIndex((m) => m.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const updates = (await req.json()) as Partial<Member>;
  // Never allow id/createdAt to be overwritten
  const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...safe } = updates;

  const updated: Member = { ...seedMembers[idx], ...safe };
  seedMembers[idx] = updated;

  return NextResponse.json({ data: updated });
}

// DELETE /api/members/:id
export async function DELETE(_req: NextRequest, { params }: Context) {
  const idx = seedMembers.findIndex((m) => m.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  const removed = seedMembers[idx];
  seedMembers.splice(idx, 1);
  return NextResponse.json({ data: removed });
}
