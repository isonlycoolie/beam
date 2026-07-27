import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export type BeamToolContext = {
  cwd: string;
};

export function registerBeamTools(
  server: McpServer,
  _context: BeamToolContext,
): void {
  server.tool("beam_ping", "Check Beam MCP server availability.", {}, async () => ({
    content: [{ type: "text", text: "Beam MCP server is running." }],
  }));
}
