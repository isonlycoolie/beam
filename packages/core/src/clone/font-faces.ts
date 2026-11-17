import type { RecordedAsset } from "./asset-recorder.js";

/**
 * Pulls every @font-face rule out of the page's CSS and points its url() at the font files Beam saved,
 * so the clone loads the exact same font files with the same weights and ranges.
 */
export function extractFontFaces(input: { css: Array<{ text: string; baseUrl: string }>; assets: RecordedAsset[] }): string {
  const byUrl = new Map(input.assets.filter((a) => a.kind === "font").map((a) => [a.url, a.file]));
  const seen = new Set<string>();
  const rules: string[] = [];
  for (const sheet of input.css) {
    for (const match of sheet.text.matchAll(/@font-face\s*{[^}]*}/g)) {
      const rule = match[0].replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (whole, _q: string, ref: string) => {
        if (ref.startsWith("data:")) return whole;
        let absolute: string;
        try {
          absolute = new URL(ref, sheet.baseUrl).href;
        } catch {
          return whole;
        }
        const local = byUrl.get(absolute);
        return local ? `url("./${local}")` : `url("${absolute}")`;
      });
      const key = rule.replace(/\s+/g, " ");
      if (!seen.has(key)) {
        seen.add(key);
        rules.push(rule);
      }
    }
  }
  return rules.length ? `/* Captured by Beam from the source page. */\n${rules.join("\n\n")}\n` : "";
}
