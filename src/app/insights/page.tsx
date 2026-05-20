import { listInsights, type InsightRow } from "@/lib/feishu";
import InsightsExplorer from "@/components/InsightsExplorer";
import SocialDock from "@/components/SocialDock";
import { autoLinkTopics, buildGroups } from "@/lib/insightsGroups";

export const metadata = {
  title: "洞察",
  description:
    "从一线交付里挑出来的判断、案例与踩过的坑—— 跨境怎么做、AI 怎么落，每周更新。聚合公众号、视频号、小红书、抖音上的真实内容。",
};
export const revalidate = 60; // 1 min ISR

export default async function InsightsPage() {
  let rows: InsightRow[] = [];
  try {
    const live = await listInsights();
    if (live && live.length > 0) {
      rows = live;
    }
  } catch (e) {
    console.error("Feishu load failed", e);
  }
  // No fallback — if Feishu fails, the explorer renders its own empty state.

  const linked = autoLinkTopics(rows);
  const groups = buildGroups(linked);

  // Collect all distinct tags for filter chips
  const bizTagSet = new Set<string>();
  const formTagSet = new Set<string>();
  groups.forEach((g) => {
    g.allTags.forEach((t) => bizTagSet.add(t));
    g.allTagsForm.forEach((t) => formTagSet.add(t));
  });
  const allBizTags = Array.from(bizTagSet).sort();
  const allFormTags = Array.from(formTagSet).sort();
  const videoCount = groups.filter((g) => g.hasVideo).length;

  return (
    <div className="wrap">
      <section className="page-hero has-social">
        <div className="page-hero-main">
          <div className="eyebrow">
            洞察 · INSIGHTS · {groups.length} 主题 · {videoCount} 视频
          </div>
          <h1>
            在跨境 + AI 这条线上,
            <br />
            我们<em>每周都在写。</em>
          </h1>
          <p className="lede">
            从一线交付里挑出来的判断、案例与踩过的坑——跨境怎么做、AI 怎么落,每周更新。
          </p>
        </div>
        <aside className="page-hero-aside">
          <SocialDock variant="hero" />
        </aside>
      </section>

      <InsightsExplorer
        groups={groups}
        allBizTags={allBizTags}
        allFormTags={allFormTags}
      />
    </div>
  );
}
