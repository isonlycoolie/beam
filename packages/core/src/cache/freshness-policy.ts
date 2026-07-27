export type FreshnessInput = {
  refresh?: boolean;
  createdAt: string;
  maxAgeMinutes?: number;
  now?: Date;
};

export type FreshnessResult =
  | { useCache: false; reason: "refresh_requested" }
  | { useCache: false; reason: "expired" }
  | { useCache: true; reason: "fresh" };

export function evaluateFreshness(input: FreshnessInput): FreshnessResult {
  if (input.refresh) {
    return { useCache: false, reason: "refresh_requested" };
  }

  if (input.maxAgeMinutes === undefined) {
    return { useCache: true, reason: "fresh" };
  }

  const createdAt = Date.parse(input.createdAt);
  if (Number.isNaN(createdAt)) {
    return { useCache: false, reason: "expired" };
  }

  const now = input.now?.getTime() ?? Date.now();
  const ageMinutes = (now - createdAt) / 60_000;

  return ageMinutes <= input.maxAgeMinutes
    ? { useCache: true, reason: "fresh" }
    : { useCache: false, reason: "expired" };
}
