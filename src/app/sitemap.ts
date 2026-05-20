import type { MetadataRoute } from "next";

const BASE = "https://yibi.studio";

type Route = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: Route[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services/aigc", changeFrequency: "weekly", priority: 0.8 },
  { path: "/solutions", changeFrequency: "weekly", priority: 0.9 },
  { path: "/solutions/amazon-ai", changeFrequency: "weekly", priority: 0.9 },
  { path: "/solutions/content-factory", changeFrequency: "weekly", priority: 0.9 },
  { path: "/solutions/llm-gateway", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/distill", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products/labs", changeFrequency: "weekly", priority: 0.7 },
  { path: "/products/labs/openclaw-pm", changeFrequency: "monthly", priority: 0.7 },
  { path: "/products/labs/opal", changeFrequency: "monthly", priority: 0.6 },
  { path: "/products/labs/opal/bridge", changeFrequency: "monthly", priority: 0.6 },
  { path: "/products/labs/opal/mirror", changeFrequency: "monthly", priority: 0.6 },
  { path: "/skills", changeFrequency: "daily", priority: 0.9 },
  { path: "/insights", changeFrequency: "daily", priority: 0.9 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/community", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
