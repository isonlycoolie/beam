import { describe, expect, it, vi } from "vitest";
import { playwrightCliPath, setupCommand } from "../src/commands/setup.js";

describe("beam setup", () => {
  it("installs Chromium through Playwright's own CLI", async () => {
    const run = vi.fn(async () => 0);
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await setupCommand("browser", { run });

    expect(run).toHaveBeenCalledWith(process.execPath, [
      playwrightCliPath(),
      "install",
      "chromium",
    ]);
    expect(playwrightCliPath()).toMatch(/playwright[\\/]cli\.js$/);
  });

  it("rejects unknown targets with a fix", async () => {
    await expect(setupCommand("gpu")).rejects.toMatchObject({
      payload: { code: "BEAM_INVALID_INPUT", fix: "Run beam setup browser." },
    });
  });

  it("surfaces a failed download", async () => {
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    await expect(
      setupCommand("browser", { run: async () => 1 }),
    ).rejects.toMatchObject({ payload: { message: "Chromium download failed." } });
  });
});
