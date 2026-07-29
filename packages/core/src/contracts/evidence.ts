import { z } from "zod";

export const evidenceSourceSchema = z.enum([
  "figma-node-tree",
  "figma-rendered-image",
  "figma-assets",
  "figma-variables",
  "local-snapshot",
  "user-screenshot",
  "user-asset",
  "user-reference-image",
  "user-note",
  "user-confirmation",
  "agent-observation",
]);

export const evidenceStatusSchema = z.enum(["known", "inferred", "missing"]);

export const buildReadinessSchema = z.enum([
  "ready",
  "needs-user-evidence",
  "blocked-rate-limited",
  "blocked-missing-access",
  "blocked-invalid-source",
]);

export const clarificationRequestKindSchema = z.enum([
  "user-screenshot-request",
  "user-asset-request",
  "user-reference-image-request",
  "user-note-request",
  "user-confirmation-request",
]);

export const evidenceSummaryItemSchema = z.object({
  field: z.string().min(1),
  status: evidenceStatusSchema,
  source: evidenceSourceSchema,
  message: z.string().min(1),
});

export const clarificationRequestSchema = z.object({
  kind: clarificationRequestKindSchema,
  severity: z.enum(["low", "medium", "high"]),
  message: z.string().min(1),
  requestedEvidence: z.string().min(1),
  target: z
    .object({
      nodeId: z.string().optional(),
      label: z.string().min(1),
    })
    .optional(),
  acceptedInputs: z.array(z.string().min(1)).optional(),
  canProceedWithoutIt: z.boolean(),
});

export const evidenceReviewSchema = z.object({
  summary: z.array(evidenceSummaryItemSchema),
  confidence: z.object({
    score: z.number().min(0).max(1),
    level: buildReadinessSchema,
    reasons: z.array(z.string().min(1)),
  }),
  buildReadiness: buildReadinessSchema,
  clarificationRequests: z.array(clarificationRequestSchema),
});

export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;
export type BuildReadiness = z.infer<typeof buildReadinessSchema>;
export type EvidenceSummaryItem = z.infer<typeof evidenceSummaryItemSchema>;
export type ClarificationRequest = z.infer<typeof clarificationRequestSchema>;
export type EvidenceReview = z.infer<typeof evidenceReviewSchema>;
