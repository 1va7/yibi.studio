"use client";

import { Copy, KeyRound, LogOut } from "lucide-react";
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
