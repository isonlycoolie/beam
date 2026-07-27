import { SnapshotStore } from "@beam/core";
import { heading, jsonBlock } from "../terminal.js";

export async function snapshotsCommand(
  action: string,
  snapshotId?: string,
  options: { json?: boolean; out?: string; cwd?: string } = {},
): Promise<void> {
  const store = new SnapshotStore({ cwd: options.cwd ?? process.cwd() });

  if (action === "list") {
    const snapshots = await Promise.all(
      (await store.list()).map(async (snapshot) => ({
        id: snapshot.id,
        fileKey: snapshot.source.fileKey,
        nodeId: snapshot.source.nodeId,
        mode: snapshot.mode,
        createdAt: snapshot.createdAt,
        artifactStatus: await store.artifactStatus(snapshot),
      })),
    );
    writeSnapshotOutput({ snapshots }, options.json);
    return;
  }

  if (!snapshotId) throw new Error("A snapshot id is required.");

  if (action === "show") {
    const snapshot = await store.read(snapshotId);
    writeSnapshotOutput(
      { snapshot, artifactStatus: await store.artifactStatus(snapshot) },
      options.json,
    );
    return;
  }

  if (action === "restore") {
    writeSnapshotOutput(
      await store.restore(snapshotId, options.out ?? ".beam/restored"),
      options.json,
    );
    return;
  }

  throw new Error(`Unsupported snapshots action: ${action}`);
}

function writeSnapshotOutput(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${jsonBlock(value)}\n`);
    return;
  }

  process.stdout.write(`${heading("Beam snapshots")}\n\n${jsonBlock(value)}\n`);
}
