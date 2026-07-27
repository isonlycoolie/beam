import { loadFigmaCredentials } from "../auth/credential-store.js";
import type { BeamWarning } from "../contracts/index.js";
import { FigmaClient } from "./figma-client.js";
import { parseFigmaUrl } from "./url-parser.js";

export type GetFileVariablesInput = {
  url: string;
  homeDir?: string;
  figmaClient?: Pick<FigmaClient, "getVariables">;
};

export async function getFileVariables(input: GetFileVariablesInput): Promise<{
  variables: unknown[];
  warnings: BeamWarning[];
}> {
  const source = parseFigmaUrl(input.url);
  const credentials = input.figmaClient
    ? undefined
    : await loadFigmaCredentials({ homeDir: input.homeDir });
  const figmaClient =
    input.figmaClient ??
    new FigmaClient({ accessToken: credentials?.accessToken ?? "" });

  try {
    const response = await figmaClient.getVariables(source.fileKey);
    return { variables: extractVariables(response), warnings: [] };
  } catch {
    return {
      variables: [],
      warnings: [
        {
          code: "FIGMA_VARIABLES_UNAVAILABLE",
          severity: "low",
          message: "Figma variables are unavailable for this file.",
        },
      ],
    };
  }
}

function extractVariables(response: unknown): unknown[] {
  if (!response || typeof response !== "object") {
    return [];
  }

  const values = Object.values(response as Record<string, unknown>);
  return values.flatMap((value) =>
    Array.isArray(value) ? value : typeof value === "object" ? [value] : [],
  );
}
