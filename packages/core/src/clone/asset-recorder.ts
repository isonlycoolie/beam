import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import type { Page, Response } from "playwright";

export type RecordedAsset = { url: string; kind: "font" | "image" | "stylesheet"; file: string; bytes: number };

const KINDS: Record<string, RecordedAsset["kind"]> = { font: "font", image: "image", stylesheet: "stylesheet" };
const MAX_BYTES = 15 * 1024 * 1024;

/** A readable, collision-free file name: original base name plus a short hash of the full URL. */
export function assetFileName(url: string, contentType = ""): string {
  const path = new URL(url).pathname;
  const base = (path.split("/").pop() || "asset").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  const ext = extname(base) || (contentType.includes("svg") ? ".svg" : contentType.includes("css") ? ".css" : "");
  return `${base.replace(/\.[^.]*$/, "")}-${hash}${ext}`;
}

/**
 * Saves every font, image and stylesheet the page loads, exactly as the server sent it,
 * so the clone uses the real files instead of look-alikes.
 */
export function recordAssets(page: Page, outDir: string) {
  const assets = new Map<string, RecordedAsset>();
  const pending: Promise<void>[] = [];
  const onResponse = (response: Response) => {
    const kind = KINDS[response.request().resourceType()];
    const url = response.url();
    if (!kind || assets.has(url) || !url.startsWith("http") || !response.ok()) return;
    pending.push(
      (async () => {
        const body = await response.body().catch(() => undefined);
        if (!body || body.length > MAX_BYTES) return;
        const file = join(`${kind}s`, assetFileName(url, response.headers()["content-type"]));
        await mkdir(join(outDir, `${kind}s`), { recursive: true });
        await writeFile(join(outDir, file), body);
        assets.set(url, { url, kind, file: file.replace(/\\/g, "/"), bytes: body.length });
      })(),
    );
  };
  page.on("response", onResponse);
  return {
    async done(): Promise<RecordedAsset[]> {
      page.off("response", onResponse);
      await Promise.all(pending);
      return [...assets.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.file.localeCompare(b.file));
    },
  };
}
