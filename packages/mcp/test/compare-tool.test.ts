import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("compare MCP tool", () => {
  it("registers compare_render", () => {
    const names: string[] = [];
    const server = {
      tool(name: string) {
        names.push(name);
      },
    };

    registerBeamTools(server as never, { cwd: process.cwd() });

    expect(names).toContain("compare_render");
  });
});
