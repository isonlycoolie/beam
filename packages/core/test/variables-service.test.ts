import { describe, expect, it } from "vitest";
import { getFileVariables } from "../src/index.js";

describe("getFileVariables", () => {
  it("returns an empty variables warning when unavailable", async () => {
    const result = await getFileVariables({
      url: "https://www.figma.com/design/abc/File?node-id=1-2",
      figmaClient: {
        getVariables: async () => {
          throw new Error("unavailable");
        },
      },
    });

    expect(result.variables).toEqual([]);
    expect(result.warnings[0]?.code).toBe("FIGMA_VARIABLES_UNAVAILABLE");
  });
});
