import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { grantCredits } from "@/lib/credits";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_registration" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email },
    include: { password: true },
  });
  if (existing?.password) {
    return NextResponse.json(
      { ok: false, error: "email_already_registered" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: parsed.data.name,
      password: {
        create: { passwordHash },
      },
      creditAccount: {
        create: { balance: 0 },
      },
    },
    update: {
      name: parsed.data.name,
      password: {
        create: { passwordHash },
      },
      creditAccount: {
        upsert: {
          create: { balance: 0 },
          update: {},
        },
      },
    },
  });

  const initialCredits = Number(process.env.INITIAL_CREDITS ?? 0);
  if (initialCredits > 0) {
    await grantCredits({
      userId: user.id,
      amount: initialCredits,
      moduleKey: "system",
      actionKey: "signup_bonus",
      idempotencyKey: `signup_bonus:${user.id}`,
      metadata: { source: "register" },
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true, userId: user.id });
}

export const dynamic = "force-dynamic";
