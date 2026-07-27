import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("get_design_context tool", () => {
  it("registers the design context tool", () => {
    const names: string[] = [];
    const server = {
      tool(name: string) {
        names.push(name);
      },
    };

    registerBeamTools(server as never, { cwd: process.cwd() });

    expect(names).toContain("get_design_context");
  });
});
