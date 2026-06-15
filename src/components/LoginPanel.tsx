"use client";

import { signIn } from "next-auth/react";
import { GitBranch, Mail } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginPanelProps = {
  googleEnabled: boolean;
  githubEnabled: boolean;
};

export default function LoginPanel({
  googleEnabled,
  githubEnabled,
}: LoginPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") ||
    `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "");

    if (mode === "register") {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      if (!response.ok) {
        setPending(false);
        setStatus("注册失败，请确认邮箱未被占用且密码不少于 8 位。");
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(false);

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
      return;
    }
    setStatus("登录失败，请检查邮箱和密码。");
  }

  return (
    <section className="login-panel" aria-label="登录">
      <div className="login-panel-head">
        <h1>登录异璧账户</h1>
      </div>

      <div className="oauth-stack">
        <button
          type="button"
          className="oauth-button"
          disabled={!googleEnabled}
          onClick={() => signIn("google", { callbackUrl })}
          title={googleEnabled ? "使用 Google 登录" : "Google OAuth 未配置"}
        >
          <span className="oauth-mark">G</span>
          <span>{googleEnabled ? "使用 Google 登录" : "Google 未配置"}</span>
        </button>
        <button
          type="button"
          className="oauth-button"
          disabled={!githubEnabled}
          onClick={() => signIn("github", { callbackUrl })}
          title={githubEnabled ? "使用 GitHub 登录" : "GitHub App 未配置"}
        >
          <GitBranch size={18} aria-hidden />
          <span>{githubEnabled ? "使用 GitHub 登录" : "GitHub 未配置"}</span>
        </button>
      </div>

      <div className="login-divider">
        <span>邮箱密码</span>
      </div>

      <div className="login-mode" role="tablist" aria-label="登录模式">
        <button
          type="button"
          className={mode === "signin" ? "is-active" : ""}
          onClick={() => setMode("signin")}
        >
          登录
        </button>
        <button
          type="button"
          className={mode === "register" ? "is-active" : ""}
          onClick={() => setMode("register")}
        >
          注册
        </button>
      </div>

      <form className="credentials-form" onSubmit={handleCredentials}>
        {mode === "register" && (
          <label>
            <span>姓名</span>
            <input name="name" autoComplete="name" placeholder="你的名字" />
          </label>
        )}
        <label>
          <span>邮箱</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@yibi.studio"
          />
        </label>
        <label>
          <span>密码</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
            placeholder="至少 8 位"
          />
        </label>
        <button className="login-submit" type="submit" disabled={pending}>
          <Mail size={16} aria-hidden />
          <span>{pending ? "处理中" : mode === "signin" ? "登录" : "注册并登录"}</span>
        </button>
      </form>

      {status && <p className="login-status">{status}</p>}
    </section>
  );
}
