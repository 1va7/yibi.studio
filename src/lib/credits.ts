import { CreditBucket, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export type CreditConsumeInput = {
  userId: string;
  moduleKey: string;
  actionKey: string;
  amount: number;
  idempotencyKey: string;
  metadata?: Prisma.InputJsonValue;
};

export type CreditGrantInput = CreditConsumeInput;

const SUBSCRIPTION_CYCLE_CREDITS = 2000;
const SYSTEM_MODULE = "system";

function totalBalance(account: {
  paidBalance: number;
  subscriptionBalance: number;
}) {
  return account.paidBalance + account.subscriptionBalance;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);
  if (next.getDate() < day) {
    next.setDate(0);
  }
  return next;
}

async function refreshSubscriptionCreditsTx(
  tx: Prisma.TransactionClient,
  userId: string,
  now = new Date(),
) {
  const subscription = await tx.subscription.findFirst({
    where: {
      userId,
      status: "active",
      entitlementEnd: { gt: now },
      nextRefreshAt: { lte: now },
    },
    orderBy: { entitlementEnd: "desc" },
  });

  if (!subscription) {
    await tx.subscription.updateMany({
      where: { userId, status: "active", entitlementEnd: { lte: now } },
      data: { status: "expired" },
    });
    return;
  }

  const account = await tx.creditAccount.upsert({
    where: { userId },
    create: { userId, balance: 0, paidBalance: 0, subscriptionBalance: 0 },
    update: {},
  });

  let periodStart = subscription.periodStart;
  let periodEnd = subscription.periodEnd;
  while (periodEnd <= now && periodEnd < subscription.entitlementEnd) {
    periodStart = periodEnd;
    periodEnd = addMonths(periodEnd, 1);
  }
  if (periodEnd > subscription.entitlementEnd) {
    periodEnd = subscription.entitlementEnd;
  }

  const balanceBefore = totalBalance(account);
  const balanceAfter = account.paidBalance + SUBSCRIPTION_CYCLE_CREDITS;
  const idempotencyKey = `subscription_refresh:${subscription.id}:${periodStart.toISOString()}`;

  await tx.creditAccount.update({
    where: { userId },
    data: {
      subscriptionBalance: SUBSCRIPTION_CYCLE_CREDITS,
      balance: balanceAfter,
    },
  });

  await tx.creditLedger.upsert({
    where: {
      userId_moduleKey_actionKey_idempotencyKey_bucket: {
        userId,
        moduleKey: SYSTEM_MODULE,
        actionKey: "subscription_refresh",
        idempotencyKey,
        bucket: CreditBucket.subscription,
      },
    },
    create: {
      userId,
      moduleKey: SYSTEM_MODULE,
      actionKey: "subscription_refresh",
      amount: SUBSCRIPTION_CYCLE_CREDITS,
      balanceBefore,
      balanceAfter,
      bucket: CreditBucket.subscription,
      idempotencyKey,
      metadata: {
        subscriptionId: subscription.id,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
      },
    },
    update: {},
  });

  await tx.subscription.update({
    where: { id: subscription.id },
    data: {
      periodStart,
      periodEnd,
      nextRefreshAt: periodEnd,
      lastRefreshedPeriod: periodStart,
    },
  });
}

export async function refreshSubscriptionCredits(userId: string) {
  await prisma.$transaction((tx) => refreshSubscriptionCreditsTx(tx, userId));
}

export async function getCreditAccountSnapshot(userId: string) {
  await refreshSubscriptionCredits(userId);
  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: {
      paidBalance: true,
      subscriptionBalance: true,
      balance: true,
    },
  });
  const paidBalance = account?.paidBalance ?? account?.balance ?? 0;
  const subscriptionBalance = account?.subscriptionBalance ?? 0;
  return {
    paidBalance,
    subscriptionBalance,
    totalBalance: paidBalance + subscriptionBalance,
  };
}

export async function getCreditBalance(userId: string) {
  return (await getCreditAccountSnapshot(userId)).totalBalance;
}

export async function grantCredits(params: CreditGrantInput) {
  if (!Number.isInteger(params.amount) || params.amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  return prisma.$transaction(async (tx) => {
    await refreshSubscriptionCreditsTx(tx, params.userId);

    const existing = await tx.creditLedger.findFirst({
      where: {
        userId: params.userId,
        moduleKey: params.moduleKey,
        actionKey: params.actionKey,
        idempotencyKey: params.idempotencyKey,
      },
      orderBy: { createdAt: "asc" },
    });
    if (existing) {
      return {
        ok: true,
        ledgerId: existing.id,
        balanceBefore: existing.balanceBefore,
        balanceAfter: existing.balanceAfter,
        deduplicated: true,
      };
    }

    const current = await tx.creditAccount.upsert({
      where: { userId: params.userId },
      create: {
        userId: params.userId,
        balance: 0,
        paidBalance: 0,
        subscriptionBalance: 0,
      },
      update: {},
    });
    const balanceBefore = totalBalance(current);
    const balanceAfter = balanceBefore + params.amount;

    const account = await tx.creditAccount.update({
      where: { userId: params.userId },
      data: {
        paidBalance: current.paidBalance + params.amount,
        balance: balanceAfter,
      },
    });

    const ledger = await tx.creditLedger.create({
      data: {
        userId: params.userId,
        moduleKey: params.moduleKey,
        actionKey: params.actionKey,
        amount: params.amount,
        balanceBefore,
        balanceAfter,
        bucket: CreditBucket.paid,
        idempotencyKey: params.idempotencyKey,
        metadata: params.metadata,
      },
    });

    return {
      ok: true,
      ledgerId: ledger.id,
      balanceBefore,
      balanceAfter: totalBalance(account),
      deduplicated: false,
    };
  });
}

export async function consumeCredits(input: CreditConsumeInput) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  return prisma.$transaction(async (tx) => {
    await refreshSubscriptionCreditsTx(tx, input.userId);

    const existing = await tx.creditLedger.findMany({
      where: {
        userId: input.userId,
        moduleKey: input.moduleKey,
        actionKey: input.actionKey,
        idempotencyKey: input.idempotencyKey,
      },
      orderBy: { createdAt: "asc" },
    });
    if (existing.length) {
      const first = existing[0];
      const last = existing.at(-1) ?? first;
      return {
        ok: true,
        ledgerId: first.id,
        ledgerIds: existing.map((item) => item.id),
        balanceBefore: first.balanceBefore,
        balanceAfter: last.balanceAfter,
        deduplicated: true,
      };
    }

    const account = await tx.creditAccount.upsert({
      where: { userId: input.userId },
      create: {
        userId: input.userId,
        balance: 0,
        paidBalance: 0,
        subscriptionBalance: 0,
      },
      update: {},
    });

    const balanceBefore = totalBalance(account);
    if (balanceBefore < input.amount) {
      throw new Error("insufficient_credits");
    }

    const balanceAfter = balanceBefore - input.amount;
    const subscriptionDebit = Math.min(account.subscriptionBalance, input.amount);
    const paidDebit = input.amount - subscriptionDebit;

    await tx.creditAccount.update({
      where: { userId: input.userId },
      data: {
        subscriptionBalance: account.subscriptionBalance - subscriptionDebit,
        paidBalance: account.paidBalance - paidDebit,
        balance: balanceAfter,
      },
    });

    const ledgerRows = [];
    let runningBefore = balanceBefore;
    if (subscriptionDebit > 0) {
      const runningAfter = runningBefore - subscriptionDebit;
      ledgerRows.push(
        await tx.creditLedger.create({
          data: {
            userId: input.userId,
            moduleKey: input.moduleKey,
            actionKey: input.actionKey,
            amount: -subscriptionDebit,
            balanceBefore: runningBefore,
            balanceAfter: runningAfter,
            bucket: CreditBucket.subscription,
            idempotencyKey: input.idempotencyKey,
            metadata: input.metadata,
          },
        }),
      );
      runningBefore = runningAfter;
    }
    if (paidDebit > 0) {
      ledgerRows.push(
        await tx.creditLedger.create({
          data: {
            userId: input.userId,
            moduleKey: input.moduleKey,
            actionKey: input.actionKey,
            amount: -paidDebit,
            balanceBefore: runningBefore,
            balanceAfter,
            bucket: CreditBucket.paid,
            idempotencyKey: input.idempotencyKey,
            metadata: input.metadata,
          },
        }),
      );
    }

    const firstLedger = ledgerRows[0];

    return {
      ok: true,
      ledgerId: firstLedger.id,
      ledgerIds: ledgerRows.map((item) => item.id),
      balanceBefore,
      balanceAfter,
      deduplicated: false,
    };
  });
}
