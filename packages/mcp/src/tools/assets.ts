import { createDesignContext, exportDesignAssets } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { jsonContent, toolError } from "./responses.js";

const scaleSchema = z
  .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
  .default(2);

export function registerAssetTools(
  server: McpServer,
  context: BeamToolContext,
): void {
  server.tool(
    "get_node_image",
    "Export a Figma-rendered PNG for the requested node.",
    {
      url: z.string().url(),
      scale: scaleSchema,
      format: z.literal("png").default("png"),
      refresh: z.boolean().default(false),
    },
    async (input) => {
      try {
        const manifest = await (
          context.exportDesignAssets ?? exportDesignAssets
        )({
          ...input,
          cwd: context.cwd,
        });
        return jsonContent({
          path: manifest.assets[0]?.path ?? manifest.manifestPath,
          scale: input.scale,
          format: input.format,
          fromCache: false,
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.tool(
    "list_assets",
    "List Beam asset candidates.",
    { url: z.string().url(), refresh: z.boolean().default(false) },
    async (input) => {
      try {
        const response = await (
          context.createDesignContext ?? createDesignContext
        )({
          ...input,
          cwd: context.cwd,
        });
        return jsonContent({
          assets: response.brief.assets,
          warnings: response.warnings,
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.tool(
    "download_assets",
    "Download Figma assets and write an asset manifest.",
    {
      url: z.string().url(),
      outDir: z.string().optional(),
      scale: scaleSchema,
      refresh: z.boolean().default(false),
    },
    async (input) => {
      try {
        const manifest = await (
          context.exportDesignAssets ?? exportDesignAssets
        )({
          ...input,
          cwd: context.cwd,
        });
        return jsonContent({
          schemaVersion: "1.0",
          assets: manifest.assets,
          manifestPath: manifest.manifestPath,
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
