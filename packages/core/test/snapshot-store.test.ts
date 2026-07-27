import { readFile, rm, mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { SnapshotStore, type ImplementationBrief } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("SnapshotStore", () => {
  it("writes snapshot metadata and referenced payload files", async () => {
    const cwd = await tempRoot();
    const store = new SnapshotStore({ cwd });
    const snapshot = await store.create({
      cwd,
      id: "snapshot_test",
      source: {
        fileKey: "abc",
        nodeId: "1:2",
        url: "https://www.figma.com/design/abc/File?node-id=1-2",
      },
      mode: "standard",
      rawPayload: { nodes: { "1:2": {} } },
      brief,
      imagePath: ".beam/cache/images/snapshot_test.png",
      assetManifestPath: ".beam/cache/assets/snapshot_test.manifest.json",
      createdAt: "2026-07-19T00:00:00.000Z",
    });

    expect(snapshot).toMatchObject({
      schemaVersion: "1.0",
      id: "snapshot_test",
      source: {
        provider: "figma",
        fileKey: "abc",
        nodeId: "1:2",
        url: "https://www.figma.com/design/abc/File?node-id=1-2",
      },
      mode: "standard",
      paths: {
        rawPayload: ".beam/cache/raw/abc/1-2.json",
        brief: ".beam/cache/briefs/snapshot_test.json",
        image: ".beam/cache/images/snapshot_test.png",
        assetManifest: ".beam/cache/assets/snapshot_test.manifest.json",
      },
    });
    await expect(store.read("snapshot_test")).resolves.toEqual(snapshot);
    await expect(
      readJson(join(cwd, snapshot.paths.rawPayload)),
    ).resolves.toEqual({ nodes: { "1:2": {} } });
    await expect(readJson(join(cwd, snapshot.paths.brief))).resolves.toEqual(
      brief,
    );
  });
});

const brief: ImplementationBrief = {
  frame: { name: "Frame" },
  layout: {},
  components: [],
  tokens: {},
  assets: [],
  implementationNotes: [],
};

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-snapshot-"));
  roots.push(root);
  return root;
}
