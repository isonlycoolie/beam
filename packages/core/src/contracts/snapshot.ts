import { z } from "zod";

export const beamSnapshotSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: z.string().min(1),
  source: z.object({
    provider: z.literal("figma"),
    fileKey: z.string().min(1),
    nodeId: z.string().optional(),
    url: z.string().url(),
  }),
  hash: z.string().min(1),
  beamVersion: z.string().min(1),
  createdAt: z.string().datetime(),
  mode: z.enum(["summary", "standard", "full", "raw"]),
  paths: z.object({
    rawPayload: z.string().min(1),
    brief: z.string().min(1),
    image: z.string().optional(),
    assetManifest: z.string().optional(),
  }),
});

export type BeamSnapshot = z.infer<typeof beamSnapshotSchema>;
