import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { settingsCommand } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("settings command", () => {
  it("sets gets lists and unsets settings", async () => {
    const cwd = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await settingsCommand("set", "defaultContextMode", "full", {
      cwd,
      json: true,
    });
    await settingsCommand("get", "defaultContextMode", undefined, {
      cwd,
      json: true,
    });

    expect(String(write.mock.calls.at(-1)?.[0])).toContain('"value": "full"');

    await settingsCommand("list", undefined, undefined, { cwd, json: true });
    expect(String(write.mock.calls.at(-1)?.[0])).toContain(
      "defaultContextMode",
    );

    await settingsCommand("unset", "defaultContextMode", undefined, {
      cwd,
      json: true,
    });
    await settingsCommand("get", "defaultContextMode", undefined, {
      cwd,
      json: true,
    });
    expect(String(write.mock.calls.at(-1)?.[0])).toContain('"standard"');
  });

  it("rejects unsupported setting keys", async () => {
    const cwd = await tempRoot();

    await expect(
      settingsCommand("get", "cloud.enabled", undefined, { cwd }),
    ).rejects.toMatchObject({
      payload: { code: "BEAM_INVALID_FIGMA_URL" },
    });
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-settings-cli-"));
  roots.push(root);
  return root;
}
