import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadFigmaCredentials,
  redactAccessToken,
  removeFigmaCredentials,
  saveFigmaCredentials,
  summarizeFigmaCredentials,
} from "../src/index.js";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
  roots.length = 0;
});

describe("credential store", () => {
  it("stores credentials only under the user Beam directory", async () => {
    const homeDir = await tempRoot();
    const path = await saveFigmaCredentials("figd_secretabcd", { homeDir });

    expect(path).toBe(join(homeDir, ".beam", "credentials.json"));
    await expect(loadFigmaCredentials({ homeDir })).resolves.toMatchObject({
      type: "personal_access_token",
      accessToken: "figd_secretabcd",
    });
  });

  it("returns redacted credential summaries", async () => {
    const homeDir = await tempRoot();
    await saveFigmaCredentials("figd_secretabcd", { homeDir });

    await expect(summarizeFigmaCredentials({ homeDir })).resolves.toMatchObject(
      {
        configured: true,
        redactedAccessToken: "figd_...abcd",
      },
    );
  });

  it("does not expose short tokens through redaction", () => {
    expect(redactAccessToken("secret")).toBe("****");
  });

  it("removes only stored Figma credentials", async () => {
    const homeDir = await tempRoot();
    await saveFigmaCredentials("figd_secretabcd", { homeDir });

    await removeFigmaCredentials({ homeDir });

    await expect(loadFigmaCredentials({ homeDir })).rejects.toMatchObject({
      payload: { code: "BEAM_MISSING_CREDENTIALS" },
    });
  });

  it("summarizes missing credentials without failing", async () => {
    const homeDir = await tempRoot();

    await expect(summarizeFigmaCredentials({ homeDir })).resolves.toMatchObject(
      {
        configured: false,
        type: "personal_access_token",
      },
    );
  });
});

async function tempRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "beam-credentials-"));
  roots.push(root);
  return root;
}
