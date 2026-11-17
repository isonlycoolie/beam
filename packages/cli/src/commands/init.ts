import {
  beamServerCommand,
  getMcpClientAdapter,
  SUPPORTED_MCP_CLIENTS,
} from "@beam/core";
import { heading, jsonBlock, label, muted, success, warning } from "../terminal.js";

export type InitCommandOptions = {
  client?: string;
  print?: boolean;
  json?: boolean;
  cwd?: string;
  homeDir?: string;
};

type InitResult = { client: string; configPath?: string; written: boolean; message: string };

/** Clients whose config lives in the project. Codex keeps one global config, so it is only written on request. */
const PROJECT_CLIENTS = ["claude-code", "cursor"] as const;

/** Registers the Beam MCP server with the chosen agent, or with every agent found in this project. */
export async function initCommand(options: InitCommandOptions): Promise<void> {
  const manual = { mcpServers: { beam: beamServerCommand() } };
  if (options.print) {
    process.stdout.write(`${jsonBlock(manual)}\n`);
    return;
  }

  const context = { cwd: options.cwd ?? process.cwd(), homeDir: options.homeDir };
  const results: InitResult[] = [];
  for (const client of options.client ? [options.client] : PROJECT_CLIENTS) {
    const adapter = getMcpClientAdapter(client, context);
    const detection = await adapter.detect();
    // An explicit --client is a request to set it up even before the agent has touched the project.
    if (!detection.detected && !options.client) continue;
    try {
      await adapter.writeBeamConfig("local");
      results.push({ client, configPath: detection.configPath, written: true, message: "Beam MCP server registered." });
    } catch {
      results.push({ client, written: false, message: `${client} is not supported. Use the manual config.` });
    }
  }

  if (options.json) {
    process.stdout.write(`${jsonBlock({ results, manual })}\n`);
    return;
  }

  const lines = [heading("Beam init"), ""];
  for (const result of results) {
    lines.push(result.written ? success(result.message) : warning(result.message), label("Client", result.client));
    if (result.configPath) lines.push(label("Config", result.configPath));
    lines.push("");
  }
  if (results.length === 0) {
    lines.push(
      warning("No supported agent found in this project."),
      muted(`Run beam init --client <${SUPPORTED_MCP_CLIENTS.join("|")}> or add this to your agent's MCP config:`),
      jsonBlock(manual),
    );
  } else {
    lines.push(muted("Restart your agent so it picks up the Beam MCP server."));
    if (!options.client) lines.push(muted("Using Codex? Run beam init --client codex to add Beam to ~/.codex/config.toml."));
  }
  process.stdout.write(`${lines.join("\n")}\n`);
}
