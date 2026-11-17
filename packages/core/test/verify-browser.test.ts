import { readFile } from "node:fs/promises";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { verifyBuild } from "../src/index.js";

const fixture = (name: string) => pathToFileURL(join(import.meta.dirname, "fixtures", "verify", name)).href;
const hasBrowser = existsSync(chromium.executablePath());

describe.skipIf(!hasBrowser)("verify in a real browser", () => {
  it("passes a page against itself", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-verify-"));
    const report = await verifyBuild({ reference: fixture("reference.html"), target: fixture("reference.html"), cwd, breakpoints: [1024] });
    expect(report.passed).toBe(true);
    expect(report.breakpoints[0]?.score).toBe(1);
  }, 60_000);

  it("fails a drifted build with the exact values to fix", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-verify-"));
    const report = await verifyBuild({ reference: fixture("reference.html"), target: fixture("target.html"), cwd, breakpoints: [1024] });
    const bp = report.breakpoints[0]!;
    expect(report.passed).toBe(false);
    expect(bp.sections.map((s) => s.label)).toEqual(["header", "section.hero", "footer"]);
    expect(bp.elements?.deltas).toContainEqual(expect.objectContaining({ tag: "h1", property: "fontSize", expected: "64px", actual: "56px" }));
    expect(bp.elements?.missing).toContainEqual({ path: "body>footer>a", tag: "a", text: "Contact" });
    const brief = await readFile(join(report.reportDir, "report.md"), "utf8");
    expect(brief).toContain('<h1> "Ship exact UI": fontSize should be 64px, is 56px');
  }, 60_000);

  it("judges only the chosen sections so a page can be checked top-down", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-verify-"));
    const report = await verifyBuild({ reference: fixture("reference.html"), target: fixture("target.html"), cwd, breakpoints: [1024], sections: [1] });
    expect(report.breakpoints[0]?.sections.map((s) => s.label)).toEqual(["header"]);
    expect(report.passed).toBe(true);
  }, 60_000);
});
