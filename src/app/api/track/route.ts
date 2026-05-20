import { NextRequest, NextResponse } from "next/server";
import { BITABLE } from "@/lib/feishu";

const TABLE_ANALYTICS = process.env.FEISHU_TABLE_ANALYTICS || "tblQ5CmnAWlIoQNf";
const APP_ID = process.env.FEISHU_APP_ID || "cli_a901f2cd01b8dbd3";
const APP_SECRET = process.env.FEISHU_APP_SECRET || "pnCjjX4BYfT53qi4u4vSJbE3ar8yhlCr";

let cachedToken: { token: string; expires: number } | null = null;

async function getToken() {
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;
  const r = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
      cache: "no-store",
    },
  );
  const j = await r.json();
  cachedToken = {
    token: j.tenant_access_token,
    expires: Date.now() + 110 * 60 * 1000,
  };
  return cachedToken.token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken();
    const fields = {
      ts: Date.now(),
      event: body.event || "pageview",
      path: String(body.path || "").slice(0, 500),
      referrer: String(body.referrer || "").slice(0, 500),
      session_id: String(body.session_id || "").slice(0, 64),
      visitor_id: String(body.visitor_id || "").slice(0, 64),
      screen: String(body.screen || "").slice(0, 32),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 500),
      language: req.headers.get("accept-language")?.split(",")[0] || "",
      country:
        req.headers.get("cf-ipcountry") ||
        req.headers.get("x-vercel-ip-country") ||
        "",
      extra_json: body.extra ? JSON.stringify(body.extra).slice(0, 1000) : "",
    };
    await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BITABLE.app_token}/tables/${TABLE_ANALYTICS}/records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );
  } catch (e) {
    console.error("track error", e);
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}

export const dynamic = "force-dynamic";
