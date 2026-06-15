import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getCreditBalance } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    userId: auth.userId,
    creditBalance: await getCreditBalance(auth.userId),
  });
}

export const dynamic = "force-dynamic";
