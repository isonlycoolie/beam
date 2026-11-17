import { describe, expect, it } from "vitest";
import { formatVerifyReport, parseBreakpoints } from "../src/commands/verify.js";

describe("beam verify command", () => {
  it("parses breakpoints and rejects nonsense widths with a fix", () => {
    expect(parseBreakpoints("1440, 768,390")).toEqual([1440, 768, 390]);
    expect(parseBreakpoints(undefined)).toBeUndefined();
    expect(() => parseBreakpoints("wide")).toThrow(/Breakpoints/);
  });

  it("summarises failing sections, missing elements and value deltas", () => {
    const text = formatVerifyReport(
      {
        schemaVersion: "1.0",
        id: "verify_1",
        reference: "https://example.com",
        target: "http://localhost:3000",
        threshold: 0.98,
        passed: false,
        reportDir: "/p/.beam/verify/verify_1",
        breakpoints: [
          {
            width: 1440,
            score: 0.97,
            size: { reference: [1440, 2000], target: [1440, 2000] },
            sections: [{ index: 0, label: "section.hero", top: 0, height: 600, score: 0.9 }],
            elements: { matched: 3, missing: [{ path: "body>a", tag: "a", text: "Contact" }], deltas: [{ path: "h1", tag: "h1", text: "Hi", property: "fontSize", expected: "64px", actual: "56px", severity: "high" }] },
            files: { reference: "a", target: "b", diff: "c" },
            passed: false,
          },
        ],
      },
      "/p",
    );
    expect(text).toContain("FAIL");
    expect(text).toContain("section.hero");
    expect(text).toContain("1 elements missing");
    expect(text).toContain("1 colour, font or layout values differ");
  });
});
