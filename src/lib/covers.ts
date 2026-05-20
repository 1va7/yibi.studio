// Central image-URL hygiene for upstream platform covers.
//
// XHS serves covers as HEIF and Douyin as HEIC — neither decodes in desktop
// browsers. XHS doesn't sign the `format` param so a path rewrite works; Douyin
// signs the whole URL including extension, so we proxy through wsrv.nl (a free
// public image rewriter) which re-encodes HEIC → JPEG.

export function cleanCoverUrl(url?: string): string | undefined {
  if (!url) return url;
  const out = url.replace(/\/format\/heif/g, "/format/jpg");
  if (/\.heic(\?|$|~)/.test(out)) {
    return `https://wsrv.nl/?url=${encodeURIComponent(out)}&output=jpg&w=720`;
  }
  return out;
}
