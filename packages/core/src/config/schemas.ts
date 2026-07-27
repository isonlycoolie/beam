import { z } from "zod";

export const userConfigSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    defaultContextMode: z
      .enum(["summary", "standard", "full", "raw"])
      .optional(),
    cache: z
      .object({
        maxAgeMinutes: z.number().int().nonnegative(),
      })
      .optional(),
    figma: z
      .object({
        apiBaseUrl: z.string().url(),
      })
      .optional(),
  })
  .passthrough();

export const projectConfigSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    projectName: z.string().optional(),
    assetsDir: z.string().optional(),
    compareDir: z.string().optional(),
    defaultContextMode: z
      .enum(["summary", "standard", "full", "raw"])
      .optional(),
    cache: z
      .object({
        maxAgeMinutes: z.number().int().nonnegative(),
      })
      .optional(),
    agentClients: z
      .record(z.string(), z.object({ enabled: z.boolean() }))
      .optional(),
  })
  .passthrough();

export type UserConfig = z.infer<typeof userConfigSchema>;
export type ProjectConfig = z.infer<typeof projectConfigSchema>;
export type BeamConfig = UserConfig &
  Partial<Omit<ProjectConfig, "schemaVersion">>;
