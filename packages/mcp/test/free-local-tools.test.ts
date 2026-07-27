import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("Free local MCP tools", () => {
  it("registers snapshot and mapping tools", () => {
    const names: string[] = [];
    const server = {
      tool(name: string) {
        names.push(name);
      },
    };

    registerBeamTools(server as never, { cwd: process.cwd() });

    expect(names).toContain("list_snapshots");
    expect(names).toContain("restore_snapshot");
    expect(names).toContain("list_component_mappings");
  });
});
