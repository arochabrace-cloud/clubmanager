import { NextResponse } from "next/server";
import { memberSubscriptions } from "../_store";

export async function GET() {
  return NextResponse.json({ data: memberSubscriptions });
}
