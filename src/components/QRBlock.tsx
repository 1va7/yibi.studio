import { svgQR } from "@/lib/qr";

export default async function QRBlock({
  url,
  label = "扫码",
  size = 180,
}: {
  url: string;
  label?: string;
  size?: number;
}) {
  const svg = await svgQR(url, size);
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 12,
          border: "1px solid var(--line)",
          lineHeight: 0,
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: ".18em",
          color: "var(--muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}
