import { afterEach, describe, expect, it, vi } from "vitest";

const startMcpServer = vi.fn(async () => undefined);

vi.mock("@beam/mcp", () => ({
  startMcpServer,
}));

vi.mock("@beam/core", () => ({
  createBeamMcpConfig: () => ({
    mcpServers: { beam: { command: "beam", args: ["mcp"] } },
  }),
  getMcpClientAdapter: () => ({
    detect: async () => ({ detected: false }),
  }),
  runDoctorChecks: async () => ({
    checks: [
      {
        id: "node-version",
        label: "Node.js >= 22.12.0",
        status: "pass",
        message: "v22.14.0",
      },
    ],
  }),
  SUPPORTED_MCP_CLIENTS: ["codex"],
}));

describe("release CLI smoke paths", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    startMcpServer.mockClear();
  });

  it("prints doctor JSON without exposing secrets", async () => {
    const { doctorCommand } = await import("../src/index.js");
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await doctorCommand({ json: true });

    const output = String(write.mock.calls[0]?.[0]);
    const parsed = JSON.parse(output);

    expect(Array.isArray(parsed.checks)).toBe(true);
    expect(output).toContain("node-version");
    expect(output).not.toContain("figd_");
  });

  it("prints manual init config for agents", async () => {
    const { initCommand } = await import("../src/index.js");
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await initCommand({ print: true });

    const output = String(write.mock.calls[0]?.[0]);

    expect(output).toContain('"command": "beam"');
    expect(output).toContain('"args"');
    expect(output).toContain('"mcp"');
  });

  it("starts MCP through the CLI command", async () => {
    const { mcpCommand } = await import("../src/index.js");

    await mcpCommand();

    expect(startMcpServer).toHaveBeenCalledWith({ cwd: process.cwd() });
  });
});
