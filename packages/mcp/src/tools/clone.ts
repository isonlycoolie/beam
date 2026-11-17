import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { captureForClone } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { toolError } from "./responses.js";

export function registerCloneTools(server: McpServer, context: BeamToolContext): void {
  server.tool(
    "clone_capture",
    "Capture a live web page so you can rebuild it exactly: measured element styles per breakpoint, the real font, image and CSS files, @font-face rules, design tokens and the rendered HTML. Returns the clone brief. Build from these values only, then check each section with verify_build.",
    {
      url: z.string().url().describe("The page to clone"),
      breakpoints: z.array(z.number().int().min(200).max(4000)).default([1440, 768, 390]),
      colorScheme: z.enum(["light", "dark"]).default("light").describe("Which theme of the page to capture"),
    },
    async (input) => {
      try {
        const run = context.captureForClone ?? captureForClone;
        const { dir } = await run({ ...input, cwd: context.cwd });
        const brief = await readFile(join(dir, "brief.md"), "utf8").catch(() => "");
        return { content: [{ type: "text" as const, text: `${brief}\nClone folder: ${dir}` }] };
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
