import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { reviewPage } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { toolError } from "./responses.js";

export function registerCraftTools(server: McpServer, context: BeamToolContext): void {
  server.tool(
    "craft_review",
    "Review a running page for UI quality: text contrast against the real background, touch target sizes, sideways scrolling, alt text, heading order, font and size sprawl, off-grid spacing, page weight and generic-AI patterns. Fix every high finding before calling UI work done.",
    {
      url: z.string().describe("The running page, for example http://localhost:3000"),
      breakpoints: z.array(z.number().int().min(200).max(4000)).default([1440, 390]),
    },
    async (input) => {
      try {
        const run = context.reviewPage ?? reviewPage;
        const review = await run({ ...input, cwd: context.cwd });
        const text = await readFile(join(review.reportDir, "review.md"), "utf8").catch(() => "");
        return { content: [{ type: "text" as const, text }] };
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
