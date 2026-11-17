import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { importFigmaBundle } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { toolError } from "./responses.js";

export function registerFigmaImportTools(server: McpServer, context: BeamToolContext): void {
  server.tool(
    "figma_import_bundle",
    "Unpack a .beam.json file exported by the Beam Figma plugin (works on any Figma plan, no API token). Returns the design brief: build order, exact type styles, colours, spacing, radii, shadows and variables. Build from these values, then check with verify_build using the returned figma: reference.",
    { file: z.string().describe("Path to the .beam.json file, relative to the project") },
    async (input) => {
      try {
        const run = context.importFigmaBundle ?? importFigmaBundle;
        const { dir, spec } = await run({ file: input.file, cwd: context.cwd });
        const brief = await readFile(join(dir, "brief.md"), "utf8").catch(() => "");
        return { content: [{ type: "text" as const, text: `${brief}\nVerify reference: ${spec.url}` }] };
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
