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
  const warnings = response.warnings.map(
    (warning) => `- ${warning.code}: ${warning.message}`,
  );
  const lines = [
    "Beam inspect",
    "",
    `Frame: ${String(frame["name"] ?? "Unknown")}`,
    `Size: ${String(frame["width"] ?? "?")} x ${String(frame["height"] ?? "?")}`,
    `Nodes: ${String(frame["nodeCount"] ?? 0)}`,
    `Components: ${response.brief.components.length}`,
    `Assets: ${response.brief.assets.length}`,
    `Mode: ${String(frame["mode"] ?? "standard")}`,
    `Estimated context: ${response.estimatedTokens} tokens`,
    `Cache: ${response.snapshot.fromCache ? "hit" : "miss"}`,
    `Snapshot: ${response.snapshot.id}`,
  ];

  if (warnings.length > 0) {
    lines.push("", "Warnings:", ...warnings);
  }

  return `${lines.join("\n")}\n`;
}
