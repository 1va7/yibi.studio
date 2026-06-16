import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BillingItemType } from "@/generated/prisma/client";
import { createBillingOrder } from "@/lib/billing";
import { requireUser } from "@/lib/auth";

const orderSchema = z.object({
  itemType: z.enum(BillingItemType),
  quantity: z.number().int().positive().max(999).optional(),
  discountCode: z.string().trim().max(80).optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  try {
    const result = await createBillingOrder({
      userId: auth.userId,
      itemType: parsed.data.itemType,
      quantity: parsed.data.quantity,
      discountCode: parsed.data.discountCode,
    });
    return NextResponse.json({
      ok: true,
      order: {
        id: result.order.id,
        orderNo: result.order.orderNo,
        itemType: result.order.itemType,
        quantity: result.order.quantity,
        originalAmountFen: result.order.originalAmountFen,
        discountAmountFen: result.order.discountAmountFen,
        payableAmountFen: result.order.payableAmountFen,
        status: result.order.status,
      },
      paymentUrl: result.paymentUrl,
      completed: result.completed,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "invalid_quantity",
        "invalid_discount_code",
        "payments_disabled",
        "payment_env_missing",
      ].includes(error.message)
    ) {
      const status = error.message.startsWith("payment") ? 503 : 400;
      return NextResponse.json({ ok: false, error: error.message }, { status });
    }
    throw error;
  }
}

export const dynamic = "force-dynamic";
