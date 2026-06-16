import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getCreditAccountSnapshot } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const credits = await getCreditAccountSnapshot(auth.userId);
  return NextResponse.json({
    ok: true,
    userId: auth.userId,
    creditBalance: credits.totalBalance,
    paidBalance: credits.paidBalance,
    subscriptionBalance: credits.subscriptionBalance,
  });
}

export const dynamic = "force-dynamic";
