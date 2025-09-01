import { NextResponse } from "next/server";
import { assessments, createSubscriptionsForAssessment } from "../_store";
import { DuesAssessment } from "@/types/subscription";

export async function GET() {
  return NextResponse.json({ data: assessments });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<DuesAssessment>;
  const id = `a${Math.random().toString(36).slice(2, 8)}`;
  const a: DuesAssessment = {
    id,
    planId: body.planId!,
    planName: body.planName ?? "",
    period: body.period ?? "",
    targetType: body.targetType as any,
    targetLevel: body.targetLevel ?? null,
    memberIds: body.memberIds ?? [],
    createdAt: new Date().toISOString(),
    createdBy: "admin",
  };
  assessments.unshift(a);
  createSubscriptionsForAssessment(a);
  return NextResponse.json({ data: a }, { status: 201 });
}
