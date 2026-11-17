import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { verifyBuild } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { toolError } from "./responses.js";

export function registerVerifyTools(server: McpServer, context: BeamToolContext): void {
  server.tool(
    "verify_build",
    "Prove a build matches its source. Compares pixels per page section and exact element values (font, colour, size, position) at each breakpoint. Returns a brief listing every value to fix. Run it after each section you build and keep fixing until it passes.",
    {
      reference: z.string().describe("Source to match: a live URL, a file: URL, or a PNG path"),
      target: z.string().describe("Your running build, for example http://localhost:3000"),
      breakpoints: z.array(z.number().int().min(200).max(4000)).default([1440, 768, 390]),
      threshold: z.number().min(0).max(1).default(0.98),
      pixelsOnly: z.boolean().default(false),
    },
    async (input) => {
      try {
        const run = context.verifyBuild ?? verifyBuild;
        const report = await run({ ...input, cwd: context.cwd });
        // The markdown brief is what the agent acts on; the JSON report stays on disk for tools.
        const brief = await readFile(join(report.reportDir, "report.md"), "utf8").catch(() => "");
        return {
          content: [{ type: "text" as const, text: `${brief}\nFull report: ${join(report.reportDir, "report.json")}` }],
        };
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
