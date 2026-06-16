import { NextResponse } from "next/server";
import { getAuthSession, getUiSession } from "@/lib/auth";

const links = {
  login: "/login",
  account: "/account",
  logout: "/api/auth/signout",
};

export async function GET() {
  const authSession = await getAuthSession();
  const userId = authSession?.user?.id;
  if (!userId) {
    return NextResponse.json({
      ok: false,
      user: null,
      badges: [],
      links,
    });
  }

  const session = await getUiSession(userId);
  if (!session) {
    return NextResponse.json({
      ok: false,
      user: null,
      badges: [],
      links,
    });
  }

  return NextResponse.json({
    ok: true,
    user: {
      label: session.name || session.email || "账户",
      email: session.email,
      avatarUrl: session.avatarUrl,
    },
    badges: [
      {
        key: "credits",
        label: "积分",
        value: new Intl.NumberFormat("zh-CN").format(session.creditBalance),
      },
    ],
    links,
  });
}

export const dynamic = "force-dynamic";
