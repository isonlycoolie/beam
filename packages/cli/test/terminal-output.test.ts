import { describe, expect, it } from "vitest";
import { formatCompareResult } from "../src/commands/compare.js";
import { formatDoctorChecks } from "../src/commands/doctor.js";
import { formatInspectResponse } from "../src/commands/inspect.js";

const ansiPattern = /\u001b\[[0-9;]*m/;

describe("terminal output formatting", () => {
  it("decorates doctor checks with readable statuses", () => {
    const output = formatDoctorChecks([
      { id: "node", label: "Node.js", status: "pass", message: "ok" },
      {
        id: "figma-credentials",
        label: "Figma credentials",
        status: "warn",
        message: "missing",
        fix: "Run beam login.",
      },
    ]);

    expect(output).toContain("Beam doctor");
    expect(output).toContain("PASS");
    expect(output).toContain("WARN");
    expect(output).toContain("Run beam login.");
  });

  it("decorates compare failures without changing exit policy", () => {
    const output = formatCompareResult({
      schemaVersion: "1.0",
      id: "compare_1",
      figmaSnapshotId: "snapshot_1",
      targetUrl: "http://localhost:3000",
      createdAt: "2026-07-28T00:00:00.000Z",
      score: 0.8,
      threshold: 0.95,
      passed: false,
      differences: [
        { type: "pixel", severity: "high", message: "Pixels differ" },
      ],
    });

    expect(output).toContain("Beam compare");
    expect(output).toContain("fail");
    expect(output).toContain("Pixels differ");
  });

  it("keeps JSON output free of ANSI escapes", () => {
    const output = `${JSON.stringify({ mcpServers: { beam: {} } }, null, 2)}\n`;

    expect(() => JSON.parse(output)).not.toThrow();
    expect(output).not.toMatch(ansiPattern);
  });

  it("formats inspect warnings for terminal output", () => {
    const output = formatInspectResponse({
      schemaVersion: "1.0",
      source: {
        fileKey: "abc",
        nodeId: "1:2",
        url: "https://figma.com/file/abc",
      },
      snapshot: {
        id: "snapshot_1",
        createdAt: "2026-07-28T00:00:00.000Z",
        beamVersion: "0.1.0",
        fromCache: true,
      },
      brief: {
        frame: { name: "Home", width: 1200, height: 800, nodeCount: 4 },
        layout: { type: "vertical-page", sections: ["hero"] },
        components: [],
        tokens: { colors: [], typography: [] },
        assets: [],
        implementationNotes: [],
      },
      image: { path: ".beam/cache/images/frame.png", scale: 2 },
      warnings: [
        {
          code: "ABSOLUTE_LAYOUT_DETECTED",
          severity: "medium",
          message: "Review layout.",
        },
      ],
      evidence: {
        summary: [],
        confidence: { score: 0.8, level: "ready", reasons: ["Ready."] },
        buildReadiness: "ready",
        clarificationRequests: [],
      },
      estimatedTokens: 1200,
    });

    expect(output).toContain("Beam inspect");
    expect(output).toContain("Warnings");
    expect(output).toContain("ABSOLUTE_LAYOUT_DETECTED");
  });
});
