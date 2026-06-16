import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    resolveAlias: {
      "./footer.js": "./packages/chrome/src/footer.tsx",
      "./links.js": "./packages/chrome/src/links.ts",
      "./nav.js": "./packages/chrome/src/nav.tsx",
      "./site-chrome.js": "./packages/chrome/src/site-chrome.tsx",
      "./social.js": "./packages/chrome/src/social.tsx",
    },
  },
  async redirects() {
    return [
      {
        source: "/contact",
        destination:
          "https://ycnm1prsz3tg.feishu.cn/scheduler/e151cf04355136c8",
        permanent: false, // 307 — keep flexible in case scheduler URL changes
      },
    ];
  },
};

export default nextConfig;
