import { existsSync } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { describe, expect, it } from "vitest";
import { judge, judgeWeight, reviewPage, type ReviewFacts } from "../src/index.js";

const clean: ReviewFacts = { contrast: [], targets: [], sizes: { "16px": 3 }, spacing: { "16px": 2 }, families: { Inter: 3 }, imagesWithoutAlt: [], overflowX: false, headings: { h1: 1, skips: 0 }, gradientText: 0, lang: "en" };

describe("craft judge", () => {
  it("finds nothing on a clean page and flags type sprawl and off-grid spacing", () => {
    expect(judge(1440, clean)).toEqual([]);
    const messy = judge(1440, { ...clean, sizes: Object.fromEntries([...Array(10)].map((_, i) => [`${12 + i}px`, 1])), spacing: { "13px": 1, "7px": 1, "11px": 1, "5px": 1, "9px": 1 } });
    expect(messy.map((f) => f.area)).toEqual(["type", "spacing"]);
  });

  it("treats small targets as high severity on phones only", () => {
    const facts = { ...clean, targets: [{ element: "a", width: 16, height: 16 }] };
    expect(judge(390, facts)[0]?.severity).toBe("high");
    expect(judge(1440, facts)[0]?.severity).toBe("medium");
  });

  it("budgets page weight", () => {
    expect(judgeWeight({ bytes: 1024, requests: 10 })).toEqual([]);
    expect(judgeWeight({ bytes: 6 * 1024 * 1024, requests: 100 }).map((f) => f.severity)).toEqual(["high", "low"]);
  });
});

describe.skipIf(!existsSync(chromium.executablePath()))("craft review in a real browser", () => {
  it("measures contrast, targets, overflow, alt text, headings and gradient text", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-craft-"));
    const url = pathToFileURL(join(import.meta.dirname, "fixtures", "craft", "page.html")).href;
    const review = await reviewPage({ url, cwd, breakpoints: [390] });
    const areas = new Set(review.findings.map((f) => f.area));
    expect(review.passed).toBe(false);
    for (const area of ["contrast", "layout", "touch", "a11y", "structure", "taste"]) expect(areas).toContain(area);
    expect(review.findings.find((f) => f.area === "contrast")?.message).toContain('p "Low contrast copy"');
    // Skip links, inline links and code samples are not flagged.
    const messages = review.findings.map((f) => f.message).join(" | ");
    expect(messages).not.toContain("Skip to content");
    expect(messages).not.toContain('a "guide"');
    expect(messages).not.toMatch(/font families/);
  }, 60_000);
});
