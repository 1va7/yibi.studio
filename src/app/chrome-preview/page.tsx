export const metadata = {
  title: "顶部与底部组件预览",
  description: "异璧站点顶部导航与底部页脚的组合预览页。",
};

export default function ChromePreviewPage() {
  return (
    <section
      className="wrap"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignContent: "center",
        gap: 18,
        paddingTop: 160,
        paddingBottom: 96,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--mono)",
          fontSize: 12,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        Component Preview
      </p>
      <h1
        style={{
          margin: 0,
          maxWidth: 760,
          fontFamily: "var(--serif-cn)",
          fontSize: "clamp(36px, 6vw, 78px)",
          lineHeight: 1,
          color: "var(--cream)",
        }}
      >
        顶部导航与底部页脚组合预览
      </h1>
      <p
        style={{
          margin: 0,
          maxWidth: 680,
          fontSize: 16,
          lineHeight: 1.8,
          color: "var(--muted-2)",
        }}
      >
        这个页面只用于确认当前站点的顶部头和底部部分在同一页面中的真实渲染效果。
        确认无误后，再继续拆出 npm 包并发布到 GitHub Packages。
      </p>
    </section>
  );
}
