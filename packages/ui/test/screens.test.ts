import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const screens = join(import.meta.dirname, "..", "registry", "screens");
const reference = readFileSync(join(import.meta.dirname, "..", "..", "kits", "craft", "references", "screens.md"), "utf8");

describe("screens", () => {
  const ids = readdirSync(screens);

  it("every screen is in the agents' reference (run scripts/screens-reference.mjs)", () => {
    for (const id of ids) expect(reference, id).toContain(`\`${id}\``);
  });

  it("sixteen sidebar layouts ship as components", () => {
    const groups = ids.map((id) => JSON.parse(readFileSync(join(screens, id, "spec.json"), "utf8")).group);
    expect(groups.filter((g) => g === "Sidebar")).toHaveLength(16);
  });
});
