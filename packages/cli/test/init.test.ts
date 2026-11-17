import { mkdir, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { initCommand } from "../src/index.js";

const capture = () => vi.spyOn(process.stdout, "write").mockImplementation(() => true);

describe("init command", () => {
  afterEach(() => vi.restoreAllMocks());

  it("prints the npx MCP config", async () => {
    const write = capture();

    await initCommand({ print: true });

    const output = String(write.mock.calls[0]?.[0]);
    expect(output).toContain("usebeam");
    expect(output).toContain('"mcp"');
    write.mockRestore();
  });

  it("registers Beam with every agent detected in the project", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-init-"));
    const home = await mkdtemp(join(tmpdir(), "beam-home-"));
    await mkdir(join(cwd, ".claude"));
    await mkdir(join(cwd, ".cursor"));
    const write = capture();

    await initCommand({ cwd, homeDir: home, json: true });

    const output = JSON.parse(String(write.mock.calls[0]?.[0]));
    expect(output.results.map((r: { client: string }) => r.client)).toEqual(["claude-code", "cursor"]);
    expect(await readFile(join(cwd, ".mcp.json"), "utf8")).toContain("usebeam");
    expect(await readFile(join(cwd, ".cursor", "mcp.json"), "utf8")).toContain("usebeam");
    write.mockRestore();
  });

  it("never writes the global Codex config unless asked", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-init-"));
    const home = await mkdtemp(join(tmpdir(), "beam-home-"));
    await mkdir(join(home, ".codex"));
    const write = capture();

    await initCommand({ cwd, homeDir: home, json: true });
    expect(JSON.parse(String(write.mock.calls[0]?.[0])).results).toEqual([]);

    await initCommand({ cwd, homeDir: home, client: "codex", json: true });
    expect(await readFile(join(home, ".codex", "config.toml"), "utf8")).toContain("usebeam");
  });

  it("explains the manual config when no agent is found", async () => {
    const cwd = await mkdtemp(join(tmpdir(), "beam-init-"));
    const write = capture();

    await initCommand({ cwd, homeDir: cwd });

    expect(String(write.mock.calls[0]?.[0])).toContain("No supported agent found");
    write.mockRestore();
  });
});
