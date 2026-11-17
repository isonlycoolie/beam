import { access, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { detectAgents, installKit, listKits, loadKit, readKitsLock, removeKit, skillTargets } from "../src/index.js";

const temp = () => mkdtemp(join(tmpdir(), "beam-kits-"));
const exists = (path: string) => access(path).then(() => true, () => false);

async function fixtureKits(): Promise<string> {
  const kitsDir = await temp();
  const glass = join(kitsDir, "glass");
  await mkdir(join(glass, "components", "glass"), { recursive: true });
  await mkdir(join(glass, "references"), { recursive: true });
  await writeFile(join(glass, "kit.json"), JSON.stringify({ name: "glass", title: "Glass", summary: "Liquid glass", version: "0.1.0", components: { from: "components", to: "components/beam" } }));
  await writeFile(join(glass, "SKILL.md"), "---\nname: beam-glass\ndescription: glass\n---\n");
  await writeFile(join(glass, "references", "contrast.md"), "rules");
  await writeFile(join(glass, "components", "glass", "panel.tsx"), "export const Panel = 1;");
  await mkdir(join(kitsDir, "broken"));
  return kitsDir;
}

describe("kits", () => {
  it("lists valid kits and skips folders without a valid kit.json", async () => {
    const kits = await listKits(await fixtureKits());
    expect(kits.map((kit) => kit.name)).toEqual(["glass"]);
    expect(kits[0]?.status).toBe("stable");
  });

  it("detects agents from project markers", async () => {
    const cwd = await temp();
    await writeFile(join(cwd, "AGENTS.md"), "");
    await mkdir(join(cwd, ".cursor"));
    expect(await detectAgents(cwd)).toEqual(["codex", "cursor"]);
  });

  it("never gives Cursor a duplicate copy when Claude Code is targeted", () => {
    expect(skillTargets(["claude-code", "cursor"])).toEqual([join(".claude", "skills")]);
    expect(skillTargets(["cursor"])).toEqual([join(".cursor", "skills")]);
    expect(skillTargets([])).toEqual([join(".claude", "skills"), join(".agents", "skills")]);
  });

  it("installs only the skill files, copies components once, and removes cleanly", async () => {
    const kit = (await loadKit(await fixtureKits(), "glass"))!;
    const cwd = await temp();
    const targets = skillTargets(["claude-code", "codex"]);

    await installKit({ kit, cwd, targets });

    const skill = join(cwd, ".claude", "skills", "beam-glass");
    expect(await exists(join(skill, "SKILL.md"))).toBe(true);
    expect(await exists(join(skill, "references", "contrast.md"))).toBe(true);
    expect(await exists(join(skill, "kit.json"))).toBe(false);
    expect(await exists(join(skill, "components"))).toBe(false);
    expect(await exists(join(cwd, ".agents", "skills", "beam-glass", "SKILL.md"))).toBe(true);
    const panel = join(cwd, "components", "beam", "glass", "panel.tsx");
    expect(await readFile(panel, "utf8")).toContain("Panel");

    await writeFile(panel, "my edit");
    await installKit({ kit, cwd, targets });
    expect(await readFile(panel, "utf8")).toBe("my edit");

    expect((await readKitsLock(cwd)).kits.glass?.skillDirs).toHaveLength(2);
    await removeKit(cwd, "glass");
    expect(await exists(skill)).toBe(false);
    expect(await exists(panel)).toBe(true);
    expect((await readKitsLock(cwd)).kits.glass).toBeUndefined();
  });
});
