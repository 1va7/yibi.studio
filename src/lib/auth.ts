import { SignJWT, jwtVerify } from "jose";
import { getServerSession } from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth-options";
import { getCreditBalance } from "@/lib/credits";
import { prisma } from "@/lib/db";

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function jwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or AUTH_SECRET is required");
  }
  return new TextEncoder().encode(secret);
}

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function getStandardSession(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });
  if (!user) return null;

  const now = Math.floor(Date.now() / 1000);
  const creditBalance = await getCreditBalance(user.id);

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.image,
    providers: user.accounts.map((account) => account.provider),
    roles: user.roles,
    creditBalance,
    issuedAt: now,
    expiresAt: now + ACCESS_TOKEN_TTL_SECONDS,
  };
}

export async function getUiSession(userId: string) {
  const session = await getStandardSession(userId);
  if (!session) return null;

  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    avatarUrl: session.avatarUrl,
    providers: session.providers,
    roles: session.roles,
    creditBalance: session.creditBalance,
  };
}

export function getAccessTokenExpiresAt() {
  return Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS;
}

export async function issueAccessToken(userId: string) {
  return new SignJWT({ typ: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(jwtSecret());
}

export async function verifyAccessToken(token: string) {
  const verified = await jwtVerify(token, jwtSecret());
  if (!verified.payload.sub) return null;
  return {
    userId: verified.payload.sub,
    issuedAt: verified.payload.iat ?? null,
    expiresAt: verified.payload.exp ?? null,
  };
}

export async function getBearerUser(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  try {
    return await verifyAccessToken(authorization.slice("Bearer ".length).trim());
  } catch {
    return null;
  }
}

export async function requireUser(req?: NextRequest) {
  if (req) {
    const bearer = await getBearerUser(req);
    if (bearer?.userId) return { userId: bearer.userId, source: "bearer" as const };
  }

  const session = await getAuthSession();
  const userId = session?.user?.id;
  if (!userId) return null;
  return { userId, source: "cookie" as const };
}
