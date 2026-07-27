import { describe, expect, it } from "vitest";
import { createMcpServer } from "../src/index.js";

describe("MCP server", () => {
  it("creates a Beam MCP server", () => {
    const server = createMcpServer({ cwd: process.cwd() });

    expect(server).toBeDefined();
  });
});
