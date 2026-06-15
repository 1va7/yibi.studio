import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export type CreditConsumeInput = {
  userId: string;
  moduleKey: string;
  actionKey: string;
  amount: number;
  idempotencyKey: string;
  metadata?: Prisma.InputJsonValue;
};

export async function getCreditBalance(userId: string) {
  const account = await prisma.creditAccount.findUnique({
    where: { userId },
    select: { balance: true },
  });
  return account?.balance ?? 0;
}

export async function grantCredits(params: {
  userId: string;
  amount: number;
  moduleKey?: string;
  actionKey?: string;
  idempotencyKey?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!Number.isInteger(params.amount) || params.amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const moduleKey = params.moduleKey ?? "system";
  const actionKey = params.actionKey ?? "grant";
  const idempotencyKey =
    params.idempotencyKey ?? `${moduleKey}:${actionKey}:${crypto.randomUUID()}`;

  return prisma.$transaction(async (tx) => {
    const current = await tx.creditAccount.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, balance: 0 },
      update: {},
    });
    const balanceBefore = current.balance;
    const balanceAfter = balanceBefore + params.amount;

    const account = await tx.creditAccount.update({
      where: { userId: params.userId },
      data: { balance: balanceAfter },
    });

    const ledger = await tx.creditLedger.create({
      data: {
        userId: params.userId,
        moduleKey,
        actionKey,
        amount: params.amount,
        balanceBefore,
        balanceAfter: account.balance,
        idempotencyKey,
        metadata: params.metadata,
      },
    });

    return {
      ok: true,
      ledgerId: ledger.id,
      balanceBefore,
      balanceAfter: account.balance,
      deduplicated: false,
    };
  });
}

export async function consumeCredits(input: CreditConsumeInput) {
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.creditLedger.findUnique({
      where: {
        userId_moduleKey_actionKey_idempotencyKey: {
          userId: input.userId,
          moduleKey: input.moduleKey,
          actionKey: input.actionKey,
          idempotencyKey: input.idempotencyKey,
        },
      },
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

    const account = await tx.creditAccount.upsert({
      where: { userId: input.userId },
      create: { userId: input.userId, balance: 0 },
      update: {},
    });

    if (account.balance < input.amount) {
      throw new Error("insufficient_credits");
    }

    const balanceBefore = account.balance;
    const balanceAfter = balanceBefore - input.amount;

    await tx.creditAccount.update({
      where: { userId: input.userId },
      data: { balance: balanceAfter },
    });

    const ledger = await tx.creditLedger.create({
      data: {
        userId: input.userId,
        moduleKey: input.moduleKey,
        actionKey: input.actionKey,
        amount: -input.amount,
        balanceBefore,
        balanceAfter,
        idempotencyKey: input.idempotencyKey,
        metadata: input.metadata,
      },
    });

    return {
      ok: true,
      ledgerId: ledger.id,
      balanceBefore,
      balanceAfter,
      deduplicated: false,
    };
  });
}
