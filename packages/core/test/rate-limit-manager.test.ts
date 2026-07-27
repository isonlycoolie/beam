import { describe, expect, it, vi } from "vitest";
import { createRateLimitState, parseRetryAfter } from "../src/index.js";

describe("rate limit manager", () => {
  it("parses Retry-After seconds", () => {
    expect(parseRetryAfter("60")).toBe(60);
  });

  it("parses Retry-After dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-19T00:00:00.000Z"));

    expect(parseRetryAfter("Sun, 19 Jul 2026 00:01:00 GMT")).toBe(60);

    vi.useRealTimers();
  });

  it("creates structured rate limit state", () => {
    expect(
      createRateLimitState({
        endpoint: "GET /v1/files/:file_key/nodes",
        retryAfterSeconds: 30,
      }),
    ).toMatchObject({
      endpoint: "GET /v1/files/:file_key/nodes",
      retryAfterSeconds: 30,
      cacheFallbackAvailable: false,
    });
  });
});
