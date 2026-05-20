import QRCode from "qrcode";

export async function svgQR(text: string, size = 180): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    width: size,
    margin: 1,
    color: { dark: "#1F1C18", light: "#FFFFFF" },
  });
}
