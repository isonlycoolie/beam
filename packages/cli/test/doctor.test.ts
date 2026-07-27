import { describe, expect, it } from "vitest";
import { formatDoctorChecks } from "../src/index.js";

describe("doctor command", () => {
  it("formats human-readable checks without secrets", () => {
    const output = formatDoctorChecks([
      {
        id: "node-version",
        label: "Node.js >= 22.12.0",
        status: "pass",
        message: "v22.12.0",
      },
      {
        id: "figma-credentials",
        label: "Figma credentials",
        status: "warn",
        message: "Figma credentials not found.",
        fix: "Run beam login to configure Figma credentials.",
      },
    ]);

    expect(output).toContain("Beam doctor");
    expect(output).toContain("pass  Node.js >= 22.12.0");
    expect(output).toContain("warn  Figma credentials");
    expect(output).not.toContain("figd_");
  });
});
