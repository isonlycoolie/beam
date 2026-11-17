import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("verify MCP tool", () => {
  it("returns the agent brief from the report", async () => {
    const reportDir = await mkdtemp(join(tmpdir(), "beam-mcp-verify-"));
    await mkdir(reportDir, { recursive: true });
    await writeFile(join(reportDir, "report.md"), "# Beam verify: FAIL\n- fontSize should be 64px, is 56px\n");
    const handlers = new Map<string, (input: unknown) => Promise<{ content: Array<{ text: string }> }>>();
    const server = { tool: (name: string, _d: string, _s: unknown, handler: never) => handlers.set(name, handler) };

    registerBeamTools(server as never, {
      cwd: process.cwd(),
      verifyBuild: (async () => ({ reportDir })) as never,
    });
    const result = await handlers.get("verify_build")!({ reference: "https://a.test", target: "http://localhost:3000" });

    expect(result.content[0]?.text).toContain("fontSize should be 64px, is 56px");
    expect(result.content[0]?.text).toContain("report.json");
  });
});
