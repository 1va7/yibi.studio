import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { importDiscountCodes } from "@/lib/billing";
import { verifyModuleApiKey } from "@/lib/module-api-keys";

const importSchema = z.object({
  codes: z.array(
    z.object({
      code: z.string().trim().min(1).max(80),
      amountOffFen: z.number().int().positive(),
    }),
  ).min(1).max(500),
});

export async function POST(req: NextRequest) {
  const moduleAuth = await verifyModuleApiKey(req);
  if (!moduleAuth || !moduleAuth.active) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const parsed = importSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await importDiscountCodes(parsed.data.codes);
    return NextResponse.json({ ok: true, count: result.count });
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_discount_codes") {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    throw error;
  }
}

export const dynamic = "force-dynamic";
