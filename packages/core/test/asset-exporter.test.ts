import { readFile, rm, mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { exportDesignAssets } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("exportDesignAssets", () => {
  it("writes downloaded images and manifest files", async () => {
    const cwd = await tempRoot();
    const manifest = await exportDesignAssets({
      cwd,
      url: "https://www.figma.com/design/abc/File?node-id=1-2",
      snapshotId: "snapshot_test",
      createdAt: "2026-07-19T00:00:00.000Z",
      figmaClient: {
        getImages: async () => ({
          images: { "1:2": "https://images.example/frame.png" },
        }),
      },
      fetch: async () => new Response(new Uint8Array([1, 2, 3])),
    });

    expect(manifest).toMatchObject({
      schemaVersion: "1.0",
      snapshotId: "snapshot_test",
      assets: [
        {
          id: "asset_1-2",
          nodeId: "1:2",
          type: "frame",
          path: ".beam/cache/assets/1-2-2x.png",
        },
      ],
      manifestPath: ".beam/cache/assets/snapshot_test.manifest.json",
    });
    await expect(
      readFile(join(cwd, ".beam/cache/assets/1-2-2x.png")),
    ).resolves.toEqual(Buffer.from([1, 2, 3]));
    await expect(
      readJson(join(cwd, manifest.manifestPath)),
    ).resolves.toMatchObject({ snapshotId: "snapshot_test" });
  });
});

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-export-"));
  roots.push(root);
  return root;
}
