import { afterEach, describe, expect, it, vi } from "vitest";
import { uiAddCommand, uiItemUrls } from "../src/commands/ui-add.js";

describe("beam add ui/<component>", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps ui names to registry item URLs", () => {
    expect(uiItemUrls(["ui/button", "ui/stat-card"], "http://localhost:3100/r/")).toEqual([
      "http://localhost:3100/r/button.json",
      "http://localhost:3100/r/stat-card.json",
    ]);
  });

  it("maps screens to their own folder", () => {
    expect(uiItemUrls(["screens/login-simple"], "https://beam.dev/r")).toEqual(["https://beam.dev/r/screens/login-simple.json"]);
  });

  it("installs through the shadcn CLI and reports failures with a fix", async () => {
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const runner = vi.fn(async () => 0);
    await uiAddCommand(["ui/button"], { registry: "https://beam.dev/r", runner });
    expect(runner).toHaveBeenCalledWith("npx", ["shadcn@latest", "add", "https://beam.dev/r/button.json", "--yes"]);

    await expect(uiAddCommand(["ui/button"], { runner: async () => 1 })).rejects.toMatchObject({
      payload: { fix: "Run npx shadcn@latest init in this project first, then try again." },
    });
  });
});
