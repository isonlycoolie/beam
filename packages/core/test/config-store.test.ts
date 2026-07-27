import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadBeamConfig,
  writeProjectConfig,
  writeUserConfig,
} from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("config store", () => {
  it("loads user config and project overrides", async () => {
    const root = await tempRoot();
    const homeDir = join(root, "home");
    const cwd = join(root, "project");

    await writeUserConfig(
      {
        schemaVersion: "1.0",
        defaultContextMode: "summary",
        cache: { maxAgeMinutes: 60 },
        figma: { apiBaseUrl: "https://api.figma.com/v1" },
      },
      { homeDir },
    );
    await writeProjectConfig(
      {
        schemaVersion: "1.0",
        defaultContextMode: "full",
        assetsDir: ".beam/assets",
        cache: { maxAgeMinutes: 30 },
      },
      { cwd },
    );

    const { config } = await loadBeamConfig({ cwd, homeDir });

    expect(config.defaultContextMode).toBe("full");
    expect(config.cache?.maxAgeMinutes).toBe(30);
    expect(config.figma?.apiBaseUrl).toBe("https://api.figma.com/v1");
    expect(config.assetsDir).toBe(".beam/assets");
  });

  it("loads documented Free project defaults", async () => {
    const root = await tempRoot();

    const { config } = await loadBeamConfig({
      cwd: join(root, "project"),
      homeDir: join(root, "home"),
    });

    expect(config).toMatchObject({
      schemaVersion: "1.0",
      assetsDir: ".beam/cache/assets",
      compareDir: ".beam/cache/compare",
      defaultContextMode: "standard",
      cache: { maxAgeMinutes: 1440 },
    });
  });

  it("preserves unknown future-safe fields", async () => {
    const root = await tempRoot();
    const cwd = join(root, "project");

    await writeProjectConfig(
      {
        schemaVersion: "1.0",
        defaultContextMode: "summary",
        futureFlag: true,
      },
      { cwd },
    );

    const { config } = await loadBeamConfig({ cwd });

    expect(config).toMatchObject({
      defaultContextMode: "summary",
      futureFlag: true,
    });
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-config-"));
  roots.push(root);
  return root;
}
