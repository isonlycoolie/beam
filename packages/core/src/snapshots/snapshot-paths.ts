import { createHash, randomUUID } from "node:crypto";

export function createSnapshotId(input?: string): string {
  return input ?? `snapshot_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

export function createRawPayloadPath(input: {
  fileKey: string;
  nodeId?: string;
}): string {
  const nodePathPart = input.nodeId?.replaceAll(":", "-") ?? "file";
  return `.beam/cache/raw/${input.fileKey}/${nodePathPart}.json`;
}

export function createBriefPath(snapshotId: string): string {
  return `.beam/cache/briefs/${snapshotId}.json`;
}

export function createSnapshotMetadataPath(snapshotId: string): string {
  return `.beam/snapshots/${snapshotId}.json`;
}

export function hashPayload(value: unknown): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}
