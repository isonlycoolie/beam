import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  getProjectSetting,
  listProjectSettings,
  loadBeamConfig,
  setProjectSetting,
  unsetProjectSetting,
  writeProjectConfig,
} from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("settings service", () => {
  it("sets lists gets and unsets project settings", async () => {
    const cwd = await tempRoot();

    await setProjectSetting("defaultContextMode", "full", { cwd });
    await setProjectSetting("cache.maxAgeMinutes", "15", { cwd });

    const { config } = await loadBeamConfig({ cwd });
    expect(getProjectSetting(config, "defaultContextMode")).toBe("full");
    expect(await listProjectSettings({ cwd })).toMatchObject({
      defaultContextMode: "full",
      "cache.maxAgeMinutes": 15,
    });

    await unsetProjectSetting("defaultContextMode", { cwd });
    const updated = await loadBeamConfig({ cwd });
    expect(updated.config.defaultContextMode).toBe("standard");
  });

  it("preserves unknown future-safe fields", async () => {
    const cwd = await tempRoot();
    await writeProjectConfig(
      { schemaVersion: "1.0", futureFlag: true },
      { cwd },
    );

    await setProjectSetting("assetsDir", ".beam/assets", { cwd });

    const { config } = await loadBeamConfig({ cwd });
    expect(config).toMatchObject({ futureFlag: true });
  });

  it("rejects invalid keys and values", async () => {
    const cwd = await tempRoot();

    await expect(
      setProjectSetting("unknown", "x", { cwd }),
    ).rejects.toMatchObject({
      payload: { code: "BEAM_INVALID_FIGMA_URL" },
    });
    await expect(
      setProjectSetting("cache.maxAgeMinutes", "-1", { cwd }),
    ).rejects.toMatchObject({ payload: { code: "BEAM_INVALID_FIGMA_URL" } });
    await expect(
      setProjectSetting("assetsDir", resolve(cwd, "..", "outside"), { cwd }),
    ).rejects.toMatchObject({ payload: { code: "BEAM_INVALID_FIGMA_URL" } });
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-settings-"));
  roots.push(root);
  return root;
}
