import { BeamRateLimitError } from "../errors.js";
import type { RateLimitState } from "../contracts/index.js";

export function parseRetryAfter(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.trunc(seconds);
  }

  const retryDate = Date.parse(value);
  if (Number.isNaN(retryDate)) {
    return undefined;
  }

  return Math.max(0, Math.ceil((retryDate - Date.now()) / 1000));
}

export function createRateLimitState(input: {
  endpoint: string;
  retryAfterSeconds?: number;
  cacheFallbackAvailable?: boolean;
}): RateLimitState {
  return {
    endpoint: input.endpoint,
    retryAfterSeconds: input.retryAfterSeconds ?? 0,
    cacheFallbackAvailable: input.cacheFallbackAvailable ?? false,
    message: "Figma rate limit reached.",
  };
}

export function rateLimitErrorFromResponse(
  response: Response,
  endpoint: string,
): BeamRateLimitError {
  const state = createRateLimitState({
    endpoint,
    retryAfterSeconds: parseRetryAfter(response.headers.get("Retry-After")),
  });

  return new BeamRateLimitError(state.message, state);
}
