import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import Analytics from "@/components/Analytics";
import { svgQR } from "@/lib/qr";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yibi.studio"),
  title: {
    default: "异璧科技 · 用 AI 打造可以自我进化的公司",
    template: "%s · 异璧科技",
  },
  description:
    "异璧科技把跨境电商的整套运营、社媒内容的完整产线、企业级大模型网关，打成可按方案购买的产品级交付包。从经验蒸馏到 Agent 落地，让 AI 真正变成业务系统。",
  keywords: [
    "AI Agent",
    "数字员工",
    "经验蒸馏",
    "跨境电商 AI",
    "Amazon AI 运营",
    "社媒内容工厂",
    "OpenClaw",
    "OPAL",
    "企业级大模型网关",
    "AI 落地",
    "异璧科技",
  ],
  authors: [{ name: "异璧科技", url: "https://yibi.studio" }],
  creator: "异璧科技",
  publisher: "异璧科技",
  applicationName: "yibi.studio",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://yibi.studio",
    siteName: "异璧科技",
    title: "异璧科技 · 用 AI 打造可以自我进化的公司",
    description:
      "把跨境电商运营、社媒内容产线、企业级大模型网关，打成可按方案购买的产品级交付包。",
    locale: "zh_CN",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: "异璧科技",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "异璧科技 · 用 AI 打造可以自我进化的公司",
    description:
      "把跨境电商运营、社媒内容产线、企业级大模型网关，打成可按方案购买的产品级交付包。",
    images: ["/assets/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* 社群入口 QR — 飞书问卷 URL (同 /skills /courses /home 用的同一张表).
     扫码 → 30 秒填问卷 → 自动收到入群邀请链接.
     Social-channel QRs (公众号/视频号) now live as real PNG/JPG assets
     under /public/assets/team/ and are read directly by SocialDock via
     src/lib/social.ts — no server-side QR generation needed for them. */
  const communityQR = await svgQR(
    "https://ycnm1prsz3tg.feishu.cn/share/base/form/shrcnCu8CiLYWFiOJJIy9lOTqxd",
    200
  );

  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700;800&family=Noto+Serif+SC:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="atmosphere" />
        <Nav />
        <main className="page">{children}</main>
        <Footer />
        <FloatingCTA qrSvg={communityQR} />
        <Analytics />
      </body>
    </html>
  );
}
