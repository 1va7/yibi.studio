import { NextRequest, NextResponse } from "next/server";

// Image proxy — handles douyin / xhs covers that have hotlink protection.
// Usage: <img src={`/api/img?u=${encodeURIComponent(remoteUrl)}`} />

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return new NextResponse("missing u", { status: 400 });

  // Only allow known image hosts
  const allowed = [
    "douyinpic.com",
    "rednotecdn.com",
    "xiaohongshu.com",
    "feishu.cn",
    "iesdouyin.com",
    "pstatp.com",
    "bytecdn.cn",
  ];
  let url: URL;
  try {
    url = new URL(u);
  } catch {
    return new NextResponse("bad url", { status: 400 });
  }
  if (!allowed.some((h) => url.hostname.endsWith(h))) {
    return new NextResponse("host not allowed", { status: 403 });
  }

  try {
    const r = await fetch(url.toString(), {
      headers: {
        // Some CDNs require no referrer to bypass anti-hotlink
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        accept: "image/webp,image/avif,image/png,image/jpeg,*/*",
        referer: "",
      },
      cache: "no-store",
    });
    if (!r.ok) {
      return new NextResponse(`upstream ${r.status}`, { status: 502 });
    }
    const buf = await r.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "content-type": r.headers.get("content-type") || "image/jpeg",
        "cache-control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new NextResponse("fetch error", { status: 502 });
  }
}

export const dynamic = "force-dynamic";
