import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { figmaImportCommand } from "../src/commands/figma.js";

const PNG_1PX = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

describe("beam figma import", () => {
  afterEach(() => vi.restoreAllMocks());

  it("unpacks an export and prints the verify reference", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-cli-figma-"));
    const frame = { id: "1:1", name: "Hero", type: "FRAME", box: { x: 0, y: 0, width: 1, height: 1 }, opacity: 1, fills: [], children: [] };
    await writeFile(join(cwd, "hero.beam.json"), JSON.stringify({ schemaVersion: "1.0", source: { fileName: "F", pageName: "P", frameName: "Hero", nodeId: "1:1" }, exportedAt: "2026-11-17T00:00:00Z", frame, renders: { "1x": PNG_1PX, "2x": PNG_1PX }, images: {}, svgs: {}, variables: [] }));
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await figmaImportCommand("hero.beam.json", { cwd });

    expect(String(write.mock.calls[0]?.[0])).toContain("--reference figma:.beam/figma/hero");
    expect(await readFile(join(cwd, ".beam", "figma", "hero", "brief.md"), "utf8")).toContain("Clone brief: Hero (F)");
  });
});
