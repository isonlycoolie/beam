import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loginCommand,
  logoutCommand,
  whoamiCommand,
} from "../src/commands/auth.js";

const roots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("auth commands", () => {
  it("stores token without printing it", async () => {
    const homeDir = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await loginCommand({ token: "figd_secretabcd", homeDir });

    const output = String(write.mock.calls[0]?.[0]);
    const stored = await readFile(
      join(homeDir, ".beam", "credentials.json"),
      "utf8",
    );
    expect(stored).toContain("figd_secretabcd");
    expect(output).not.toContain("figd_secretabcd");
  });

  it("prints redacted credential summaries", async () => {
    const homeDir = await tempRoot();
    const write = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    await loginCommand({ token: "figd_secretabcd", homeDir });
    await whoamiCommand({ json: true, homeDir });

    const output = String(write.mock.calls.at(-1)?.[0]);
    expect(output).toContain("figd_...abcd");
    expect(output).not.toContain("figd_secretabcd");
  });

  it("removes credentials only after confirmation", async () => {
    const homeDir = await tempRoot();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await loginCommand({ token: "figd_secretabcd", homeDir });

    await logoutCommand({ homeDir });
    await expect(whoamiState(homeDir)).resolves.toMatchObject({
      configured: true,
    });

    await logoutCommand({ yes: true, homeDir });
    await expect(whoamiState(homeDir)).resolves.toMatchObject({
      configured: false,
    });
  });
});

async function whoamiState(homeDir: string) {
  const write = vi
    .spyOn(process.stdout, "write")
    .mockImplementation(() => true);
  await whoamiCommand({ json: true, homeDir });
  return JSON.parse(String(write.mock.calls.at(-1)?.[0]));
}

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-auth-cli-"));
  roots.push(root);
  return root;
}
