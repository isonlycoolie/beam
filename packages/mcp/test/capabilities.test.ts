import { describe, expect, it } from "vitest";
import { freeMcpCapabilities } from "../src/tools/index.js";

describe("Free MCP capabilities", () => {
  it("lists the documented Free tools", () => {
    expect(freeMcpCapabilities).toMatchObject({
      plan: "free",
      tools: expect.arrayContaining([
        "get_design_context",
        "list_snapshots",
        "restore_snapshot",
        "list_component_mappings",
        "compare_render",
      ]),
    });
  });
});
