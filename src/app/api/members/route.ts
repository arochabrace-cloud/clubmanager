// src/app/api/members/route.ts
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { MemberService, type CreateMemberInput } from "@/lib/members";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const data = await MemberService.getAllMembers(q || undefined);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateMemberInput>;

    // Validate required fields based on our new comprehensive schema
    const requiredFields = [
      'firstName',
      'lastName', 
      'dateOfBirth',
      'gender',
      'nationalId',
      'phone',
      'residentialAddress',
      'regionConstituencyElectoralArea',
      'membershipLevel'
    ];

    const missingFields = requiredFields.filter(field => !body[field as keyof CreateMemberInput]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const created = await MemberService.createMember(body as CreateMemberInput);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    
    // Handle database constraint errors (e.g., duplicate email, nationalId)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: "A member with this email or national ID already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
