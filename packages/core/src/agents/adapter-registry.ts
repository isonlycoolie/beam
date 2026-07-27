import type { McpClientAdapter } from "./mcp-client-adapter.js";

export const SUPPORTED_MCP_CLIENTS = [
  "codex",
  "cursor",
  "claude-code",
] as const;
export type SupportedMcpClient = (typeof SUPPORTED_MCP_CLIENTS)[number];

export function createUnsupportedAdapter(id: string): McpClientAdapter {
  return {
    id,
    displayName: id,
    async detect() {
      return { detected: false, reason: "Manual MCP config required." };
    },
    async readConfig() {
      return {};
    },
    async writeBeamConfig() {
      throw new Error("Automatic MCP config writes are not implemented yet.");
    },
    async validate() {
      return { valid: false, message: "Manual MCP config required." };
    },
  };
}

export function getMcpClientAdapter(id: string): McpClientAdapter {
  return createUnsupportedAdapter(id);
}
