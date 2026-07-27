import { describe, expect, it } from "vitest";
import { BeamInvalidInputError, parseFigmaUrl } from "../src/index.js";

describe("parseFigmaUrl", () => {
  it("parses file URLs", () => {
    expect(parseFigmaUrl("https://www.figma.com/file/abc123/App")).toEqual({
      fileKey: "abc123",
      originalUrl: "https://www.figma.com/file/abc123/App",
    });
  });

  it("parses design URLs", () => {
    expect(parseFigmaUrl("https://www.figma.com/design/abc123/App")).toEqual({
      fileKey: "abc123",
      originalUrl: "https://www.figma.com/design/abc123/App",
    });
  });

  it("normalizes copied frame node ids", () => {
    expect(
      parseFigmaUrl("https://www.figma.com/design/abc123/App?node-id=1-2"),
    ).toEqual({
      fileKey: "abc123",
      nodeId: "1:2",
      originalUrl: "https://www.figma.com/design/abc123/App?node-id=1-2",
    });
  });

  it("keeps colon-form node ids", () => {
    expect(
      parseFigmaUrl(
        "https://www.figma.com/file/abc123/App?foo=bar&node-id=10:20",
      ),
    ).toMatchObject({
      fileKey: "abc123",
      nodeId: "10:20",
    });
  });

  it("rejects unsupported hosts", () => {
    expect(() => parseFigmaUrl("https://example.com/file/abc123/App")).toThrow(
      BeamInvalidInputError,
    );
  });

  it("rejects missing file keys", () => {
    expect(() => parseFigmaUrl("https://www.figma.com/file/")).toThrow(
      BeamInvalidInputError,
    );
  });

  it("rejects malformed node ids", () => {
    expect(() =>
      parseFigmaUrl("https://www.figma.com/file/abc123/App?node-id=bad"),
    ).toThrow(BeamInvalidInputError);
  });
});
