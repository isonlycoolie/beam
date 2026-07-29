import { z } from "zod";
import { evidenceReviewSchema } from "./evidence.js";
import { beamWarningSchema } from "./warning.js";

export const contextModeSchema = z.enum(["summary", "standard", "full", "raw"]);

export const designContextRequestSchema = z.object({
  schemaVersion: z.literal("1.0"),
  url: z.string().url(),
  mode: contextModeSchema,
  includeImage: z.boolean(),
  includeAssets: z.boolean(),
  refresh: z.boolean(),
});

export const implementationBriefSchema = z.object({
  frame: z.record(z.string(), z.unknown()),
  layout: z.record(z.string(), z.unknown()),
  components: z.array(z.record(z.string(), z.unknown())),
  tokens: z.record(z.string(), z.unknown()),
  assets: z.array(z.record(z.string(), z.unknown())),
  implementationNotes: z.array(z.string()),
});

export const designContextResponseSchema = z.object({
  schemaVersion: z.literal("1.0"),
  source: z.object({
    fileKey: z.string().min(1),
    nodeId: z.string().optional(),
    url: z.string().url(),
  }),
  snapshot: z.object({
    id: z.string().min(1),
    createdAt: z.string().datetime(),
    beamVersion: z.string().min(1),
    fromCache: z.boolean(),
  }),
  brief: implementationBriefSchema,
  image: z
    .object({
      path: z.string().min(1),
      scale: z.number().positive(),
    })
    .optional(),
  warnings: z.array(beamWarningSchema),
  evidence: evidenceReviewSchema,
  estimatedTokens: z.number().int().nonnegative(),
});

export type ContextMode = z.infer<typeof contextModeSchema>;
export type DesignContextRequest = z.infer<typeof designContextRequestSchema>;
export type DesignContextResponse = z.infer<typeof designContextResponseSchema>;
export type ImplementationBrief = z.infer<typeof implementationBriefSchema>;
