import { NextResponse } from "next/server";
import {
  getAccessTokenExpiresAt,
  getAuthSession,
  issueAccessToken,
} from "@/lib/auth";

export async function POST() {
  const authSession = await getAuthSession();
  const userId = authSession?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    accessToken: await issueAccessToken(userId),
    expiresAt: getAccessTokenExpiresAt(),
  });
}

export const dynamic = "force-dynamic";
