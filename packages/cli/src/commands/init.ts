import {
  createBeamMcpConfig,
  getMcpClientAdapter,
  SUPPORTED_MCP_CLIENTS,
} from "@beam/core";

export type InitCommandOptions = {
  client?: string;
  print?: boolean;
  json?: boolean;
};

export async function initCommand(options: InitCommandOptions): Promise<void> {
  const client = options.client ?? "codex";
  const config = createBeamMcpConfig("global");

  if (options.print) {
    writeInitOutput(config, options);
    return;
  }

  const adapter = getMcpClientAdapter(client);
  const detection = await adapter.detect();

  if (!detection.detected) {
    writeInitOutput(
      {
        ...config,
        client,
        supportedClients: [...SUPPORTED_MCP_CLIENTS],
        message: "Automatic MCP config is unavailable. Use this manual config.",
      },
      options,
    );
    return;
  }

  await adapter.writeBeamConfig("global");
  writeInitOutput(
    {
      client,
      configPath: detection.configPath,
      message: "Beam MCP config updated.",
    },
    options,
  );
}

function writeInitOutput(value: unknown, options: InitCommandOptions): void {
  if (options.json || options.print) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }

  process.stdout.write(`Beam init\n\n${JSON.stringify(value, null, 2)}\n`);
}
