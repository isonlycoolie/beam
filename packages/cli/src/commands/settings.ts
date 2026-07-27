import {
  getProjectSetting,
  listProjectSettings,
  loadBeamConfig,
  setProjectSetting,
  unsetProjectSetting,
} from "@beam/core";
import { heading, jsonBlock } from "../terminal.js";

export async function settingsCommand(
  action: string,
  key?: string,
  value?: string,
  options: { json?: boolean; cwd?: string } = {},
): Promise<void> {
  const cwd = options.cwd ?? process.cwd();

  if (action === "list") {
    writeSettingsOutput(await listProjectSettings({ cwd }), options.json);
    return;
  }

  if (!key) {
    throw new Error("A setting key is required.");
  }

  if (action === "get") {
    const { config } = await loadBeamConfig({ cwd });
    writeSettingsOutput(
      { key, value: getProjectSetting(config, key) },
      options.json,
    );
    return;
  }

  if (action === "set") {
    if (value === undefined) throw new Error("A setting value is required.");
    writeSettingsOutput(
      await setProjectSetting(key, value, { cwd }),
      options.json,
    );
    return;
  }

  if (action === "unset") {
    writeSettingsOutput(await unsetProjectSetting(key, { cwd }), options.json);
    return;
  }

  throw new Error(`Unsupported settings action: ${action}`);
}

function writeSettingsOutput(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${jsonBlock(value)}\n`);
    return;
  }

  process.stdout.write(`${heading("Beam settings")}\n\n${jsonBlock(value)}\n`);
}
