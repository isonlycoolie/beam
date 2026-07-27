import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { simplifyDesign } from "../src/index.js";

describe("simplifyDesign", () => {
  it("creates a deterministic implementation brief from fixture JSON", async () => {
    const fixture = await readFixture("nodes.json");
    const expectedBrief = await readFixture("expected-brief.standard.json");
    const expectedWarnings = await readFixture("expected-warnings.json");
    const document = fixture.nodes["1:2"].document;

    const result = simplifyDesign({ document });

    expect(result.brief).toEqual(expectedBrief);
    expect(result.warnings).toEqual(expectedWarnings);
  });
});

async function readFixture(file: string): Promise<any> {
  return JSON.parse(
    await readFile(
      join(process.cwd(), "..", "..", "fixtures", "figma", "simple-card", file),
      "utf8",
    ),
  );
}
