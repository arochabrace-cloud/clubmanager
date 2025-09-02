import { NextResponse } from "next/server";
import { payments, tryApplyPaymentToSubscription, plans } from "../_store";
import { seedMembers } from "@/app/api/members/_store";
import type { Payment } from "@/types/subscription";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const planId = searchParams.get("planId");
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to = searchParams.get("to"); // YYYY-MM-DD

  let data = payments.slice();

  if (memberId) data = data.filter((p) => p.memberId === memberId);
  if (planId) data = data.filter((p) => p.planId === planId);

  if (from) {
    const fromTs = new Date(from).getTime();
    data = data.filter((p) => new Date(p.paidAt).getTime() >= fromTs);
  }
  if (to) {
    const toTs = new Date(to).getTime();
    data = data.filter((p) => new Date(p.paidAt).getTime() <= toTs);
  }

  data.sort(
    (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
  );
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    memberId: string;
    planId: string;
    amount: number;
    paidAt: string; // "YYYY-MM-DD" or ISO
    reference?: string;
  };

  const member = seedMembers.find((m) => m.id === body.memberId);
  const plan = plans.find((p) => p.id === body.planId);

  if (!member || !plan) {
    return NextResponse.json(
      { error: "Invalid member or plan" },
      { status: 400 }
    );
  }
  if (Number.isNaN(body.amount) || body.amount <= 0) {
    return NextResponse.json({ error: "Amount must be > 0" }, { status: 400 });
  }
  if (!body.paidAt) {
    return NextResponse.json({ error: "paidAt is required" }, { status: 400 });
  }

  const id = `pay_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  const payment: Payment = {
    id,
    memberId: member.id,
    memberName: `${member.firstName} ${member.lastName}`,
    planId: plan.id,
    planName: plan.name,
    amount: Number(body.amount),
    currency: plan.currency,
    paidAt: body.paidAt,
    reference: body.reference?.trim() || undefined,
    createdAt: now,
  };

  payments.unshift(payment);
  // best-effort: mark newest pending subscription as PAID for this member + plan
  tryApplyPaymentToSubscription({
    memberId: member.id,
    planId: plan.id,
    paidAt: body.paidAt,
    amount: payment.amount,
  });

  return NextResponse.json({ data: payment }, { status: 201 });
}
