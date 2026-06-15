import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { grantCredits } from "@/lib/credits";
import { verifyModuleApiKey } from "@/lib/module-api-keys";

const jsonValue: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

const grantSchema = z.object({
  userId: z.string().min(1),
  moduleKey: z.string().min(1).max(80),
  actionKey: z.string().min(1).max(120),
  amount: z.number().int().positive(),
  idempotencyKey: z.string().min(1).max(160),
  metadata: jsonValue.optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = grantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const moduleAuth = await verifyModuleApiKey(req);
  if (!moduleAuth) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (moduleAuth.moduleKey !== parsed.data.moduleKey) {
    return NextResponse.json(
      { ok: false, error: "module_key_mismatch" },
      { status: 403 },
    );
  }

  return NextResponse.json(
    await grantCredits({
      userId: parsed.data.userId,
      moduleKey: parsed.data.moduleKey,
      actionKey: parsed.data.actionKey,
      amount: parsed.data.amount,
      idempotencyKey: parsed.data.idempotencyKey,
      metadata: parsed.data.metadata,
    }),
  );
}

export const dynamic = "force-dynamic";
