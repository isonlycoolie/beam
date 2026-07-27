import {
  createDesignContext,
  type ContextMode,
  type DesignContextResponse,
} from "@beam/core";
import { heading, label, muted, section, warning } from "../terminal.js";

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
    (item) => `- ${warning(`${item.code}: ${item.message}`)}`,
  );
  const lines = [
    heading("Beam inspect"),
    "",
    section("Source"),
    label("File", response.source.fileKey),
    label("Node", response.source.nodeId ?? "file"),
    "",
    section("Frame"),
    label("Frame", String(frame["name"] ?? "Unknown")),
    label(
      "Size",
      `${String(frame["width"] ?? "?")} x ${String(frame["height"] ?? "?")}`,
    ),
    label("Nodes", String(frame["nodeCount"] ?? 0)),
    "",
    section("Layout"),
    label("Type", String(layout["type"] ?? "unknown")),
    label(
      "Sections",
      Array.isArray(layout["sections"])
        ? layout["sections"].join(", ")
        : "none",
    ),
    "",
    section("Components"),
    label("Components", response.brief.components.length),
    label("Mappings", mappingCount),
    "",
    section("Tokens"),
    label(
      "Colors",
      Array.isArray(tokens["colors"]) ? tokens["colors"].length : 0,
    ),
    label(
      "Typography",
      Array.isArray(tokens["typography"]) ? tokens["typography"].length : 0,
    ),
    "",
    section("Assets"),
    label("Assets", response.brief.assets.length),
    "",
    section("Context"),
    label("Mode", String(frame["mode"] ?? "standard")),
    label("Estimated context", `${response.estimatedTokens} tokens`),
    label("Included", "layout, text, tokens, components"),
    label("Omitted", muted("raw vector paths, invisible layers")),
    "",
    section("Cache and snapshot"),
    label("Cache", response.snapshot.fromCache ? "hit" : "miss"),
    label("Snapshot", response.snapshot.id),
  ];

  if (warnings.length > 0) {
    lines.push("", section("Warnings"), ...warnings);
  }

  return `${lines.join("\n")}\n`;
}
