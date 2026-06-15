import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export async function verifyModuleApiKey(req: NextRequest) {
  const raw =
    req.headers.get("x-module-api-key") ||
    req.headers.get("authorization")?.replace(/^ApiKey\s+/i, "");
  if (!raw) return null;

  const keyHash = hashKey(raw.trim());
  const record = await prisma.moduleApiKey.findUnique({
    where: { keyHash },
  });
  if (!record?.active || !safeEqual(record.keyHash, keyHash)) return null;
  return record;
}
