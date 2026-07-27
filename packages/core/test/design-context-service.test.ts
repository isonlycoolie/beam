import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { createDesignContext } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("createDesignContext", () => {
  it("creates contract-compatible design context with a mocked Figma client", async () => {
    const cwd = await tempRoot();
    const response = await createDesignContext({
      cwd,
      url: "https://www.figma.com/design/abc/File?node-id=1-2",
      mode: "summary",
      figmaClient: {
        getFile: async () => ({ document: frame }),
        getFileNodes: async () => ({ nodes: { "1:2": { document: frame } } }),
      },
    });

    expect(response).toMatchObject({
      schemaVersion: "1.0",
      source: { fileKey: "abc", nodeId: "1:2" },
      snapshot: { fromCache: false },
      brief: { frame: { name: "Frame", mode: "summary" } },
    });
  });

  it("uses cached responses on repeated requests", async () => {
    const cwd = await tempRoot();
    const input = {
      cwd,
      url: "https://www.figma.com/design/abc/File?node-id=1-2",
      figmaClient: {
        getFile: async () => ({ document: frame }),
        getFileNodes: async () => ({ nodes: { "1:2": { document: frame } } }),
      },
    };

    await createDesignContext(input);
    const cached = await createDesignContext(input);

    expect(cached.snapshot.fromCache).toBe(true);
  });
});

const frame = {
  id: "1:2",
  name: "Frame",
  type: "FRAME",
  layoutMode: "VERTICAL",
  absoluteBoundingBox: { width: 320, height: 240 },
  children: [],
};

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-context-"));
  roots.push(root);
  return root;
}
