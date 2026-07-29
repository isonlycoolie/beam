import { mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { EvidenceStore } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("EvidenceStore", () => {
  it("stores file evidence locally", async () => {
    const cwd = await tempRoot();
    const file = join(cwd, "hero.png");
    await writeFile(file, "png");
    const store = new EvidenceStore({ cwd });

    const record = await store.add({
      snapshotId: "snapshot_1",
      kind: "image",
      label: "Hero",
      filePath: file,
    });

    expect(record.storedPath).toContain(".beam/evidence/snapshot_1");
    await expect(
      stat(join(cwd, record.storedPath ?? "")),
    ).resolves.toBeTruthy();
  });

  it("stores notes and confirmations", async () => {
    const cwd = await tempRoot();
    const store = new EvidenceStore({ cwd });

    await store.add({
      snapshotId: "snapshot_1",
      kind: "note",
      label: "Chart",
      text: "Use a simple chart.",
    });
    await store.add({
      snapshotId: "snapshot_1",
      kind: "confirmation",
      label: "Cards",
      text: "Use one reusable component.",
    });

    expect(await store.list("snapshot_1")).toHaveLength(2);
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-evidence-"));
  roots.push(root);
  return root;
}
