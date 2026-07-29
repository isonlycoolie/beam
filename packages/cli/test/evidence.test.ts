import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { evidenceCommand } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("evidence command", () => {
  it("adds and lists note evidence", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await evidenceCommand("add", "snapshot_1", {
      note: "Use simple cards.",
      label: "Cards",
      cwd,
      json: true,
    });
    await evidenceCommand("list", "snapshot_1", { cwd, json: true });

    const listed = JSON.parse(String(write.mock.calls[1]?.[0]));
    expect(listed.evidence).toHaveLength(1);
    expect(listed.evidence[0]).toMatchObject({ kind: "note", label: "Cards" });
  });

  it("adds image evidence by file", async () => {
    const cwd = await tempRoot();
    const file = join(cwd, "hero.png");
    await writeFile(file, "png");
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await evidenceCommand("add", "snapshot_1", {
      image: file,
      label: "Hero",
      cwd,
      json: true,
    });

    const output = JSON.parse(String(write.mock.calls[0]?.[0]));
    expect(output.evidence.storedPath).toContain(".beam/evidence/snapshot_1");
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-cli-evidence-"));
  roots.push(root);
  return root;
}
