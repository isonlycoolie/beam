import { access, mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { addCommand, listCommand, removeCommand, updateCommand } from "../src/commands/kits.js";

const temp = () => mkdtemp(join(tmpdir(), "beam-cli-kits-"));
const exists = (path: string) => access(path).then(() => true, () => false);
const output = (spy: { mock: { calls: unknown[][] } }) => spy.mock.calls.map((call) => String(call[0])).join("");

async function kitsDir(): Promise<string> {
  const dir = await temp();
  await mkdir(join(dir, "verify"));
  await writeFile(join(dir, "verify", "kit.json"), JSON.stringify({ name: "verify", title: "Verify", summary: "Prove a build matches", version: "0.2.0", requires: ["browser", "figma-token"] }));
  await writeFile(join(dir, "verify", "SKILL.md"), "---\nname: beam-verify\ndescription: verify\n---\n");
  return dir;
}

describe("kit commands", () => {
  afterEach(() => vi.restoreAllMocks());

  it("adds one tool for the detected agent only and tells the user what it needs", async () => {
    const cwd = await temp();
    await writeFile(join(cwd, "AGENTS.md"), "");
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await addCommand(["verify"], { cwd, kitsDir: await kitsDir() });

    expect(await exists(join(cwd, ".agents", "skills", "beam-verify", "SKILL.md"))).toBe(true);
    expect(await exists(join(cwd, ".claude"))).toBe(false);
    // The browser line depends on the machine; the token line always shows.
    expect(output(write)).toContain("run beam login");
  });

  it("rejects unknown tools with a pointer to beam list", async () => {
    await expect(addCommand(["nope"], { cwd: await temp(), kitsDir: await kitsDir() })).rejects.toMatchObject({
      payload: { fix: "Run beam list to see every tool." },
    });
  });

  it("lists tools with their install state, then updates and removes", async () => {
    const cwd = await temp();
    const dir = await kitsDir();
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await addCommand(["verify"], { cwd, kitsDir: dir, agent: ["claude-code"] });
    await listCommand({ cwd, kitsDir: dir, json: true });
    const listed = JSON.parse(String(write.mock.calls.at(-1)?.[0]));
    expect(listed.installed.verify.skillDirs).toEqual([".claude/skills/beam-verify"]);

    await updateCommand({ cwd, kitsDir: dir });
    expect(await exists(join(cwd, ".claude", "skills", "beam-verify", "SKILL.md"))).toBe(true);

    await removeCommand("verify", { cwd });
    expect(await exists(join(cwd, ".claude", "skills", "beam-verify"))).toBe(false);
  });
});
