// src/app/api/members/[id]/route.ts
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { MemberService, type UpdateMemberInput } from "@/lib/members";

// If TS can't infer, define a helper type for the context params
type Context = { params: Promise<{ id: string }> };

// GET /api/members/:id
export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const member = await MemberService.getMemberById(id);

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PATCH /api/members/:id (keeping PATCH for backward compatibility)
export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<UpdateMemberInput>;

    // UpdateMemberInput doesn't contain id or createdAt, so no need to filter them
    const updated = await MemberService.updateMember(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Member not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating member:', error);
    
    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "A member with this email or national ID already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// PUT /api/members/:id (for full updates)
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<UpdateMemberInput>;

    const updated = await MemberService.updateMember(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Member not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating member:', error);
    
    // Handle database constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "A member with this email or national ID already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE /api/members/:id
export async function DELETE(_req: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const deleted = await MemberService.deleteMember(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Member not found or failed to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
