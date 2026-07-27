import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { redactLogEntry, writeLocalLog } from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("local logs", () => {
  it("writes project and user logs", async () => {
    const root = await tempRoot();
    const cwd = join(root, "project");
    const homeDir = join(root, "home");

    await expect(writeLocalLog({ command: "inspect" }, { cwd })).resolves.toBe(
      join(cwd, ".beam", "logs", "beam.log"),
    );
    await expect(
      writeLocalLog({ command: "doctor" }, { homeDir, scope: "user" }),
    ).resolves.toBe(join(homeDir, ".beam", "logs", "beam.log"));
  });

  it("redacts secrets and signed URLs", async () => {
    const cwd = await tempRoot();
    const path = await writeLocalLog(
      {
        command: "inspect",
        details: {
          token: "figd_secretabcd",
          header: "Bearer secret",
          image: "https://example.com/image.png?token=secret",
        },
      },
      { cwd },
    );

    const content = await readFile(path, "utf8");
    expect(content).not.toContain("figd_secretabcd");
    expect(content).not.toContain("Bearer secret");
    expect(content).not.toContain("token=secret");
  });

  it("redacts arbitrary log payloads", () => {
    expect(redactLogEntry({ token: "figd_secretabcd" })).toEqual({
      token: "figd_...redacted",
    });
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-logs-"));
  roots.push(root);
  return root;
}
