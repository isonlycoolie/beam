import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerBeamTools } from "./tools/index.js";

export type StartMcpServerInput = {
  cwd?: string;
};

export function createMcpServer(input: StartMcpServerInput = {}): McpServer {
  const server = new McpServer({
    name: "beam",
    version: "0.1.0",
  });

  registerBeamTools(server, { cwd: input.cwd ?? process.cwd() });
  return server;
}

export async function startMcpServer(
  input: StartMcpServerInput = {},
): Promise<void> {
  const server = createMcpServer(input);
  const transport = new StdioServerTransport();

  await server.connect(transport);
}
