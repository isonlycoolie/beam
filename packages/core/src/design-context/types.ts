import type { ContextMode } from "../contracts/index.js";
import type { FigmaClient } from "../figma/figma-client.js";

export type CreateDesignContextInput = {
  url: string;
  cwd: string;
  homeDir?: string;
  mode?: ContextMode;
  includeImage?: boolean;
  includeAssets?: boolean;
  refresh?: boolean;
  figmaClient?: Pick<FigmaClient, "getFile" | "getFileNodes">;
};
