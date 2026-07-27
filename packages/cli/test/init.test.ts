import { describe, expect, it, vi } from "vitest";
import { initCommand } from "../src/index.js";

describe("init command", () => {
  it("prints manual MCP config", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await initCommand({ print: true });

    expect(String(write.mock.calls[0]?.[0])).toContain('"command": "beam"');
    expect(String(write.mock.calls[0]?.[0])).toContain('"mcp"');
    write.mockRestore();
  });

  it("falls back when automatic config is unavailable", async () => {
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await initCommand({ client: "codex", json: true });

    expect(String(write.mock.calls[0]?.[0])).toContain("manual config");
    write.mockRestore();
  });
});
