import { NextResponse } from "next/server";
import { getAuthSession, getUiSession } from "@/lib/auth";

export async function GET() {
  const authSession = await getAuthSession();
  const userId = authSession?.user?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  const user = await getUiSession(userId);
  if (!user) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user });
}

export const dynamic = "force-dynamic";
