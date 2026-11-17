import { describe, expect, it } from "vitest";
import { extractFontFaces } from "../src/index.js";

describe("extractFontFaces", () => {
  it("points saved fonts at local files, keeps data URLs and makes other URLs absolute", () => {
    const css = extractFontFaces({
      css: [
        { text: "@font-face{font-family:A;src:url('/f/a.woff2')} @font-face{font-family:B;src:url(data:font/woff2;base64,AA==)}", baseUrl: "https://x.com/css/site.css" },
        { text: "@font-face{font-family:C;src:url(c.woff2)}", baseUrl: "https://cdn.x.com/css/" },
        { text: "@font-face{font-family:A;src:url('/f/a.woff2')}", baseUrl: "https://x.com/" },
      ],
      assets: [{ url: "https://x.com/f/a.woff2", kind: "font", file: "fonts/a-1.woff2", bytes: 1 }],
    });
    expect(css).toContain('url("./fonts/a-1.woff2")');
    expect(css).toContain("url(data:font/woff2;base64,AA==)");
    expect(css).toContain('url("https://cdn.x.com/css/c.woff2")');
    expect(css.match(/font-family:A/g)).toHaveLength(1);
  });

  it("returns nothing when the page has no font faces", () => {
    expect(extractFontFaces({ css: [{ text: "body{}", baseUrl: "https://x.com" }], assets: [] })).toBe("");
  });
});
