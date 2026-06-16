import { createHash, randomUUID } from "crypto";
import {
  BillingItemType,
  BillingOrderStatus,
  CreditBucket,
  Prisma,
  SubscriptionPlan,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export const BILLING_PRODUCTS = {
  monthly_subscription: {
    itemType: BillingItemType.monthly_subscription,
    title: "异璧月付订阅",
    priceFen: 1990,
    creditsPerCycle: 2000,
    months: 1,
    plan: SubscriptionPlan.monthly,
  },
  yearly_subscription: {
    itemType: BillingItemType.yearly_subscription,
    title: "异璧年付订阅",
    priceFen: 19900,
    creditsPerCycle: 2000,
    months: 12,
    plan: SubscriptionPlan.yearly,
  },
  credit_pack: {
    itemType: BillingItemType.credit_pack,
    title: "异璧额外积分",
    priceFen: 200,
    credits: 100,
  },
} as const;

type CreateOrderInput = {
  userId: string;
  itemType: BillingItemType;
  quantity?: number;
  discountCode?: string;
};

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);
  if (next.getDate() < day) {
    next.setDate(0);
  }
  return next;
}

function totalBalance(account: {
  paidBalance: number;
  subscriptionBalance: number;
}) {
  return account.paidBalance + account.subscriptionBalance;
}

function newOrderNo() {
  return `YB${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function moneyFenToYuan(fen: number) {
  return (fen / 100).toFixed(2);
}

function md5(input: string) {
  return createHash("md5").update(input).digest("hex");
}

function epaySign(params: Record<string, string>, apiKey: string) {
  const query = Object.entries(params)
    .filter(([key, value]) => key !== "sign" && key !== "sign_type" && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return md5(`${query}${apiKey}`);
}

export function verifyEpaySign(params: Record<string, string>) {
  const apiKey = process.env.EPAY_API_KEY;
  const sign = params.sign;
  if (!apiKey || !sign) return false;
  return epaySign(params, apiKey).toLowerCase() === sign.toLowerCase();
}

function getPublicBaseUrl() {
  return (
    process.env.YIBI_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function createEpayPayment(order: {
  orderNo: string;
  itemType: BillingItemType;
  payableAmountFen: number;
}) {
  if (process.env.BILLING_PAYMENTS_ENABLED !== "true") {
    throw new Error("payments_disabled");
  }
  const gateway = process.env.EPAY_GATEWAY_URL;
  const pid = process.env.EPAY_MERCHANT_ID;
  const key = process.env.EPAY_API_KEY;
  if (!gateway || !pid || !key) {
    throw new Error("payment_env_missing");
  }

  const baseUrl = getPublicBaseUrl();
  const product =
    order.itemType === BillingItemType.monthly_subscription
      ? BILLING_PRODUCTS.monthly_subscription
      : order.itemType === BillingItemType.yearly_subscription
        ? BILLING_PRODUCTS.yearly_subscription
        : BILLING_PRODUCTS.credit_pack;
  const params: Record<string, string> = {
    pid,
    type: "alipay",
    out_trade_no: order.orderNo,
    notify_url: `${baseUrl}/api/billing/epay/notify`,
    return_url: `${baseUrl}/account`,
    name: product.title,
    money: moneyFenToYuan(order.payableAmountFen),
  };
  const sign = epaySign(params, key);
  const query = new URLSearchParams({
    ...params,
    sign,
    sign_type: "MD5",
  });
  return `${gateway.replace(/\/$/, "")}/submit.php?${query.toString()}`;
}

function buildEntitlement(itemType: BillingItemType, quantity: number) {
  if (itemType === BillingItemType.monthly_subscription) {
    const product = BILLING_PRODUCTS.monthly_subscription;
    return {
      kind: "subscription",
      plan: product.plan,
      months: product.months,
      creditsPerCycle: product.creditsPerCycle,
    };
  }
  if (itemType === BillingItemType.yearly_subscription) {
    const product = BILLING_PRODUCTS.yearly_subscription;
    return {
      kind: "subscription",
      plan: product.plan,
      months: product.months,
      creditsPerCycle: product.creditsPerCycle,
    };
  }
  const product = BILLING_PRODUCTS.credit_pack;
  return {
    kind: "credit_pack",
    credits: product.credits * quantity,
  };
}

function priceFor(itemType: BillingItemType, quantity: number) {
  if (itemType === BillingItemType.monthly_subscription) {
    return BILLING_PRODUCTS.monthly_subscription.priceFen;
  }
  if (itemType === BillingItemType.yearly_subscription) {
    return BILLING_PRODUCTS.yearly_subscription.priceFen;
  }
  return BILLING_PRODUCTS.credit_pack.priceFen * quantity;
}

export async function createBillingOrder(input: CreateOrderInput) {
  const quantity =
    input.itemType === BillingItemType.credit_pack ? input.quantity ?? 1 : 1;
  if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 999) {
    throw new Error("invalid_quantity");
  }

  const order = await prisma.$transaction(async (tx) => {
    const originalAmountFen = priceFor(input.itemType, quantity);
    let discountCodeId: string | null = null;
    let discountAmountFen = 0;
    const orderId = randomUUID();

    if (input.discountCode?.trim()) {
      const code = await tx.discountCode.findUnique({
        where: { code: input.discountCode.trim().toUpperCase() },
      });
      if (!code?.active || code.redeemedAt || code.redeemedOrderId) {
        throw new Error("invalid_discount_code");
      }
      discountCodeId = code.id;
      discountAmountFen = Math.min(code.amountOffFen, originalAmountFen);
      await tx.discountCode.update({
        where: { id: code.id },
        data: { active: false, redeemedOrderId: orderId },
      });
    }

    return tx.billingOrder.create({
      data: {
        id: orderId,
        orderNo: newOrderNo(),
        userId: input.userId,
        itemType: input.itemType,
        quantity,
        originalAmountFen,
        discountAmountFen,
        payableAmountFen: originalAmountFen - discountAmountFen,
        entitlement: buildEntitlement(input.itemType, quantity),
        discountCodeId,
      },
    });
  });

  if (order.payableAmountFen === 0) {
    return {
      order: await completeBillingOrder(order.orderNo, {
        gatewayTradeNo: "zero-pay",
      }),
      paymentUrl: null,
      completed: true,
    };
  }

  let paymentUrl: string;
  try {
    paymentUrl = createEpayPayment(order);
  } catch (error) {
    await prisma.$transaction(async (tx) => {
      await tx.billingOrder.update({
        where: { id: order.id },
        data: { status: BillingOrderStatus.failed },
      });
      if (order.discountCodeId) {
        await tx.discountCode.update({
          where: { id: order.discountCodeId },
          data: { active: true, redeemedOrderId: null },
        });
      }
    });
    throw error;
  }

  return {
    order,
    paymentUrl,
    completed: false,
  };
}

async function completeCreditPackOrderTx(
  tx: Prisma.TransactionClient,
  order: { id: string; userId: string; orderNo: string; entitlement: Prisma.JsonValue },
  now: Date,
) {
  const entitlement = order.entitlement as { credits?: number };
  const credits = entitlement.credits;
  if (!Number.isInteger(credits) || !credits || credits <= 0) {
    throw new Error("invalid_entitlement");
  }

  const account = await tx.creditAccount.upsert({
    where: { userId: order.userId },
    create: {
      userId: order.userId,
      balance: 0,
      paidBalance: 0,
      subscriptionBalance: 0,
    },
    update: {},
  });
  const balanceBefore = totalBalance(account);
  const balanceAfter = balanceBefore + credits;
  await tx.creditAccount.update({
    where: { userId: order.userId },
    data: {
      paidBalance: account.paidBalance + credits,
      balance: balanceAfter,
    },
  });
  await tx.creditLedger.create({
    data: {
      userId: order.userId,
      moduleKey: "billing",
      actionKey: "credit_pack",
      amount: credits,
      balanceBefore,
      balanceAfter,
      bucket: CreditBucket.paid,
      idempotencyKey: `billing:${order.id}`,
      metadata: { orderNo: order.orderNo, completedAt: now.toISOString() },
    },
  });
}

async function completeSubscriptionOrderTx(
  tx: Prisma.TransactionClient,
  order: { id: string; userId: string; orderNo: string; entitlement: Prisma.JsonValue },
  now: Date,
) {
  const entitlement = order.entitlement as {
    plan?: SubscriptionPlan;
    months?: number;
    creditsPerCycle?: number;
  };
  if (
    !entitlement.plan ||
    !Number.isInteger(entitlement.months) ||
    !entitlement.months ||
    !Number.isInteger(entitlement.creditsPerCycle) ||
    !entitlement.creditsPerCycle
  ) {
    throw new Error("invalid_entitlement");
  }

  const existing = await tx.subscription.findFirst({
    where: {
      userId: order.userId,
      status: "active",
      entitlementEnd: { gt: now },
    },
    orderBy: { entitlementEnd: "desc" },
  });

  const entitlementStart = existing?.entitlementEnd ?? now;
  const entitlementEnd = addMonths(entitlementStart, entitlement.months);
  const periodStart = existing?.periodStart ?? now;
  const periodEnd = existing?.periodEnd ?? addMonths(now, 1);

  const subscription = existing
    ? await tx.subscription.update({
        where: { id: existing.id },
        data: {
          plan: entitlement.plan,
          entitlementEnd,
          status: "active",
        },
      })
    : await tx.subscription.create({
        data: {
          userId: order.userId,
          plan: entitlement.plan,
          status: "active",
          periodStart,
          periodEnd,
          entitlementEnd,
          nextRefreshAt: periodEnd,
          lastRefreshedPeriod: periodStart,
        },
      });

  const account = await tx.creditAccount.upsert({
    where: { userId: order.userId },
    create: {
      userId: order.userId,
      balance: 0,
      paidBalance: 0,
      subscriptionBalance: 0,
    },
    update: {},
  });
  const balanceBefore = totalBalance(account);
  const balanceAfter = account.paidBalance + entitlement.creditsPerCycle;
  await tx.creditAccount.update({
    where: { userId: order.userId },
    data: {
      subscriptionBalance: entitlement.creditsPerCycle,
      balance: balanceAfter,
    },
  });
  await tx.creditLedger.upsert({
    where: {
      userId_moduleKey_actionKey_idempotencyKey_bucket: {
        userId: order.userId,
        moduleKey: "billing",
        actionKey: "subscription_purchase",
        idempotencyKey: `billing:${order.id}`,
        bucket: CreditBucket.subscription,
      },
    },
    create: {
      userId: order.userId,
      moduleKey: "billing",
      actionKey: "subscription_purchase",
      amount: entitlement.creditsPerCycle,
      balanceBefore,
      balanceAfter,
      bucket: CreditBucket.subscription,
      idempotencyKey: `billing:${order.id}`,
      metadata: {
        orderNo: order.orderNo,
        subscriptionId: subscription.id,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        entitlementEnd: entitlementEnd.toISOString(),
      },
    },
    update: {},
  });

  await tx.billingOrder.update({
    where: { id: order.id },
    data: { subscriptionId: subscription.id },
  });
}

export async function completeBillingOrder(
  orderNo: string,
  options: { gatewayTradeNo?: string | null } = {},
) {
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    const order = await tx.billingOrder.findUnique({
      where: { orderNo },
      include: { discountCode: true },
    });
    if (!order) {
      throw new Error("order_not_found");
    }
    if (order.status === BillingOrderStatus.completed) {
      return order;
    }
    if (order.status !== BillingOrderStatus.pending && order.status !== BillingOrderStatus.paid) {
      throw new Error("order_not_payable");
    }
    if (
      order.discountCode &&
      order.discountCode.redeemedOrderId &&
      order.discountCode.redeemedOrderId !== order.id
    ) {
      throw new Error("discount_code_used");
    }

    await tx.billingOrder.update({
      where: { id: order.id },
      data: {
        status: BillingOrderStatus.paid,
        gateway: options.gatewayTradeNo ? "epay" : order.gateway,
        gatewayTradeNo: options.gatewayTradeNo ?? order.gatewayTradeNo,
        paidAt: order.paidAt ?? now,
      },
    });

    if (order.itemType === BillingItemType.credit_pack) {
      await completeCreditPackOrderTx(tx, order, now);
    } else {
      await completeSubscriptionOrderTx(tx, order, now);
    }

    if (order.discountCodeId) {
      await tx.discountCode.update({
        where: { id: order.discountCodeId },
        data: {
          redeemedAt: now,
          redeemedByUserId: order.userId,
          redeemedOrderId: order.id,
        },
      });
    }

    return tx.billingOrder.update({
      where: { id: order.id },
      data: {
        status: BillingOrderStatus.completed,
        completedAt: now,
      },
    });
  });
}

export async function importDiscountCodes(
  codes: Array<{ code: string; amountOffFen: number }>,
) {
  const normalized = codes.map((item) => ({
    code: item.code.trim().toUpperCase(),
    amountOffFen: item.amountOffFen,
  }));
  if (
    normalized.some(
      (item) =>
        !item.code ||
        item.code.length > 80 ||
        !Number.isInteger(item.amountOffFen) ||
        item.amountOffFen <= 0,
    )
  ) {
    throw new Error("invalid_discount_codes");
  }

  return prisma.discountCode.createMany({
    data: normalized,
    skipDuplicates: true,
  });
}
