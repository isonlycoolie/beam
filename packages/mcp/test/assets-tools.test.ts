import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("asset MCP tools", () => {
  it("registers asset and variable tools", () => {
    const names: string[] = [];
    const server = {
      tool(name: string) {
        names.push(name);
      },
    };

    registerBeamTools(server as never, { cwd: process.cwd() });

    expect(names).toContain("get_node_image");
    expect(names).toContain("list_assets");
    expect(names).toContain("download_assets");
    expect(names).toContain("get_file_variables");
  });
});
