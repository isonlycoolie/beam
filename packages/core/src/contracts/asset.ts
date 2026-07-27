import { z } from "zod";

export const assetManifestItemSchema = z.object({
  id: z.string().min(1),
  nodeId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["frame", "raster", "vector", "icon", "decorative"]),
  path: z.string().min(1),
  format: z.enum(["png", "jpg", "svg", "pdf"]),
  scale: z.number().positive(),
  sourceUrl: z.string().url(),
});

export const assetManifestSchema = z.object({
  schemaVersion: z.literal("1.0"),
  snapshotId: z.string().min(1),
  createdAt: z.string().datetime(),
  assets: z.array(assetManifestItemSchema),
});

export type AssetManifestItem = z.infer<typeof assetManifestItemSchema>;
export type AssetManifest = z.infer<typeof assetManifestSchema>;
