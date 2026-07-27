import { startMcpServer } from "@beam/mcp";

export async function mcpCommand(): Promise<void> {
  await startMcpServer({ cwd: process.cwd() });
}
