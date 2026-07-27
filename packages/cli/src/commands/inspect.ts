import {
  createDesignContext,
  type ContextMode,
  type DesignContextResponse,
} from "@beam/core";

export async function inspectCommand(
  url: string,
  options: {
    mode?: ContextMode;
    raw?: boolean;
    refresh?: boolean;
    json?: boolean;
  },
): Promise<void> {
  const response = await createDesignContext({
    url,
    cwd: process.cwd(),
    mode: options.raw ? "raw" : (options.mode ?? "standard"),
    refresh: options.refresh ?? false,
  });

  process.stdout.write(
    options.json
      ? `${JSON.stringify(response, null, 2)}\n`
      : formatInspectResponse(response),
  );
}

export function formatInspectResponse(response: DesignContextResponse): string {
  const frame = response.brief.frame;
  const layout = response.brief.layout;
  const tokens = response.brief.tokens;
  const mappingCount = response.brief.components.filter(
    (component) => component["mapping"],
  ).length;
  const warnings = response.warnings.map(
    (warning) => `- ${warning.code}: ${warning.message}`,
  );
  const lines = [
    "Beam inspect",
    "",
    "Source:",
    `File: ${response.source.fileKey}`,
    `Node: ${response.source.nodeId ?? "file"}`,
    "",
    "Frame:",
    `Frame: ${String(frame["name"] ?? "Unknown")}`,
    `Size: ${String(frame["width"] ?? "?")} x ${String(frame["height"] ?? "?")}`,
    `Nodes: ${String(frame["nodeCount"] ?? 0)}`,
    "",
    "Layout:",
    `Type: ${String(layout["type"] ?? "unknown")}`,
    `Sections: ${Array.isArray(layout["sections"]) ? layout["sections"].join(", ") : "none"}`,
    "",
    "Components:",
    `Components: ${response.brief.components.length}`,
    `Mappings: ${mappingCount}`,
    "",
    "Tokens:",
    `Colors: ${Array.isArray(tokens["colors"]) ? tokens["colors"].length : 0}`,
    `Typography: ${Array.isArray(tokens["typography"]) ? tokens["typography"].length : 0}`,
    "",
    "Assets:",
    `Assets: ${response.brief.assets.length}`,
    "",
    "Context:",
    `Mode: ${String(frame["mode"] ?? "standard")}`,
    `Estimated context: ${response.estimatedTokens} tokens`,
    `Included: layout, text, tokens, components`,
    `Omitted: raw vector paths, invisible layers`,
    "",
    "Cache and snapshot:",
    `Cache: ${response.snapshot.fromCache ? "hit" : "miss"}`,
    `Snapshot: ${response.snapshot.id}`,
  ];

  if (warnings.length > 0) {
    lines.push("", "Warnings:", ...warnings);
  }

  return `${lines.join("\n")}\n`;
}
