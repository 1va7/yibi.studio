import { NextResponse } from "next/server";
import { getAuthSession, getStandardSession, issueAccessToken } from "@/lib/auth";

export async function GET() {
  const authSession = await getAuthSession();
  const userId = authSession?.user?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, session: null }, { status: 401 });
  }

  const session = await getStandardSession(userId);
  if (!session) {
    return NextResponse.json({ ok: false, session: null }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    session,
    accessToken: await issueAccessToken(userId),
  });
}

export const dynamic = "force-dynamic";
