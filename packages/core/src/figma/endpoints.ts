export const DEFAULT_FIGMA_API_BASE_URL = "https://api.figma.com/v1";

export function fileNodesEndpoint(fileKey: string, nodeIds: string[]): string {
  const params = new URLSearchParams({ ids: nodeIds.join(",") });
  return `/files/${encodeURIComponent(fileKey)}/nodes?${params.toString()}`;
}

export function fileEndpoint(fileKey: string): string {
  return `/files/${encodeURIComponent(fileKey)}`;
}

export function imagesEndpoint(
  fileKey: string,
  nodeIds: string[],
  options: {
    format?: "png" | "jpg" | "svg" | "pdf";
    scale?: 1 | 2 | 3 | 4;
  } = {},
): string {
  const params = new URLSearchParams({
    ids: nodeIds.join(","),
    format: options.format ?? "png",
    scale: String(options.scale ?? 2),
  });

  return `/images/${encodeURIComponent(fileKey)}?${params.toString()}`;
}

export function variablesEndpoint(fileKey: string): string {
  return `/files/${encodeURIComponent(fileKey)}/variables/local`;
}
