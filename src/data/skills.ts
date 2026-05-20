// Mock skills data. Will be replaced by Feishu Bitable.
export type Skill = {
  slug: string;
  name_zh: string;
  name_en?: string;
  one_liner_zh: string;
  category: string;
  delivery_type: "skill" | "agent" | "harness" | "plugin";
  output?: string;
  estimated_time?: string;
  source: "自研" | "公开 curate";
  is_featured?: boolean;
};

export const CATEGORIES = [
  "选品",
  "Listing",
  "广告",
  "关键词",
  "评论与口碑",
  "客服",
  "仓储与履约",
  "站外引流",
  "社媒内容",
  "数据复盘",
  "合规与风控",
];

export const SKILLS: Skill[] = [
  { slug: "selection-five-look", name_zh: "五看选品框架", one_liner_zh: "用五维度（市场/竞品/利润/供应/合规）系统化筛选选品机会", category: "选品", delivery_type: "skill", source: "自研", is_featured: true, estimated_time: "20-40 min" },
  { slug: "aba-keyword-mining", name_zh: "ABA 关键词挖掘", one_liner_zh: "基于亚马逊 Brand Analytics 做 N-gram 关键词树", category: "关键词", delivery_type: "skill", source: "自研", is_featured: true },
  { slug: "rufus-faq-extraction", name_zh: "Rufus FAQ 抓取", one_liner_zh: "采集类目下 Rufus 高频问答用于 Listing 埋点", category: "Listing", delivery_type: "skill", source: "自研", is_featured: true },
  { slug: "listing-cosmo-optimization", name_zh: "COSMO 视觉优化", one_liner_zh: "围绕亚马逊 COSMO 规则优化主图与 A+ 图", category: "Listing", delivery_type: "skill", source: "自研" },
  { slug: "review-sentiment-mining", name_zh: "评论情绪挖掘", one_liner_zh: "竞品 + 自家评论的痛点抽取与频率聚类", category: "评论与口碑", delivery_type: "skill", source: "公开 curate", is_featured: true },
  { slug: "ngram-ad-keyword", name_zh: "N-gram 广告关键词策略", one_liner_zh: "AI 驱动的力导向图广告投放结构", category: "广告", delivery_type: "skill", source: "自研" },
  { slug: "weekly-review-agent", name_zh: "每周复盘 Agent", one_liner_zh: "自动汇总卖家精灵 + 后台数据出周报", category: "数据复盘", delivery_type: "agent", source: "自研", is_featured: true },
  { slug: "xhs-script-writer", name_zh: "小红书 IP 口播脚本", one_liner_zh: "面向跨境老板的小红书 IP 内容生产", category: "社媒内容", delivery_type: "skill", source: "自研" },
  { slug: "douyin-hook-tester", name_zh: "抖音前 3 秒钩子测试", one_liner_zh: "批量生成 hook 候选 + 数据回测", category: "社媒内容", delivery_type: "skill", source: "公开 curate" },
  { slug: "amzn-customer-service", name_zh: "客服话术 Agent", one_liner_zh: "Amazon 站内信 + Buyer Message 标准应答", category: "客服", delivery_type: "agent", source: "公开 curate" },
  { slug: "inventory-forecast", name_zh: "库存预测 Skill", one_liner_zh: "基于销售季节性的备货量推荐", category: "仓储与履约", delivery_type: "skill", source: "公开 curate" },
  { slug: "off-amazon-traffic", name_zh: "站外引流计划生成", one_liner_zh: "Reddit / TikTok / IG 流量计划自动出方案", category: "站外引流", delivery_type: "skill", source: "自研" },
  { slug: "compliance-checklist", name_zh: "合规自查清单", one_liner_zh: "Listing / 广告 / 数据采集的合规风险预检", category: "合规与风控", delivery_type: "skill", source: "公开 curate" },
];

export function getSkillsByCategory(category: string) {
  return SKILLS.filter((s) => s.category === category);
}

export function getFeaturedSkills() {
  return SKILLS.filter((s) => s.is_featured);
}
