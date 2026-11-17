import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { beamServerCommand, exists } from "./mcp-command.js";
import type { McpClientAdapter } from "./mcp-client-adapter.js";

// The beam table runs until the next line that opens another table.
const CODEX_BLOCK = /^\[mcp_servers\.beam\]\r?\n(?:(?!\[)[^\n]*(?:\n|$))*/m;

/** Codex reads MCP servers from ~/.codex/config.toml as [mcp_servers.<name>] tables. */
export function codexAdapter(home: string, platform?: NodeJS.Platform): McpClientAdapter {
  const configPath = join(home, ".codex", "config.toml");
  const read = () => readFile(configPath, "utf8").catch(() => "");
  return {
    id: "codex",
    displayName: "Codex",
    async detect() {
      return (await exists(join(home, ".codex")))
        ? { detected: true, configPath }
        : { detected: false, configPath, reason: "No ~/.codex folder found." };
    },
    readConfig: read,
    async writeBeamConfig() {
      const { command, args } = beamServerCommand(platform);
      const block = `[mcp_servers.beam]\ncommand = ${JSON.stringify(command)}\nargs = ${JSON.stringify(args)}\n`;
      const current = (await read()).replace(CODEX_BLOCK, "").trimEnd();
      await mkdir(dirname(configPath), { recursive: true });
      await writeFile(configPath, `${current ? `${current}\n\n` : ""}${block}`);
    },
    async validate() {
      return CODEX_BLOCK.test(await read())
        ? { valid: true, message: `Beam is registered in ${configPath}.` }
        : { valid: false, message: `Beam is missing from ${configPath}.` };
    },
  };
}
