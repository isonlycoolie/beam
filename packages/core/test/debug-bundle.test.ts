import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createDebugBundle, writeLocalLog } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("debug bundle", () => {
  it("creates a sanitized default bundle", async () => {
    const cwd = await tempRoot();
    await writeLocalLog(
      { command: "inspect", details: { token: "figd_secretabcd" } },
      { cwd },
    );

    const bundle = await createDebugBundle({ cwd });

    expect(bundle.manifest).toMatchObject({
      schemaVersion: "1.0",
      includesRaw: false,
      redactions: ["credentials", "signedImageUrls", "authorizationHeaders"],
    });
    expect(bundle.manifest.files).toContain("config.redacted.json");

    const log = await readFile(join(bundle.path, "logs", "recent.log"), "utf8");
    expect(log).not.toContain("figd_secretabcd");
  });

  it("records explicit raw inclusion in the manifest", async () => {
    const cwd = await tempRoot();

    const bundle = await createDebugBundle({ cwd, includeRaw: true });

    expect(bundle.manifest.includesRaw).toBe(true);
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-debug-"));
  roots.push(root);
  return root;
}
