import { beamSnapshotSchema, type BeamSnapshot } from "../contracts/index.js";
import { createBeamPaths } from "../config/paths.js";
import { join } from "node:path";
import {
  absoluteSnapshotPath,
  copySnapshotFile,
  listSnapshotMetadata,
  readSnapshotMetadata,
  readSnapshotJson,
  snapshotPathExists,
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

  async list(): Promise<BeamSnapshot[]> {
    return listSnapshotMetadata(this.projectBeamDir);
  }

  async newestForSource(input: {
    fileKey: string;
    nodeId?: string;
  }): Promise<BeamSnapshot | undefined> {
    return (await this.list()).find(
      (snapshot) =>
        snapshot.source.fileKey === input.fileKey &&
        snapshot.source.nodeId === input.nodeId,
    );
  }

  async readBrief(snapshot: BeamSnapshot) {
    return readSnapshotJson(this.projectBeamDir, snapshot.paths.brief);
  }

  async artifactStatus(snapshot: BeamSnapshot) {
    return {
      rawPayload: await snapshotPathExists(
        this.projectBeamDir,
        snapshot.paths.rawPayload,
      ),
      brief: await snapshotPathExists(
        this.projectBeamDir,
        snapshot.paths.brief,
      ),
      image: await snapshotPathExists(
        this.projectBeamDir,
        snapshot.paths.image,
      ),
      assetManifest: await snapshotPathExists(
        this.projectBeamDir,
        snapshot.paths.assetManifest,
      ),
    };
  }

  async restore(id: string, outDir = ".beam/restored") {
    const snapshot = await this.read(id);
    const out = absoluteSnapshotPath(this.projectBeamDir, outDir);
    return {
      snapshotId: id,
      restoredPaths: {
        brief: await copySnapshotFile(
          this.projectBeamDir,
          snapshot.paths.brief,
          join(out, "brief.json"),
        ),
        image: await copySnapshotFile(
          this.projectBeamDir,
          snapshot.paths.image,
          join(out, "frame.png"),
        ),
        assetManifest: await copySnapshotFile(
          this.projectBeamDir,
          snapshot.paths.assetManifest,
          join(out, "assets.manifest.json"),
        ),
      },
    };
  }

  metadataPath(id: string): string {
    return absoluteSnapshotPath(
      this.projectBeamDir,
      createSnapshotMetadataPath(id),
    );
  }
}
