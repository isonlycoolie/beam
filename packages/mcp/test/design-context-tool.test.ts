import { describe, expect, it } from "vitest";
import { registerBeamTools } from "../src/tools/index.js";

describe("get_design_context tool", () => {
  it("registers the design context tool", () => {
    const names: string[] = [];
    const server = {
      tool(name: string) {
        names.push(name);
      },
    };

    registerBeamTools(server as never, { cwd: process.cwd() });

    expect(names).toContain("get_design_context");
  });

  it("returns evidence from design context responses", async () => {
    let handler:
      | ((input: unknown) => Promise<{ content: { text: string }[] }>)
      | undefined;
    const server = {
      tool(
        name: string,
        _description: string,
        _schema: unknown,
        callback: typeof handler,
      ) {
        if (name === "get_design_context") handler = callback;
      },
    };

    registerBeamTools(server as never, {
      cwd: process.cwd(),
      createDesignContext: async () =>
        ({
          schemaVersion: "1.0",
          source: { fileKey: "abc", url: "https://figma.com/file/abc" },
          snapshot: {
            id: "snapshot_1",
            createdAt: "2026-07-29T00:00:00.000Z",
            beamVersion: "0.1.0",
            fromCache: false,
          },
          brief: {
            frame: {},
            layout: {},
            components: [],
            tokens: {},
            assets: [],
            implementationNotes: [],
          },
          warnings: [],
          evidence: {
            summary: [],
            confidence: { score: 0.8, level: "ready", reasons: ["Ready."] },
            buildReadiness: "ready",
            clarificationRequests: [],
          },
          estimatedTokens: 10,
        }) as never,
    });

    const result = await handler?.({ url: "https://figma.com/file/abc" });
    const parsed = JSON.parse(String(result?.content[0]?.text));

    expect(parsed.evidence.buildReadiness).toBe("ready");
  });
});
