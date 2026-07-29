import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("npm package metadata", () => {
  it("uses the public usebeam package identity", async () => {
    const pkg = JSON.parse(
      await readFile(join(process.cwd(), "package.json"), "utf8"),
    );

    expect(pkg.name).toBe("usebeam");
    expect(pkg.private).toBeUndefined();
    expect(pkg.bin).toEqual({ beam: "./dist/cli.js" });
    expect(pkg.license).toBe("MIT");
    expect(pkg.engines.node).toBe(">=22.12.0");
  });
});
