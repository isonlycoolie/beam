import { existsSync } from "node:fs";
import { mkdtemp, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { captureForClone, cloneFolderName } from "../src/index.js";

const PAGE = `<!doctype html><html><head><title>Acme</title><link rel="stylesheet" href="/site.css">
<style>@font-face{font-family:Brand;src:url(/fonts/brand.woff2) format("woff2");font-weight:700}</style></head>
<body><header class="top"><img src="/logo.svg" alt="Acme" width="80" height="24"></header>
<section class="hero"><h1>Build it exactly</h1><p>Measured, not guessed.</p></section></body></html>`;
const CSS = `body{margin:0;font-family:Brand,Arial,sans-serif}.top{height:64px;background:#101820}.hero{padding:96px 48px}h1{font-size:72px;letter-spacing:-2px;color:#101820}`;
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="24"><rect width="80" height="24" fill="#f60"/></svg>`;

let base = "";
const server = createServer((req, res) => {
  const routes: Record<string, [string, string]> = {
    "/": ["text/html", PAGE],
    "/site.css": ["text/css", CSS],
    "/logo.svg": ["image/svg+xml", SVG],
    "/fonts/brand.woff2": ["font/woff2", "not-a-real-font"],
  };
  const [type, body] = routes[req.url ?? ""] ?? ["text/plain", ""];
  res.writeHead(routes[req.url ?? ""] ? 200 : 404, { "content-type": type }).end(body);
});

beforeAll(async () => {
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((done) => server.close(() => done())));

describe("clone folder names", () => {
  it("names folders after host and path", () => {
    expect(cloneFolderName("https://acme.com/")).toBe("acme.com");
    expect(cloneFolderName("https://acme.com/pricing/team")).toBe("acme.com_pricing_team");
  });
});

describe.skipIf(!existsSync(chromium.executablePath()))("clone capture in a real browser", () => {
  it("saves real assets, font faces, tokens and a brief", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-clone-"));
    const { dir, spec } = await captureForClone({ url: `${base}/`, cwd, breakpoints: [390, 1280] });

    expect(spec.title).toBe("Acme");
    expect(spec.breakpoints.map((b) => b.width)).toEqual([1280, 390]);
    expect(spec.breakpoints[0]?.sections.map((s) => s.label)).toEqual(["header.top", "section.hero"]);
    expect(spec.assets.map((a) => a.kind).sort()).toEqual(["font", "image", "stylesheet"]);

    const fonts = await readFile(join(dir, "fonts.css"), "utf8");
    const font = spec.assets.find((a) => a.kind === "font")!;
    expect(fonts).toContain(`url("./${font.file}")`);
    expect(await readFile(join(dir, font.file), "utf8")).toBe("not-a-real-font");

    expect(spec.tokens.typeStyles[0]).toMatchObject({ fontSize: "72px", letterSpacing: "-2px", sample: "Build it exactly" });
    expect(spec.tokens.backgrounds[0]?.value).toBe("rgb(16, 24, 32)");
    expect(await readFile(join(dir, "structure.html"), "utf8")).not.toContain("<script");
    expect(await readFile(join(dir, "brief.md"), "utf8")).toContain("1. `header.top`: y 0, height 64px");
  }, 90_000);
});
