"use client";

import { Copy, CreditCard, KeyRound, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

type AccountDashboardProps = {
  signOutCallbackUrl?: string;
};

type TokenState =
  | { status: "idle"; accessToken: null; expiresAt: null; error: null }
  | { status: "loading"; accessToken: null; expiresAt: null; error: null }
  | { status: "ready"; accessToken: string; expiresAt: number; error: null }
  | { status: "error"; accessToken: null; expiresAt: null; error: string };

export default function AccountDashboard({
  signOutCallbackUrl = "/",
}: AccountDashboardProps) {
  const [token, setToken] = useState<TokenState>({
    status: "idle",
    accessToken: null,
    expiresAt: null,
    error: null,
  });
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState<string | null>(null);

  async function createOrder(itemType: string) {
    setBillingMessage(null);
    setBillingLoading(itemType);
    try {
      const response = await fetch("/api/billing/orders", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itemType,
          quantity: itemType === "credit_pack" ? quantity : undefined,
          discountCode: discountCode.trim() || undefined,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        completed?: boolean;
        paymentUrl?: string | null;
        error?: string;
      };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "order_failed");
      }
      if (data.completed) {
        setBillingMessage("订单已完成，权益已发放。");
        window.location.reload();
        return;
      }
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      setBillingMessage("订单已创建，但未返回支付地址。");
    } catch (error) {
      setBillingMessage(
        error instanceof Error ? error.message : "创建订单失败，请稍后重试。",
      );
    } finally {
      setBillingLoading(null);
    }
  }

  async function generateToken() {
    setCopied(false);
    setToken({
      status: "loading",
      accessToken: null,
      expiresAt: null,
      error: null,
    });

    try {
      const response = await fetch("/api/access-token", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      const data = (await response.json()) as {
        ok?: boolean;
        accessToken?: string;
        expiresAt?: number;
      };
      if (!response.ok || !data.ok || !data.accessToken || !data.expiresAt) {
        throw new Error("token_failed");
      }
      setToken({
        status: "ready",
        accessToken: data.accessToken,
        expiresAt: data.expiresAt,
        error: null,
      });
    } catch {
      setToken({
        status: "error",
        accessToken: null,
        expiresAt: null,
        error: "生成失败，请稍后重试。",
      });
    }
  }

  async function copyToken() {
    if (!token.accessToken) return;
    await navigator.clipboard.writeText(token.accessToken);
    setCopied(true);
  }

  return (
    <div className="account-actions" aria-label="账户操作">
      <div className="account-action-card billing-card">
        <div>
          <h2>购买积分与订阅</h2>
          <p>订阅额度按购买日周期刷新，额外积分包不过期。</p>
        </div>
        <div className="billing-controls">
          <label>
            <span>折扣码</span>
            <input
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              placeholder="可选"
            />
          </label>
          <label>
            <span>积分包数量</span>
            <input
              type="number"
              min={1}
              max={999}
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value) || 1))
              }
            />
          </label>
        </div>
        <div className="billing-options">
          <button
            type="button"
            className="account-button primary"
            onClick={() => createOrder("monthly_subscription")}
            disabled={billingLoading !== null}
          >
            <CreditCard size={16} aria-hidden />
            <span>{billingLoading === "monthly_subscription" ? "处理中" : "月付 ¥19.9"}</span>
          </button>
          <button
            type="button"
            className="account-button primary"
            onClick={() => createOrder("yearly_subscription")}
            disabled={billingLoading !== null}
          >
            <CreditCard size={16} aria-hidden />
            <span>{billingLoading === "yearly_subscription" ? "处理中" : "年付 ¥199"}</span>
          </button>
          <button
            type="button"
            className="account-button"
            onClick={() => createOrder("credit_pack")}
            disabled={billingLoading !== null}
          >
            <CreditCard size={16} aria-hidden />
            <span>{billingLoading === "credit_pack" ? "处理中" : "100 积分 ¥2"}</span>
          </button>
        </div>
        {billingMessage && <p className="account-error">{billingMessage}</p>}
      </div>

      <div className="account-action-card">
        <div>
          <h2>模块访问令牌</h2>
          <p>令牌只在本次生成后显示，刷新页面不会保留明文。</p>
        </div>
        <button
          type="button"
          className="account-button primary"
          onClick={generateToken}
          disabled={token.status === "loading"}
        >
          <KeyRound size={16} aria-hidden />
          <span>{token.status === "loading" ? "生成中" : "生成访问令牌"}</span>
        </button>
        {token.status === "ready" && (
          <div className="token-box">
            <div className="token-meta">
              <span>
                过期时间：
                {new Date(token.expiresAt * 1000).toLocaleString("zh-CN", {
                  hour12: false,
                })}
              </span>
              <button type="button" onClick={copyToken}>
                <Copy size={14} aria-hidden />
                <span>{copied ? "已复制" : "复制"}</span>
              </button>
            </div>
            <code>{token.accessToken}</code>
          </div>
        )}
        {token.status === "error" && (
          <p className="account-error">{token.error}</p>
        )}
      </div>

      <button
        type="button"
        className="account-button"
        onClick={() => signOut({ callbackUrl: signOutCallbackUrl })}
      >
        <LogOut size={16} aria-hidden />
        <span>退出登录</span>
      </button>
    </div>
  );
}
