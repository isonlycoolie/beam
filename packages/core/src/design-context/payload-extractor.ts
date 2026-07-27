export function extractDocument(
  payload: unknown,
  nodeId: string | undefined,
): any {
  if (nodeId && isRecord(payload) && isRecord(payload["nodes"])) {
    const nodePayload = payload["nodes"][nodeId];
    if (isRecord(nodePayload) && nodePayload["document"]) {
      return nodePayload["document"];
    }
  }

  if (isRecord(payload) && payload["document"]) {
    return payload["document"];
  }

  return payload;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
