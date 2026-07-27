import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SnapshotStore, type ImplementationBrief } from "@beam/core";
import { snapshotsCommand } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("snapshots command", () => {
  it("lists and shows local snapshots", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);
    await createSnapshot(cwd);

    await snapshotsCommand("list", undefined, { cwd, json: true });
    expect(String(write.mock.calls.at(-1)?.[0])).toContain("snapshot_cli");

    await snapshotsCommand("show", "snapshot_cli", { cwd, json: true });
    expect(String(write.mock.calls.at(-1)?.[0])).toContain('"fileKey": "abc"');
  });

  it("restores local snapshot artifacts", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);
    await createSnapshot(cwd);

    await snapshotsCommand("restore", "snapshot_cli", {
      cwd,
      out: ".beam/restored",
      json: true,
    });

    expect(String(write.mock.calls.at(-1)?.[0])).toContain("brief.json");
  });
});

async function createSnapshot(cwd: string) {
  const store = new SnapshotStore({ cwd });
  const snapshot = await store.create({
    id: "snapshot_cli",
    source: {
      fileKey: "abc",
      nodeId: "1:2",
      url: "https://www.figma.com/design/abc/File?node-id=1-2",
    },
    mode: "standard",
    rawPayload: {},
    brief,
    imagePath: ".beam/cache/images/snapshot_cli.png",
    assetManifestPath: ".beam/cache/assets/snapshot_cli.manifest.json",
  });
  await writeArtifact(cwd, snapshot.paths.image!, "image");
  await writeArtifact(cwd, snapshot.paths.assetManifest!, "{}");
}

const brief: ImplementationBrief = {
  frame: { name: "Frame" },
  layout: {},
  components: [],
  tokens: {},
  assets: [],
  implementationNotes: [],
};

async function writeArtifact(
  cwd: string,
  relativePath: string,
  content: string,
) {
  const path = join(cwd, relativePath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-snapshots-cli-"));
  roots.push(root);
  return root;
}
