import { chromium, type Browser } from "playwright";
import { PAGE_SCRIPT } from "./page-script.js";
import type { CapturedElement, CapturedSection, PageCapture } from "./types.js";

/** Freezes motion so two captures of the same page give the same pixels. */
const STILL_CSS = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;

export type CaptureSession = {
  capture(url: string, width: number): Promise<PageCapture>;
  close(): Promise<void>;
};

export async function openCaptureSession(options: { viewportHeight?: number } = {}): Promise<CaptureSession> {
  const browser: Browser = await chromium.launch();
  return {
    async capture(url, width) {
      const page = await browser.newPage({ viewport: { width, height: options.viewportHeight ?? 900 }, deviceScaleFactor: 1 });
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
        await page.addStyleTag({ content: STILL_CSS });
        // Scroll the whole page once so lazy images and on-scroll content are in place before measuring.
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((done) => setTimeout(done, 120));
          }
          window.scrollTo(0, 0);
          await document.fonts.ready;
        });
        await page.waitForLoadState("networkidle").catch(() => undefined);
        const data = (await page.evaluate(PAGE_SCRIPT)) as {
          elements: CapturedElement[];
          sections: CapturedSection[];
          height: number;
        };
        const png = await page.screenshot({ fullPage: true, animations: "disabled" });
        return { url, width, height: data.height, png, elements: data.elements, sections: data.sections };
      } finally {
        await page.close();
      }
    },
    close: () => browser.close(),
  };
}
