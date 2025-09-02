import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserById } from "../_store";

export async function GET() {
  const cookieStore = await cookies();
  const id = cookieStore.get("userId")?.value;
  if (!id)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const me = getUserById(id);
  if (!me)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ data: me });
}
