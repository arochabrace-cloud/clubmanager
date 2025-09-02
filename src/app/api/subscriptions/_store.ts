import {
  SubscriptionPlan,
  DuesAssessment,
  MemberSubscription,
  Payment,
} from "@/types/subscription";
import { seedMembers } from "@/app/api/members/_store";

export const plans: SubscriptionPlan[] = [
  {
    id: "p1",
    name: "Monthly Dues",
    code: "DUES-MONTH",
    amount: 50,
    currency: "GHS",
    billingCycle: "MONTHLY",
    active: true,
    createdAt: "2025-07-01T08:00:00.000Z",
  },
  {
    id: "p2",
    name: "Annual Development Levy",
    code: "LEVI-ANNUAL",
    amount: 300,
    currency: "GHS",
    billingCycle: "YEARLY",
    active: true,
    createdAt: "2025-07-01T08:00:00.000Z",
  },
  {
    id: "p3",
    name: "Building Fund",
    code: "BLDG-ONE",
    amount: 200,
    currency: "GHS",
    billingCycle: "ONE_TIME",
    active: true,
    createdAt: "2025-07-01T08:00:00.000Z",
  },
];

export const assessments: DuesAssessment[] = [];

export const memberSubscriptions: MemberSubscription[] = [];

// helper to materialize assessment into memberSubscriptions
export function createSubscriptionsForAssessment(a: DuesAssessment) {
  const targetMembers =
    a.targetType === "LEVEL"
      ? seedMembers.filter((m) => (m.level ?? "") === (a.targetLevel ?? ""))
      : seedMembers.filter((m) => a.memberIds?.includes(m.id));

  const plan = plans.find((p) => p.id === a.planId);
  if (!plan) return;

  const now = new Date().toISOString();
  for (const m of targetMembers) {
    memberSubscriptions.push({
      id: `ms-${a.id}-${m.id}`,
      memberId: m.id,
      memberName: `${m.firstName} ${m.lastName}`,
      level: m.level ?? null,
      planId: plan.id,
      planName: plan.name,
      amount: plan.amount,
      currency: plan.currency,
      period: a.period,
      status: "PENDING",
      assessmentId: a.id,
      createdAt: now,
    });
  }
}

// existing exports: plans, assessments, memberSubscriptions, createSubscriptionsForAssessment...
export const payments: Payment[] = [];
// helper to mark a pending member subscription paid if it matches
export function tryApplyPaymentToSubscription(args: {
  memberId: string;
  planId: string;
  paidAt: string;
  amount: number;
}) {
  // naive strategy: find the newest PENDING subscription for this member+plan
  const candidates = memberSubscriptions
    .filter(
      (ms) =>
        ms.memberId === args.memberId &&
        ms.planId === args.planId &&
        ms.status === "PENDING"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (candidates.length) {
    // mark first match as PAID (you can extend with partial payments later)
    candidates[0].status = "PAID";
    return candidates[0].id;
  }
  return null;
}
