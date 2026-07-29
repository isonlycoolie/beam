import { describe, expect, it } from "vitest";
import { formatInspectResponse } from "../src/index.js";

describe("inspect command", () => {
  it("formats design context responses", () => {
    const output = stripAnsi(
      formatInspectResponse({
        schemaVersion: "1.0",
        source: {
          fileKey: "abc",
          nodeId: "1:2",
          url: "https://www.figma.com/design/abc/File?node-id=1-2",
        },
        snapshot: {
          id: "snapshot_test",
          createdAt: "2026-07-19T00:00:00.000Z",
          beamVersion: "0.1.0",
          fromCache: true,
        },
        brief: {
          frame: {
            name: "Frame",
            width: 320,
            height: 240,
            nodeCount: 4,
            mode: "standard",
          },
          layout: {},
          components: [{}],
          tokens: {},
          assets: [],
          implementationNotes: [],
        },
        warnings: [],
        evidence: {
          summary: [],
          confidence: { score: 0.9, level: "ready", reasons: ["Ready."] },
          buildReadiness: "ready",
          clarificationRequests: [],
        },
        estimatedTokens: 120,
      }),
    );

    expect(output).toContain("Beam inspect");
    expect(output).toContain("Source");
    expect(output).toContain("Layout");
    expect(output).toContain("Tokens");
    expect(output).toContain("Cache and snapshot");
    expect(output).toContain("Frame: Frame");
    expect(output).toContain("Cache: hit");
    expect(output).toContain("Snapshot: snapshot_test");
    expect(output).toContain("Evidence");
    expect(output).toContain("Readiness: ready");
  });
});

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}
