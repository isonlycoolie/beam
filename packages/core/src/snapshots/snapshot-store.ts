import { beamSnapshotSchema, type BeamSnapshot } from "../contracts/index.js";
import { createBeamPaths } from "../config/paths.js";
import {
  absoluteSnapshotPath,
  readSnapshotMetadata,
  writeSnapshotJson,
} from "./snapshot-files.js";
import {
  createBriefPath,
  createRawPayloadPath,
  createSnapshotId,
  createSnapshotMetadataPath,
  hashPayload,
} from "./snapshot-paths.js";
import type { CreateSnapshotInput } from "./types.js";
export type { CreateSnapshotInput } from "./types.js";

export class SnapshotStore {
  private readonly projectBeamDir: string;

  constructor(input: { cwd?: string } = {}) {
    const paths = createBeamPaths({ cwd: input.cwd });
    this.projectBeamDir = paths.projectBeamDir;
  }

  async create(input: CreateSnapshotInput): Promise<BeamSnapshot> {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const hash = hashPayload(input.rawPayload);
    const id = createSnapshotId(input.id);
    const rawPayload = createRawPayloadPath(input.source);
    const brief = createBriefPath(id);
    const snapshot = beamSnapshotSchema.parse({
      schemaVersion: "1.0",
      id,
      source: {
        provider: "figma",
        fileKey: input.source.fileKey,
        ...(input.source.nodeId ? { nodeId: input.source.nodeId } : {}),
        url: input.source.url,
      },
      hash,
      beamVersion: input.beamVersion ?? "0.1.0",
      createdAt,
      mode: input.mode,
      paths: {
        rawPayload,
        brief,
        ...(input.imagePath ? { image: input.imagePath } : {}),
        ...(input.assetManifestPath
          ? { assetManifest: input.assetManifestPath }
          : {}),
      },
    });

    await writeSnapshotJson(this.projectBeamDir, rawPayload, input.rawPayload);
    await writeSnapshotJson(this.projectBeamDir, brief, input.brief);
    await writeSnapshotJson(
      this.projectBeamDir,
      createSnapshotMetadataPath(id),
      snapshot,
    );

    return snapshot;
  }

  async read(id: string): Promise<BeamSnapshot> {
    return readSnapshotMetadata(
      this.projectBeamDir,
      createSnapshotMetadataPath(id),
    );
  }

  metadataPath(id: string): string {
    return absoluteSnapshotPath(
      this.projectBeamDir,
      createSnapshotMetadataPath(id),
    );
  }
}
