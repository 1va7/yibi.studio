import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { verifyModuleApiKey } from "@/lib/module-api-keys";

function positiveInt(value: string | null, fallback: number, max: number) {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return Math.min(parsed, max);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userAuth = await requireUser(req);
  const moduleAuth = userAuth ? null : await verifyModuleApiKey(req);
  const requestedUserId = url.searchParams.get("userId") || undefined;
  const userId = userAuth?.userId ?? requestedUserId ?? moduleAuth?.userId;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const take = positiveInt(url.searchParams.get("limit"), 50, 100);
  if (!take) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const cursor = url.searchParams.get("cursor") || undefined;
  const moduleKey = url.searchParams.get("moduleKey") || undefined;
  const actionKey = url.searchParams.get("actionKey") || undefined;

  const rows = await prisma.creditLedger.findMany({
    where: {
      userId,
      ...(moduleKey ? { moduleKey } : {}),
      ...(actionKey ? { actionKey } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = rows.length > take;
  const items = rows.slice(0, take);

  return NextResponse.json({
    ok: true,
    userId,
    items: items.map((item) => ({
      id: item.id,
      moduleKey: item.moduleKey,
      actionKey: item.actionKey,
      amount: item.amount,
      bucket: item.bucket,
      balanceBefore: item.balanceBefore,
      balanceAfter: item.balanceAfter,
      idempotencyKey: item.idempotencyKey,
      metadata: item.metadata,
      createdAt: item.createdAt.toISOString(),
    })),
    nextCursor: hasMore ? items.at(-1)?.id : null,
  });
}

export const dynamic = "force-dynamic";
