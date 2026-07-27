import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadComponentMappings,
  removeComponentMapping,
  saveComponentMapping,
} from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("component mappings", () => {
  it("adds lists and removes local mappings", async () => {
    const cwd = await tempRoot();

    await saveComponentMapping(
      {
        figmaComponentId: "123:456",
        figmaName: "Button / Primary",
        codeReference: {
          package: "app",
          importPath: "@/components/button",
          exportName: "Button",
        },
        notes: "Use variant primary.",
      },
      { cwd },
    );

    await expect(loadComponentMappings({ cwd })).resolves.toMatchObject({
      schemaVersion: "1.0",
      components: [{ figmaComponentId: "123:456" }],
    });

    await removeComponentMapping("123:456", { cwd });

    await expect(loadComponentMappings({ cwd })).resolves.toMatchObject({
      components: [],
    });
  });

  it("rejects invalid mappings", async () => {
    const cwd = await tempRoot();

    await expect(
      saveComponentMapping(
        {
          figmaComponentId: "",
          figmaName: "Button",
          codeReference: {
            package: "app",
            importPath: "",
            exportName: "Button",
          },
        },
        { cwd },
      ),
    ).rejects.toBeTruthy();
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-mappings-"));
  roots.push(root);
  return root;
}
