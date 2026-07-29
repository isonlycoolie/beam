import { describe, expect, it } from "vitest";
import { reviewEvidence, type ImplementationBrief } from "../src/index.js";

const brief: ImplementationBrief = {
  frame: { nodeCount: 8 },
  layout: { type: "vertical-page" },
  components: [],
  tokens: { colors: ["#fff"], text: ["Hello"] },
  assets: [],
  implementationNotes: [],
};

describe("reviewEvidence", () => {
  it("marks strong context as ready", () => {
    const review = reviewEvidence({
      brief: { ...brief, assets: [{ nodeId: "1:2" }] },
      warnings: [],
      includeImage: true,
      hasImage: true,
    });

    expect(review.buildReadiness).toBe("ready");
    expect(review.confidence.score).toBeGreaterThanOrEqual(0.75);
  });

  it("requests user evidence for partial context", () => {
    const review = reviewEvidence({
      brief,
      warnings: [],
      includeImage: true,
      hasImage: false,
    });

    expect(review.buildReadiness).toBe("needs-user-evidence");
    expect(review.clarificationRequests.map((request) => request.kind)).toEqual(
      expect.arrayContaining(["user-asset-request", "user-screenshot-request"]),
    );
  });

  it("adds confirmation requests for ambiguous layout", () => {
    const review = reviewEvidence({
      brief,
      warnings: [
        {
          code: "ABSOLUTE_LAYOUT_DETECTED",
          severity: "medium",
          message: "Absolute layout.",
        },
      ],
      includeImage: false,
      hasImage: false,
    });

    expect(review.clarificationRequests).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "user-confirmation-request" }),
      ]),
    );
  });
});
