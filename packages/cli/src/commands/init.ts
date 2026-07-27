import {
  createBeamMcpConfig,
  getMcpClientAdapter,
  SUPPORTED_MCP_CLIENTS,
} from "@beam/core";
import { heading, jsonBlock, label, success, warning } from "../terminal.js";

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
    process.stdout.write(`${jsonBlock(value)}\n`);
    return;
  }

  const record = value as {
    client?: string;
    configPath?: string;
    message?: string;
  };
  process.stdout.write(
    `${heading("Beam init")}\n\n${record.message?.includes("unavailable") ? warning(record.message) : success(record.message ?? "Ready")}\n${record.client ? `${label("Client", record.client)}\n` : ""}${record.configPath ? `${label("Config", record.configPath)}\n` : ""}`,
  );
}
