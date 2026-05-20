import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
