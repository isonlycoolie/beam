import { describe, expect, it, vi } from "vitest";
import {
  BeamAuthError,
  BeamRateLimitError,
  FigmaClient,
} from "../src/index.js";

describe("FigmaClient", () => {
  it("fetches file nodes through the request wrapper", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ nodes: { "1:2": { document: { id: "1:2" } } } }),
    );
    const client = new FigmaClient({
      accessToken: "figd_secret",
      fetch: fetchMock,
    });

    await expect(client.getFileNodes("abc", ["1:2"])).resolves.toMatchObject({
      nodes: { "1:2": {} },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://api.figma.com/v1/files/abc/nodes?ids=1%3A2",
    );
    expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
      "X-Figma-Token": "figd_secret",
    });
  });

  it("maps auth failures to BeamAuthError", async () => {
    const client = new FigmaClient({
      accessToken: "figd_secret",
      fetch: vi.fn(async () => new Response("", { status: 401 })),
    });

    await expect(client.getFile("abc")).rejects.toBeInstanceOf(BeamAuthError);
  });

  it("maps rate limits to BeamRateLimitError", async () => {
    const client = new FigmaClient({
      accessToken: "figd_secret",
      fetch: vi.fn(
        async () =>
          new Response("", { status: 429, headers: { "Retry-After": "60" } }),
      ),
    });

    await expect(client.getFile("abc")).rejects.toBeInstanceOf(
      BeamRateLimitError,
    );
  });

  it("deduplicates identical in-flight requests", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ name: "File" }));
    const client = new FigmaClient({
      accessToken: "figd_secret",
      fetch: fetchMock,
    });

    await Promise.all([client.getFile("abc"), client.getFile("abc")]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
