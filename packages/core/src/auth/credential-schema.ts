import { z } from "zod";

export const figmaCredentialsSchema = z.object({
  schemaVersion: z.literal("1.0"),
  figma: z.object({
    type: z.literal("personal_access_token"),
    accessToken: z.string().min(1),
    createdAt: z.string().datetime(),
  }),
});

export type FigmaCredentialsFile = z.infer<typeof figmaCredentialsSchema>;
export type RedactedCredentialSummary = {
  provider: "figma";
  type: "personal_access_token";
  configured: boolean;
  redactedAccessToken?: string;
};
