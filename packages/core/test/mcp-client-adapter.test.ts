import { describe, expect, it } from "vitest";
import { createBeamMcpConfig, mergeBeamMcpConfig } from "../src/index.js";

describe("MCP client adapter helpers", () => {
  it("creates global Beam MCP config", () => {
    expect(createBeamMcpConfig("global")).toEqual({
      mcpServers: { beam: { command: "beam", args: ["mcp"] } },
    });
  });

  it("creates local Beam MCP config with usebeam", () => {
    expect(createBeamMcpConfig("local")).toEqual({
      mcpServers: { beam: { command: "npx", args: ["usebeam", "mcp"] } },
    });
  });

  it("preserves unrelated MCP servers during merge", () => {
    const merged = mergeBeamMcpConfig(
      { mcpServers: { other: { command: "tool" } } },
      "global",
    );

    expect(merged["mcpServers"]).toMatchObject({
      other: { command: "tool" },
      beam: { command: "beam", args: ["mcp"] },
    });
  });
});
