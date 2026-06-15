import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import AccountDashboard from "@/components/AccountDashboard";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "个人看板",
  description: "管理异璧账户、积分与模块访问令牌。",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default async function AccountPage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      roles: true,
      accounts: {
        select: {
          provider: true,
        },
      },
      creditAccount: {
        select: {
          balance: true,
        },
      },
      creditLedger: {
        select: {
          id: true,
          moduleKey: true,
          actionKey: true,
          amount: true,
          balanceAfter: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const displayName = user.name || user.email || "异璧用户";
  const providers = user.accounts.map((account) => account.provider);

  return (
    <div className="account-page">
      <section className="account-hero" aria-labelledby="account-title">
        <div className="account-avatar" aria-hidden>
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={88}
              height={88}
              unoptimized
            />
          ) : (
            <span>{displayName.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="eyebrow">Account</p>
          <h1 id="account-title">{displayName}</h1>
          <p>{user.email || "未设置邮箱"}</p>
        </div>
      </section>

      <section className="account-grid" aria-label="账户概览">
        <div className="account-panel">
          <h2>账户</h2>
          <dl className="account-facts">
            <div>
              <dt>User ID</dt>
              <dd>{user.id}</dd>
            </div>
            <div>
              <dt>Provider</dt>
              <dd>{providers.length ? providers.join(", ") : "credentials"}</dd>
            </div>
            <div>
              <dt>Roles</dt>
              <dd>{user.roles.length ? user.roles.join(", ") : "user"}</dd>
            </div>
          </dl>
        </div>

        <div className="account-panel">
          <h2>积分</h2>
          <p className="credit-balance">{user.creditAccount?.balance ?? 0}</p>
          <p className="credit-caption">当前可用余额</p>
        </div>
      </section>

      <AccountDashboard signOutCallbackUrl="/" />

      <section className="account-panel account-ledger" aria-labelledby="ledger-title">
        <div className="account-panel-head">
          <h2 id="ledger-title">最近积分流水</h2>
          <span>最近 10 条</span>
        </div>
        {user.creditLedger.length ? (
          <div className="ledger-table">
            <div className="ledger-row ledger-head">
              <span>模块</span>
              <span>动作</span>
              <span>变动</span>
              <span>余额</span>
              <span>时间</span>
            </div>
            {user.creditLedger.map((item) => (
              <div className="ledger-row" key={item.id}>
                <span>{item.moduleKey}</span>
                <span>{item.actionKey}</span>
                <span className={item.amount >= 0 ? "is-plus" : "is-minus"}>
                  {item.amount > 0 ? `+${item.amount}` : item.amount}
                </span>
                <span>{item.balanceAfter}</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="account-empty">暂无积分流水。</p>
        )}
      </section>
    </div>
  );
}
