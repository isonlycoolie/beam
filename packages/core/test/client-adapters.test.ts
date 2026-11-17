import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { beamServerCommand, createClientAdapter } from "../src/index.js";

const temp = () => mkdtemp(join(tmpdir(), "beam-adapters-"));

describe("MCP client adapters", () => {
  it("uses cmd /c npx on Windows and plain npx elsewhere", () => {
    expect(beamServerCommand("win32")).toEqual({ command: "cmd", args: ["/c", "npx", "-y", "usebeam", "mcp"] });
    expect(beamServerCommand("darwin")).toEqual({ command: "npx", args: ["-y", "usebeam", "mcp"] });
  });

  it("detects Claude Code and merges beam into .mcp.json without dropping other servers", async () => {
    const cwd = await temp();
    await mkdir(join(cwd, ".claude"));
    await writeFile(join(cwd, ".mcp.json"), JSON.stringify({ mcpServers: { other: { command: "x" } } }));
    const adapter = createClientAdapter("claude-code", { cwd, platform: "linux" })!;

    expect((await adapter.detect()).detected).toBe(true);
    await adapter.writeBeamConfig("local");

    const config = JSON.parse(await readFile(join(cwd, ".mcp.json"), "utf8"));
    expect(config.mcpServers.other).toEqual({ command: "x" });
    expect(config.mcpServers.beam).toEqual({ command: "npx", args: ["-y", "usebeam", "mcp"] });
    expect((await adapter.validate()).valid).toBe(true);
  });

  it("writes Cursor config under .cursor/mcp.json", async () => {
    const cwd = await temp();
    const adapter = createClientAdapter("cursor", { cwd })!;

    expect((await adapter.detect()).detected).toBe(false);
    await adapter.writeBeamConfig("local");

    expect((await adapter.validate()).valid).toBe(true);
  });

  it("replaces the beam table in Codex config.toml and keeps the rest", async () => {
    const home = await temp();
    await mkdir(join(home, ".codex"));
    const path = join(home, ".codex", "config.toml");
    await writeFile(path, 'model = "gpt"\n\n[mcp_servers.beam]\ncommand = "beam"\nargs = ["mcp"]\n\n[mcp_servers.other]\ncommand = "o"\n');
    const adapter = createClientAdapter("codex", { cwd: home, homeDir: home, platform: "linux" })!;

    await adapter.writeBeamConfig("local");
    await adapter.writeBeamConfig("local");

    const toml = await readFile(path, "utf8");
    expect(toml).toContain('model = "gpt"');
    expect(toml).toContain("[mcp_servers.other]");
    expect(toml.match(/\[mcp_servers\.beam\]/g)).toHaveLength(1);
    expect(toml).toContain('args = ["-y","usebeam","mcp"]');
    expect((await adapter.validate()).valid).toBe(true);
  });

  it("returns undefined for clients Beam does not know", () => {
    expect(createClientAdapter("vim", { cwd: "." })).toBeUndefined();
  });
});
