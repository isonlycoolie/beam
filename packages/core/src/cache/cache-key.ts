import { createHash } from "node:crypto";

export type CacheKeyInput = {
  endpoint: string;
  fileKey: string;
  nodeId?: string;
  scale?: number;
  mode?: string;
  schemaVersion: "1.0";
};

export function createCacheKey(input: CacheKeyInput): string {
  const stableInput = {
    endpoint: input.endpoint,
    fileKey: input.fileKey,
    mode: input.mode ?? "",
    nodeId: input.nodeId ?? "",
    scale: input.scale ?? "",
    schemaVersion: input.schemaVersion,
  };

  return createHash("sha256").update(JSON.stringify(stableInput)).digest("hex");
}
