import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { codexAdapter } from "./codex-adapter.js";
import { beamServerCommand, exists } from "./mcp-command.js";
import type { McpClientAdapter } from "./mcp-client-adapter.js";

export { beamServerCommand } from "./mcp-command.js";

export type AdapterContext = { cwd: string; homeDir?: string; platform?: NodeJS.Platform };

async function readJson(path: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Claude Code (.mcp.json) and Cursor (.cursor/mcp.json) share the mcpServers JSON shape. */
function jsonAdapter(
  id: string,
  displayName: string,
  configPath: string,
  markers: string[],
  platform?: NodeJS.Platform,
): McpClientAdapter {
  return {
    id,
    displayName,
    async detect() {
      for (const marker of markers) if (await exists(marker)) return { detected: true, configPath };
      return { detected: false, configPath, reason: `No ${displayName} files found in this project.` };
    },
    readConfig: () => readJson(configPath),
    async writeBeamConfig() {
      const config = await readJson(configPath);
      const servers = (config.mcpServers ?? {}) as Record<string, unknown>;
      config.mcpServers = { ...servers, beam: beamServerCommand(platform) };
      await mkdir(dirname(configPath), { recursive: true });
      await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
    },
    async validate() {
      const servers = (await readJson(configPath)).mcpServers as Record<string, unknown> | undefined;
      return servers?.beam
        ? { valid: true, message: `Beam is registered in ${configPath}.` }
        : { valid: false, message: `Beam is missing from ${configPath}.` };
    },
  };
}

export function createClientAdapter(id: string, context: AdapterContext): McpClientAdapter | undefined {
  const { cwd, platform } = context;
  const home = context.homeDir ?? homedir();
  if (id === "claude-code")
    return jsonAdapter(id, "Claude Code", join(cwd, ".mcp.json"), [join(cwd, ".claude"), join(cwd, "CLAUDE.md"), join(cwd, ".mcp.json")], platform);
  if (id === "cursor")
    return jsonAdapter(id, "Cursor", join(cwd, ".cursor", "mcp.json"), [join(cwd, ".cursor")], platform);
  if (id === "codex") return codexAdapter(home, platform);
  return undefined;
}
