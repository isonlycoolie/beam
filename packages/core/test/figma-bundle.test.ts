import { existsSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { describe, expect, it } from "vitest";
import { importFigmaBundle, openCaptureSession, verifyBuild, type BundleNode, type FigmaBundle } from "../src/index.js";

const fixture = (name: string) => pathToFileURL(join(import.meta.dirname, "fixtures", "verify", name)).href;

/** Builds a bundle the way the plugin would, from the reference page's real render and text layers. */
async function bundleFromReference(): Promise<FigmaBundle> {
  const session = await openCaptureSession();
  try {
    const page = await session.capture(fixture("reference.html"), 1024);
    const texts: BundleNode[] = page.elements
      .filter((el) => el.text)
      .map((el, i) => ({
        id: `1:${i + 2}`,
        name: el.text,
        type: "TEXT",
        box: el.box,
        opacity: 1,
        fills: [],
        children: [],
        text: {
          characters: el.text,
          fontFamily: el.style.fontFamily.split(",")[0]!.replace(/"/g, ""),
          fontStyle: "Regular",
          fontWeight: Number(el.style.fontWeight),
          fontSize: parseFloat(el.style.fontSize),
          lineHeight: el.style.lineHeight,
          letterSpacing: el.style.letterSpacing,
          align: "left",
          textCase: "none",
          color: el.style.color,
        },
      }));
    const png = page.png.toString("base64");
    return {
      schemaVersion: "1.0",
      source: { fileName: "Site", pageName: "Web", frameName: "Landing 1024", nodeId: "1:1" },
      exportedAt: "2026-11-17T00:00:00.000Z",
      frame: { id: "1:1", name: "Landing 1024", type: "FRAME", box: { x: 0, y: 0, width: 1024, height: page.height }, opacity: 1, fills: ["rgb(255, 255, 255)"], children: texts },
      renders: { "1x": png, "2x": png },
      images: { abc: Buffer.from("png-bytes").toString("base64") },
      svgs: { "9:9": "<svg/>" },
      variables: [{ collection: "Brand", name: "ink", mode: "Light", type: "COLOR", value: "rgb(20, 20, 60)" }],
    };
  } finally {
    await session.close();
  }
}

describe.skipIf(!existsSync(chromium.executablePath()))("figma bundle import and drift check", () => {
  it("imports a plugin export and flags drift against the design", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-figma-"));
    await writeFile(join(cwd, "landing.beam.json"), JSON.stringify(await bundleFromReference()));

    const { dir, spec } = await importFigmaBundle({ file: "landing.beam.json", cwd });
    expect(spec.url).toBe("figma:.beam/figma/landing-1024");
    expect(await readFile(join(dir, "images", "abc.png"), "utf8")).toBe("png-bytes");
    expect(await readFile(join(dir, "svgs", "9-9.svg"), "utf8")).toBe("<svg/>");
    const brief = await readFile(join(dir, "brief.md"), "utf8");
    expect(brief).toContain('Figma frame "Landing 1024"');
    expect(brief).toContain("`Brand/ink` (Light): `rgb(20, 20, 60)`");

    const same = await verifyBuild({ reference: spec.url, target: fixture("reference.html"), cwd });
    expect(same.passed).toBe(true);

    const drift = await verifyBuild({ reference: spec.url, target: fixture("target.html"), cwd });
    expect(drift.passed).toBe(false);
    expect(drift.breakpoints[0]?.elements?.deltas).toContainEqual(expect.objectContaining({ property: "fontSize", expected: "64px", actual: "56px" }));
    expect(drift.breakpoints[0]?.elements?.missing.map((m) => m.text)).toContain("Contact");
  }, 120_000);

  it("rejects files that are not Beam exports", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-figma-"));
    await writeFile(join(cwd, "x.json"), "{}");
    await expect(importFigmaBundle({ file: "x.json", cwd })).rejects.toMatchObject({ payload: { code: "BEAM_INVALID_INPUT" } });
  });
});
