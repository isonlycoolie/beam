import { z } from "zod";

export const rateLimitStateSchema = z.object({
  endpoint: z.string().min(1),
  retryAfterSeconds: z.number().int().nonnegative(),
  planTier: z.string().optional(),
  limitType: z.string().optional(),
  cacheFallbackAvailable: z.boolean(),
  message: z.string().min(1),
});

export type RateLimitState = z.infer<typeof rateLimitStateSchema>;
