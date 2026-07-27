import {
  readProjectConfig,
  writeProjectConfig,
  type ProjectConfig,
} from "./config-store.js";
import {
  assertSettingKey,
  parseSettingValue,
  settingKeys,
  type FreeSettingKey,
} from "./settings-validation.js";

export async function listProjectSettings(input: { cwd?: string } = {}) {
  const config = await readProjectConfig(input);
  return Object.fromEntries(
    settingKeys.map((key) => [key, getValue(config, key)]),
  );
}

export async function setProjectSetting(
  key: string,
  rawValue: string,
  input: { cwd?: string } = {},
): Promise<ProjectConfig> {
  assertSettingKey(key);
  const config = await readProjectConfig(input);
  const value = parseSettingValue(key, rawValue, input);

  if (key === "cache.maxAgeMinutes") {
    return writeAndReturn(
      { ...config, cache: { maxAgeMinutes: Number(value) } },
      input,
    );
  }

  return writeAndReturn({ ...config, [key]: value }, input);
}

export async function unsetProjectSetting(
  key: string,
  input: { cwd?: string } = {},
): Promise<ProjectConfig> {
  assertSettingKey(key);
  const config = { ...(await readProjectConfig(input)) };

  if (key === "cache.maxAgeMinutes") {
    delete config.cache;
  } else {
    delete config[key];
  }

  return writeAndReturn(config, input);
}

export function getProjectSetting(config: ProjectConfig, key: string) {
  assertSettingKey(key);
  return getValue(config, key);
}

function getValue(config: ProjectConfig, key: FreeSettingKey) {
  return key === "cache.maxAgeMinutes"
    ? config.cache?.maxAgeMinutes
    : config[key];
}

async function writeAndReturn(config: ProjectConfig, input: { cwd?: string }) {
  await writeProjectConfig(config, input);
  return config;
}
