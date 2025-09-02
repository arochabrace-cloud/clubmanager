import { NextResponse } from "next/server";
import { memberSubscriptions } from "../_store";

//export async function GET() {
//return NextResponse.json({ data: memberSubscriptions });
//}

// GET: list all (optionally filter by query params)
// ?status=PAID|PENDING|WAIVED&period=YYYY-MM&level=Gold&memberId=m1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const period = searchParams.get("period");
  const level = searchParams.get("level");
  const memberId = searchParams.get("memberId");

  let data = memberSubscriptions.slice();

  if (status) data = data.filter((r) => r.status === status);
  if (period) data = data.filter((r) => r.period === period);
  if (level) data = data.filter((r) => (r.level ?? "") === level);
  if (memberId) data = data.filter((r) => r.memberId === memberId);

  return NextResponse.json({ data });
}

// PATCH: bulk update status of selected member-subscriptions
// body: { ids: string[], status: "PAID" | "PENDING" | "WAIVED" }
export async function PATCH(req: Request) {
  const body = (await req.json()) as {
    ids: string[];
    status: "PAID" | "PENDING" | "WAIVED";
  };
  if (!Array.isArray(body.ids) || !body.ids.length) {
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  }
  const now = new Date().toISOString();
  let count = 0;

  for (const id of body.ids) {
    const idx = memberSubscriptions.findIndex((m) => m.id === id);
    if (idx >= 0) {
      memberSubscriptions[idx] = {
        ...memberSubscriptions[idx],
        status: body.status,
        // If you later add paidAt/reference in the type, set them here.
      } as any;
      count++;
    }
  }
  return NextResponse.json({ updated: count, at: now });
}
