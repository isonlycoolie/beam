import { loadComponentMappings, SnapshotStore } from "@beam/core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { BeamToolContext } from "./index.js";
import { jsonContent, toolError } from "./responses.js";

export function registerFreeLocalTools(
  server: McpServer,
  context: BeamToolContext,
): void {
  server.tool(
    "list_snapshots",
    "List local Beam snapshots.",
    { limit: z.number().int().positive().default(20) },
    async (input) => {
      try {
        const snapshots = await new SnapshotStore({ cwd: context.cwd }).list();
        return jsonContent({
          snapshots: snapshots.slice(0, input.limit).map((snapshot) => ({
            id: snapshot.id,
            fileKey: snapshot.source.fileKey,
            nodeId: snapshot.source.nodeId,
            createdAt: snapshot.createdAt,
            mode: snapshot.mode,
          })),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.tool(
    "restore_snapshot",
    "Restore local Beam snapshot artifacts.",
    {
      snapshotId: z.string().min(1),
      outDir: z.string().default(".beam/restored"),
    },
    async (input) => {
      try {
        return jsonContent(
          await new SnapshotStore({ cwd: context.cwd }).restore(
            input.snapshotId,
            input.outDir,
          ),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.tool(
    "list_component_mappings",
    "List local Beam component mappings.",
    {},
    async () => {
      try {
        return jsonContent(await loadComponentMappings({ cwd: context.cwd }));
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
