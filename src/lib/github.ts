/**
 * Fetch GitHub repo stars with ISR-style cache.
 * Public repos don't need auth — 60 req/hr/IP rate limit, plenty for SSG/ISR.
 * Revalidates every 6 hours so stars stay reasonably fresh without hammering GitHub.
 */

export type StarInfo = {
  stars: number | null; // null means API failure, render "—"
  fetchedAt: number; // unix ms when this server render produced the value
  ok: boolean;
};

const FALLBACK_STARS: Record<string, number> = {
  // last-known values; used only as a soft fallback before we even tried
  "1va7/openclaw-pm": 398,
  "1va7/opal-bridge": 37,
  "1va7/opal-mirror": 0,
  "1va7/opal": 0,
};

export async function getRepoStars(repo: string): Promise<number> {
  const info = await getRepoStarInfo(repo);
  return info.stars ?? FALLBACK_STARS[repo] ?? 0;
}

export async function getRepoStarInfo(repo: string): Promise<StarInfo> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 21600 }, // 6 hours
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!res.ok) {
      return { stars: null, fetchedAt: Date.now(), ok: false };
    }
    const data = (await res.json()) as { stargazers_count?: number };
    const n =
      typeof data.stargazers_count === "number" ? data.stargazers_count : null;
    return { stars: n, fetchedAt: Date.now(), ok: n !== null };
  } catch {
    return { stars: null, fetchedAt: Date.now(), ok: false };
  }
}

export function formatStars(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1000) {
    const k = (n / 1000).toFixed(1);
    return `${k.endsWith(".0") ? k.slice(0, -2) : k}k`;
  }
  return n.toString();
}

/**
 * Format "updated X ago" in mono small caps style, in Chinese.
 * Cache window is 6h so resolution is hourly.
 */
export function formatFetchedAt(ms: number): string {
  const diff = Date.now() - ms;
  const hours = Math.floor(diff / 3_600_000);
  if (hours <= 0) return "刚刚更新";
  if (hours < 24) return `${hours} 小时前更新`;
  const days = Math.floor(hours / 24);
  return `${days} 天前更新`;
}
