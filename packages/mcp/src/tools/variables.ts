import { getFileVariables } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { jsonContent, toolError } from "./responses.js";

export function registerVariableTools(
  server: McpServer,
  context: BeamToolContext,
): void {
  server.tool(
    "get_file_variables",
    "Fetch Figma variables when available.",
    { url: z.string().url(), refresh: z.boolean().default(false) },
    async (input) => {
      try {
        const runGetVariables = context.getFileVariables ?? getFileVariables;
        return jsonContent(await runGetVariables({ url: input.url }));
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
