export type DetectionResult = {
  detected: boolean;
  configPath?: string;
  reason?: string;
};

export type ValidationResult = {
  valid: boolean;
  message: string;
};

export type McpClientAdapter = {
  id: string;
  displayName: string;
  detect(): Promise<DetectionResult>;
  readConfig(): Promise<unknown>;
  writeBeamConfig(mode: "global" | "local"): Promise<void>;
  validate(): Promise<ValidationResult>;
};

export type McpServerConfig = {
  mcpServers: {
    beam: {
      command: string;
      args: string[];
    };
  };
};

export function createBeamMcpConfig(mode: "global" | "local"): McpServerConfig {
  return {
    mcpServers: {
      beam:
        mode === "local"
          ? { command: "npx", args: ["usebeam", "mcp"] }
          : { command: "beam", args: ["mcp"] },
    },
  };
}

export function mergeBeamMcpConfig(
  existing: unknown,
  mode: "global" | "local",
): Record<string, unknown> {
  const base =
    existing && typeof existing === "object"
      ? { ...(existing as Record<string, unknown>) }
      : {};
  const servers =
    base["mcpServers"] && typeof base["mcpServers"] === "object"
      ? { ...(base["mcpServers"] as Record<string, unknown>) }
      : {};

  return {
    ...base,
    mcpServers: {
      ...servers,
      beam: createBeamMcpConfig(mode).mcpServers.beam,
    },
  };
}
