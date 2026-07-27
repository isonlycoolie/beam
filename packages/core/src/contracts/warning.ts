import { z } from "zod";

export const beamWarningSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string().min(1),
  nodeId: z.string().optional(),
});

export type BeamWarning = z.infer<typeof beamWarningSchema>;
