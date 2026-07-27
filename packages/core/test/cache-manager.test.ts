import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  CacheManager,
  createCacheKey,
  evaluateFreshness,
} from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("cache manager", () => {
  it("creates stable cache keys", () => {
    const input = {
      endpoint: "GET /v1/files/:file_key/nodes",
      fileKey: "abc",
      nodeId: "1:2",
      scale: 2,
      mode: "standard",
      schemaVersion: "1.0" as const,
    };

    expect(createCacheKey(input)).toBe(createCacheKey(input));
  });

  it("reads after writing", async () => {
    const root = await tempRoot();
    const cache = new CacheManager({ cwd: root });
    const keyInput = cacheKeyInput();

    await cache.write({
      ...keyInput,
      value: { ok: true },
      createdAt: "2026-07-19T00:00:00.000Z",
    });

    await expect(cache.read(keyInput)).resolves.toMatchObject({
      hit: true,
      value: { ok: true },
      createdAt: "2026-07-19T00:00:00.000Z",
    });
  });

  it("reports corrupted cache entries", async () => {
    const root = await tempRoot();
    const cache = new CacheManager({ cwd: root });
    const keyInput = cacheKeyInput();
    const key = createCacheKey(keyInput);
    const path = cache.pathForKey(key);

    await mkdir(join(root, ".beam", "cache", "raw"), { recursive: true });
    await writeFile(path, "{bad json");

    await expect(cache.read(keyInput)).resolves.toMatchObject({
      hit: false,
      reason: "corrupt",
    });
  });

  it("bypasses cache when refresh is requested", async () => {
    expect(
      evaluateFreshness({
        refresh: true,
        createdAt: "2026-07-19T00:00:00.000Z",
      }),
    ).toEqual({
      useCache: false,
      reason: "refresh_requested",
    });
  });
});

function cacheKeyInput() {
  return {
    endpoint: "GET /v1/files/:file_key/nodes",
    fileKey: "abc",
    nodeId: "1:2",
    scale: 2,
    mode: "standard",
    schemaVersion: "1.0" as const,
  };
}

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-cache-"));
  roots.push(root);
  return root;
}
