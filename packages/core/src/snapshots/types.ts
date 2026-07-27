import type { ContextMode, ImplementationBrief } from "../contracts/index.js";

export type CreateSnapshotInput = {
  cwd?: string;
  id?: string;
  source: {
    fileKey: string;
    nodeId?: string;
    url: string;
  };
  mode: ContextMode;
  rawPayload: unknown;
  brief: ImplementationBrief;
  imagePath?: string;
  assetManifestPath?: string;
  beamVersion?: string;
  createdAt?: string;
};
