import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createDesignContext, contextModeSchema } from "@beam/core";
import { z } from "zod";
import { jsonContent, toolError } from "./responses.js";

export type BeamToolContext = {
  cwd: string;
  createDesignContext?: typeof createDesignContext;
};

export function registerBeamTools(
  server: McpServer,
  context: BeamToolContext,
): void {
  server.tool("beam_ping", "Check Beam MCP server availability.", {}, async () => ({
    content: [{ type: "text", text: "Beam MCP server is running." }],
  }));

  server.tool(
    "get_design_context",
    "Fetch agent-ready Beam design context for a Figma URL.",
    {
      url: z.string().url(),
      mode: contextModeSchema.default("standard"),
      includeImage: z.boolean().default(true),
      includeAssets: z.boolean().default(true),
      refresh: z.boolean().default(false),
    },
    async (input) => {
      try {
        const runCreateDesignContext =
          context.createDesignContext ?? createDesignContext;
        const response = await runCreateDesignContext({
          ...input,
          cwd: context.cwd,
        });

        return jsonContent(response);
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
