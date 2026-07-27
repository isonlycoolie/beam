import { describe, expect, it } from "vitest";
import {
  planImplementationBrief,
  type ImplementationBrief,
} from "../src/index.js";

const brief: ImplementationBrief = {
  frame: { name: "Frame", nodeCount: 1 },
  layout: { sections: ["Hero"] },
  components: [],
  tokens: {
    colors: ["#ffffff"],
    typography: [{ fontFamily: "Inter", fontSize: 16 }],
    radii: [8],
    text: ["Hello"],
    effects: ["shadow"],
  },
  assets: [],
  implementationNotes: ["Note one", "Note two", "Note three"],
};

describe("planImplementationBrief", () => {
  it("defaults to standard mode", () => {
    const result = planImplementationBrief(brief);

    expect(result.brief.tokens).toMatchObject({
      colors: ["#ffffff"],
      radii: [8],
    });
    expect(result.estimatedTokens).toBeGreaterThan(0);
  });

  it("omits low-value data in summary mode", () => {
    const result = planImplementationBrief(brief, "summary");

    expect(result.brief.tokens).not.toHaveProperty("effects");
    expect(result.brief.implementationNotes).toHaveLength(2);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ code: "LOW_VALUE_DATA_OMITTED" }),
    );
  });

  it("warns in raw mode", () => {
    expect(planImplementationBrief(brief, "raw").warnings).toContainEqual(
      expect.objectContaining({ code: "RAW_MODE_SELECTED" }),
    );
  });
});
