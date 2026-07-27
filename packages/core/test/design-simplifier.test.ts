import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { simplifyDesign } from "../src/index.js";

describe("simplifyDesign", () => {
  it("creates a deterministic implementation brief from fixture JSON", async () => {
    const fixture = await readFixture("simple-card", "nodes.json");
    const expectedBrief = await readFixture(
      "simple-card",
      "expected-brief.standard.json",
    );
    const expectedWarnings = await readFixture(
      "simple-card",
      "expected-warnings.json",
    );
    const document = fixture.nodes["1:2"].document;

    const result = simplifyDesign({ document });

    expect(result.brief).toEqual(expectedBrief);
    expect(result.warnings).toEqual(expectedWarnings);
  });

  it.each(["nav-bar", "form", "pricing-cards", "dashboard-section"])(
    "matches the %s golden fixture",
    async (name) => {
      const fixture = await readFixture(name, "nodes.json");
      const expectedBrief = await readFixture(
        name,
        "expected-brief.standard.json",
      );
      const expectedWarnings = await readFixture(
        name,
        "expected-warnings.json",
      );
      const document = Object.values(fixture.nodes)[0].document;

      const result = simplifyDesign({ document });

      expect(result.brief).toEqual(expectedBrief);
      expect(result.warnings).toEqual(expectedWarnings);
    },
  );

  it("reports repeated structures and omissions", () => {
    const result = simplifyDesign({
      document: {
        id: "1:1",
        name: "Frame",
        type: "FRAME",
        children: [
          { id: "1:2", name: "Card", type: "FRAME" },
          { id: "1:3", name: "Card", type: "FRAME" },
        ],
      },
    });

    expect(result.brief.implementationNotes).toContain(
      "Repeated structures: Card x2.",
    );
    expect(result.brief.implementationNotes).toContain(
      "Omitted: raw vector paths, invisible layers.",
    );
  });
});

async function readFixture(name: string, file: string): Promise<any> {
  return JSON.parse(
    await readFile(
      join(process.cwd(), "..", "..", "fixtures", "figma", name, file),
      "utf8",
    ),
  );
}
