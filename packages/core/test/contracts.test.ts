import { describe, expect, it } from "vitest";
import {
  beamSnapshotSchema,
  beamWarningSchema,
  compareResultSchema,
  designContextRequestSchema,
} from "../src/index.js";

describe("contracts", () => {
  it("parses a valid design context request", () => {
    expect(
      designContextRequestSchema.parse({
        schemaVersion: "1.0",
        url: "https://www.figma.com/file/abc/example",
        mode: "standard",
        includeImage: true,
        includeAssets: true,
        refresh: false,
      }),
    ).toMatchObject({ mode: "standard" });
  });

  it("rejects invalid design context modes", () => {
    expect(() =>
      designContextRequestSchema.parse({
        schemaVersion: "1.0",
        url: "https://www.figma.com/file/abc/example",
        mode: "verbose",
        includeImage: true,
        includeAssets: true,
        refresh: false,
      }),
    ).toThrow();
  });

  it("constrains warning severity", () => {
    expect(() =>
      beamWarningSchema.parse({
        code: "ABSOLUTE_LAYOUT_DETECTED",
        severity: "critical",
        message: "Unsupported severity.",
      }),
    ).toThrow();
  });

  it("requires snapshot source identity", () => {
    expect(() =>
      beamSnapshotSchema.parse({
        schemaVersion: "1.0",
        id: "snapshot_1",
        source: {
          provider: "figma",
          url: "https://www.figma.com/design/abc/file",
        },
        hash: "sha256",
        beamVersion: "0.1.0",
        createdAt: "2026-07-18T00:00:00.000Z",
        mode: "standard",
        paths: {
          rawPayload: ".beam/cache/raw/frame.json",
          brief: ".beam/cache/briefs/frame.json",
        },
      }),
    ).toThrow();
  });

  it("supports compare difference lists", () => {
    const result = compareResultSchema.parse({
      schemaVersion: "1.0",
      id: "compare_1",
      figmaSnapshotId: "snapshot_1",
      targetUrl: "http://localhost:3000",
      createdAt: "2026-07-18T00:00:00.000Z",
      score: 0.92,
      differences: [
        {
          type: "spacing",
          severity: "medium",
          message: "Gap differs.",
          expected: "24px",
          actual: "32px",
        },
      ],
    });

    expect(result.differences).toHaveLength(1);
  });
});
