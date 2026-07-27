import { compareDesignToUrl } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { jsonContent, toolError } from "./responses.js";

export function registerCompareTools(
  server: McpServer,
  context: BeamToolContext,
): void {
  server.tool(
    "compare_render",
    "Compare a local rendered URL against Figma.",
    {
      figmaUrl: z.string().url(),
      targetUrl: z.string().url(),
      threshold: z.number().min(0).max(1).default(0.95),
      outDir: z.string().optional(),
      refresh: z.boolean().default(false),
    },
    async (input) => {
      try {
        const runCompare = context.compareDesignToUrl ?? compareDesignToUrl;
        return jsonContent(
          await runCompare({
            ...input,
            cwd: context.cwd,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
