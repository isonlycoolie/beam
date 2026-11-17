import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { measurePage, settlePage, STILL_CSS } from "../verify/capture.js";
import type { PageCapture } from "../verify/types.js";
import { recordAssets, type RecordedAsset } from "./asset-recorder.js";
import { renderCloneBrief } from "./clone-brief.js";
import { extractFontFaces } from "./font-faces.js";
import { extractTokens, type DesignTokens } from "./tokens.js";

export type CloneBreakpoint = Omit<PageCapture, "png"> & { screenshot: string };
export type CloneSpec = {
  schemaVersion: "1.0";
  url: string;
  capturedAt: string;
  title: string;
  breakpoints: CloneBreakpoint[];
  tokens: DesignTokens;
  assets: RecordedAsset[];
  fontsCss?: string;
};

export type CloneResult = { dir: string; spec: CloneSpec };

/** Folder name for a URL: host plus path, safe on every OS. */
export function cloneFolderName(url: string): string {
  const { host, pathname } = new URL(url);
  return `${host}${pathname === "/" ? "" : pathname}`.replace(/[^a-zA-Z0-9.-]+/g, "_").replace(/_+$/, "");
}

/**
 * Captures everything needed to rebuild a page exactly: screenshots and measured elements per breakpoint,
 * the real font, image and CSS files, @font-face rules, design tokens and the rendered HTML structure.
 */
export async function captureForClone(input: { url: string; cwd: string; breakpoints?: number[] }): Promise<CloneResult> {
  const widths = [...(input.breakpoints ?? [1440, 768, 390])].sort((a, b) => b - a);
  const dir = resolve(input.cwd, ".beam", "clone", cloneFolderName(input.url));
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const browser = await chromium.launch();
  const breakpoints: CloneBreakpoint[] = [];
  const assets = new Map<string, RecordedAsset>();
  let title = "";
  let css: Array<{ text: string; baseUrl: string }> = [];
  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const recorder = recordAssets(page, dir);
      try {
        await settlePage(page, input.url);
        const { png, ...measured } = await measurePage(page, input.url, width);
        const screenshot = `${width}.png`;
        await writeFile(join(dir, screenshot), png);
        breakpoints.push({ ...measured, screenshot });
        if (width === widths[0]) {
          title = await page.title();
          // Scripts are dropped: the structure is for reading, not for running someone else's code.
          const html = (await page.content())
            .replace(/<script\b[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>([^<]*)<\/style>/g, (tag, css: string) => (css === STILL_CSS ? "" : tag));
          await writeFile(join(dir, "structure.html"), html);
          css = await page.evaluate(() =>
            [...document.querySelectorAll("style")].map((s) => ({ text: s.textContent ?? "", baseUrl: location.href })),
          );
        }
      } finally {
        for (const asset of await recorder.done()) assets.set(asset.url, asset);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  const recorded = [...assets.values()];
  for (const sheet of recorded.filter((a) => a.kind === "stylesheet"))
    css.push({ text: await readFile(join(dir, sheet.file), "utf8"), baseUrl: sheet.url });
  const fontsCss = extractFontFaces({ css, assets: recorded });
  if (fontsCss) await writeFile(join(dir, "fonts.css"), fontsCss);

  const spec: CloneSpec = {
    schemaVersion: "1.0",
    url: input.url,
    capturedAt: new Date().toISOString(),
    title,
    breakpoints,
    tokens: extractTokens(breakpoints[0]?.elements ?? []),
    assets: recorded,
    fontsCss: fontsCss ? "fonts.css" : undefined,
  };
  await writeFile(join(dir, "spec.json"), `${JSON.stringify(spec, null, 2)}\n`);
  await writeFile(join(dir, "brief.md"), renderCloneBrief(spec));
  return { dir, spec };
}
