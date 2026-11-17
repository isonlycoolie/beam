import { describe, expect, it } from "vitest";
import { checkBrowser, checkPackageVersion } from "../src/doctor/checks.js";

describe("doctor checks", () => {
  it("passes the version the CLI reports", async () => {
    await expect(checkPackageVersion("1.2.3")).resolves.toMatchObject({
      status: "pass",
      message: "1.2.3",
    });
  });

  it("warns with a fix when no version is known", async () => {
    const check = await checkPackageVersion();
    expect(check.status).toBe("warn");
    expect(check.fix).toContain("usebeam");
  });

  it("reports the screenshot browser either way with a setup fix when missing", async () => {
    const check = await checkBrowser();
    expect(check.id).toBe("browser");
    if (check.status !== "pass") expect(check.fix).toBe("Run beam setup browser (downloads about 150 MB once).");
  });
});
