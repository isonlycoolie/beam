import { z } from "zod";

export const compareDifferenceSchema = z.object({
  type: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string().min(1),
  expected: z.string().optional(),
  actual: z.string().optional(),
});

export const compareResultSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: z.string().min(1),
  figmaSnapshotId: z.string().min(1),
  targetUrl: z.string().url(),
  createdAt: z.string().datetime(),
  score: z.number().min(0).max(1),
  differences: z.array(compareDifferenceSchema),
});

export type CompareDifference = z.infer<typeof compareDifferenceSchema>;
export type CompareResult = z.infer<typeof compareResultSchema>;
