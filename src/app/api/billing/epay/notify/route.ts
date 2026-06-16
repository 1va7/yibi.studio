import { NextRequest } from "next/server";
import { completeBillingOrder, verifyEpaySign } from "@/lib/billing";
import { prisma } from "@/lib/db";

async function parseParams(req: NextRequest) {
  if (req.method === "GET") {
    return Object.fromEntries(new URL(req.url).searchParams.entries());
  }
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null);
    return body && typeof body === "object"
      ? Object.fromEntries(
          Object.entries(body).map(([key, value]) => [key, String(value)]),
        )
      : {};
  }
  const form = await req.formData().catch(() => null);
  return form
    ? Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value)]))
    : {};
}

async function handleNotify(req: NextRequest) {
  const params = await parseParams(req);
  if (!verifyEpaySign(params)) {
    return new Response("fail", { status: 400 });
  }

  const orderNo = params.out_trade_no;
  const tradeStatus = params.trade_status;
  const gatewayTradeNo = params.trade_no || null;
  const paidMoney = Number(params.money);
  if (!orderNo || !Number.isFinite(paidMoney)) {
    return new Response("fail", { status: 400 });
  }
  if (tradeStatus && tradeStatus !== "TRADE_SUCCESS") {
    return new Response("fail", { status: 400 });
  }

  const order = await prisma.billingOrder.findUnique({ where: { orderNo } });
  if (!order) {
    return new Response("fail", { status: 404 });
  }
  if ((order.payableAmountFen / 100).toFixed(2) !== paidMoney.toFixed(2)) {
    return new Response("fail", { status: 400 });
  }

  try {
    await completeBillingOrder(orderNo, { gatewayTradeNo });
    return new Response("success", { status: 200 });
  } catch {
    return new Response("fail", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleNotify(req);
}

export async function POST(req: NextRequest) {
  return handleNotify(req);
}

export const dynamic = "force-dynamic";
