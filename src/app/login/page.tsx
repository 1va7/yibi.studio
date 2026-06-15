import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPanel from "@/components/LoginPanel";
import { providerStatus } from "@/lib/auth-options";

export const metadata: Metadata = {
  title: "登录",
  description: "用AI打造可以自我进化的公司。",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-copy">
        <h1>用AI打造可以自我进化的公司</h1>
      </div>
      <Suspense fallback={<div className="login-panel" />}>
        <LoginPanel
          googleEnabled={providerStatus.google}
          githubEnabled={providerStatus.github}
        />
      </Suspense>
    </div>
  );
}
