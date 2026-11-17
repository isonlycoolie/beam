import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { describe, expect, it } from "vitest";

const demo = pathToFileURL(join(import.meta.dirname, "fixtures", "glass", "demo.html")).href;

describe.skipIf(!existsSync(chromium.executablePath()))("glass kit styles in Chromium", () => {
  it("renders frosted, refracting, readable surfaces with a 44px button", async () => {
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
      await page.goto(demo);
      const panel = await page.$eval("#panel", (el) => {
        const cs = getComputedStyle(el);
        return { backdrop: cs.backdropFilter, radius: cs.borderRadius, liquid: getComputedStyle(el, "::before").backdropFilter, color: cs.color };
      });
      expect(panel.backdrop).toContain("blur(14px)");
      expect(panel.liquid).toContain("url(");
      expect(panel.radius).toBe("24px");
      expect(panel.color).toBe("rgb(255, 255, 255)");
      const button = await page.$eval("#button", (el) => el.getBoundingClientRect().height);
      expect(button).toBeGreaterThanOrEqual(44);

      await page.emulateMedia({ reducedMotion: "reduce" });
      expect(await page.$eval("#button", (el) => getComputedStyle(el).transitionDuration)).toBe("0s");
    } finally {
      await browser.close();
    }
  }, 60_000);
});
