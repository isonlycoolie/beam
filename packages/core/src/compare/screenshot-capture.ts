import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "playwright";

export async function captureUrlScreenshot(input: {
  url: string;
  outputPath: string;
  width?: number;
  height?: number;
}): Promise<string> {
  await mkdir(dirname(input.outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: {
        width: input.width ?? 1440,
        height: input.height ?? 900,
      },
    });

    await page.goto(input.url, { waitUntil: "networkidle" });
    await page.screenshot({ path: input.outputPath, fullPage: true });
    return input.outputPath;
  } finally {
    await browser.close();
  }
}
