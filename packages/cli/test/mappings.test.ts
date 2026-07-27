import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mappingsCommand } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("mappings command", () => {
  it("adds lists and removes mappings", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await mappingsCommand("add", {
      cwd,
      json: true,
      figmaComponentId: "123:456",
      figmaName: "Button / Primary",
      import: "@/components/button",
      export: "Button",
    });
    await mappingsCommand("list", { cwd, json: true });

    expect(String(write.mock.calls.at(-1)?.[0])).toContain("123:456");

    await mappingsCommand("remove", {
      cwd,
      json: true,
      figmaComponentId: "123:456",
    });

    expect(String(write.mock.calls.at(-1)?.[0])).toContain('"components": []');
  });

  it("requires mapping fields when adding", async () => {
    await expect(mappingsCommand("add", {})).rejects.toThrow(
      "Missing figma component id.",
    );
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-mappings-cli-"));
  roots.push(root);
  return root;
}
