import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  createDesignContext,
  contextModeSchema,
  exportDesignAssets,
  getFileVariables,
  compareDesignToUrl,
  verifyBuild,
  captureForClone,
} from "@beam/core";
import { z } from "zod";
import { registerAssetTools } from "./assets.js";
import { registerCloneTools } from "./clone.js";
import { registerFreeLocalTools } from "./free-local.js";
import { registerCompareTools } from "./compare.js";
import { jsonContent, toolError } from "./responses.js";
import { registerVariableTools } from "./variables.js";
import { registerVerifyTools } from "./verify.js";
export { freeMcpCapabilities } from "./capabilities.js";

export type BeamToolContext = {
  cwd: string;
  createDesignContext?: typeof createDesignContext;
  exportDesignAssets?: typeof exportDesignAssets;
  getFileVariables?: typeof getFileVariables;
  compareDesignToUrl?: typeof compareDesignToUrl;
  verifyBuild?: typeof verifyBuild;
  captureForClone?: typeof captureForClone;
};

export function registerBeamTools(
  server: McpServer,
  context: BeamToolContext,
): void {
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
  registerAssetTools(server, context);
  registerVariableTools(server, context);
  registerFreeLocalTools(server, context);
  registerCompareTools(server, context);
  registerVerifyTools(server, context);
  registerCloneTools(server, context);
}
