import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { consumeCredits } from "@/lib/credits";
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

const consumeSchema = z.object({
  userId: z.string().min(1).optional(),
  moduleKey: z.string().min(1).max(80),
  actionKey: z.string().min(1).max(120),
  amount: z.number().int().positive(),
  idempotencyKey: z.string().min(1).max(160),
  metadata: jsonValue.optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = consumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const userAuth = await requireUser(req);
  const moduleAuth = userAuth ? null : await verifyModuleApiKey(req);
  const userId = userAuth?.userId ?? parsed.data.userId ?? moduleAuth?.userId;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (moduleAuth && moduleAuth.moduleKey !== parsed.data.moduleKey) {
    return NextResponse.json(
      { ok: false, error: "module_key_mismatch" },
      { status: 403 },
    );
  }

  try {
    const result = await consumeCredits({
      userId,
      moduleKey: parsed.data.moduleKey,
      actionKey: parsed.data.actionKey,
      amount: parsed.data.amount,
      idempotencyKey: parsed.data.idempotencyKey,
      metadata: parsed.data.metadata,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "insufficient_credits") {
      return NextResponse.json(
        { ok: false, error: "insufficient_credits" },
        { status: 402 },
      );
    }
    throw error;
  }
}

export const dynamic = "force-dynamic";
