import { NextResponse } from "next/server";
import { plans } from "../_store";
import { SubscriptionPlan } from "@/types/subscription";

export async function GET() {
  return NextResponse.json({ data: plans });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<SubscriptionPlan>;
  const id = `p${Math.random().toString(36).slice(2, 8)}`;
  const plan: SubscriptionPlan = {
    id,
    name: body.name ?? "Unnamed",
    code: body.code ?? id.toUpperCase(),
    amount: Number(body.amount ?? 0),
    currency: body.currency ?? "GHS",
    billingCycle: (body.billingCycle as any) ?? "ONE_TIME",
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
  };
  plans.unshift(plan);
  return NextResponse.json({ data: plan }, { status: 201 });
}
