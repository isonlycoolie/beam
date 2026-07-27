import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { debugCommand } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("debug command", () => {
  it("creates a debug bundle JSON response", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await debugCommand("bundle", { cwd, json: true });

    const output = String(write.mock.calls[0]?.[0]);
    expect(output).toContain('"manifest"');
    expect(output).toContain('"includesRaw": false');
  });

  it("rejects unsupported debug actions", async () => {
    await expect(debugCommand("unknown", {})).rejects.toThrow(
      "Unsupported debug action",
    );
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-debug-cli-"));
  roots.push(root);
  return root;
}
