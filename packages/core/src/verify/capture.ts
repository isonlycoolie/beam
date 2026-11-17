import { chromium, type Browser, type Page } from "playwright";
import { PAGE_SCRIPT } from "./page-script.js";
import type { CapturedElement, CapturedSection, PageCapture } from "./types.js";

/** Freezes motion so two captures of the same page give the same pixels. */
export const STILL_CSS = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;

/** Loads a page, freezes motion and scrolls it once so lazy images and on-scroll content are in place. */
export async function settlePage(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.addStyleTag({ content: STILL_CSS });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 120));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForLoadState("networkidle").catch(() => undefined);
}

/** Measures a settled page: every visible element with its computed styles, the sections, and a full screenshot. */
export async function measurePage(page: Page, url: string, width: number): Promise<PageCapture> {
  const data = (await page.evaluate(PAGE_SCRIPT)) as {
    elements: CapturedElement[];
    sections: CapturedSection[];
    height: number;
  };
  const png = await page.screenshot({ fullPage: true, animations: "disabled" });
  return { url, width, height: data.height, png, elements: data.elements, sections: data.sections };
}

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
        await settlePage(page, url);
        return await measurePage(page, url, width);
      } finally {
        await page.close();
      }
    },
    close: () => browser.close(),
  };
}
