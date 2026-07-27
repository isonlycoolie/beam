import { BeamInvalidInputError } from "../errors.js";

export type ParsedFigmaUrl = {
  fileKey: string;
  nodeId?: string;
  originalUrl: string;
};

export function parseFigmaUrl(input: string): ParsedFigmaUrl {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new BeamInvalidInputError("Invalid Figma URL.", {
      reason: "malformed_url",
    });
  }

  if (url.hostname !== "figma.com" && url.hostname !== "www.figma.com") {
    throw new BeamInvalidInputError("Invalid Figma URL.", {
      reason: "unsupported_host",
    });
  }

  const [, kind, fileKey] = url.pathname.split("/");
  if (kind !== "file" && kind !== "design") {
    throw new BeamInvalidInputError("Invalid Figma URL.", {
      reason: "unsupported_path",
    });
  }

  if (!fileKey) {
    throw new BeamInvalidInputError("Invalid Figma URL.", {
      reason: "missing_file_key",
    });
  }

  const rawNodeId = url.searchParams.get("node-id") ?? undefined;
  const nodeId = rawNodeId ? normalizeNodeId(rawNodeId) : undefined;

  return {
    fileKey,
    ...(nodeId ? { nodeId } : {}),
    originalUrl: input,
  };
}

function normalizeNodeId(value: string): string {
  if (!/^\d+[-:]\d+$/.test(value)) {
    throw new BeamInvalidInputError("Invalid Figma URL.", {
      reason: "malformed_node_id",
    });
  }

  return value.replace("-", ":");
}
