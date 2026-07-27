import { join } from "node:path";
import { readOptionalJson, writeJson } from "./json-file.js";
import {
  projectConfigSchema,
  userConfigSchema,
  type BeamConfig,
  type ProjectConfig,
  type UserConfig,
} from "./schemas.js";
import { createBeamPaths, type BeamPaths } from "./paths.js";
export type { BeamConfig, ProjectConfig, UserConfig } from "./schemas.js";
export { projectConfigSchema, userConfigSchema } from "./schemas.js";

export async function loadBeamConfig(
  input: {
    cwd?: string;
    homeDir?: string;
  } = {},
): Promise<{ config: BeamConfig; paths: BeamPaths }> {
  const paths = createBeamPaths(input);
  const userConfig = await readOptionalJson(
    join(paths.userBeamDir, "config.json"),
    userConfigSchema,
  );
  const projectConfig = await readOptionalJson(
    join(paths.projectBeamDir, "config.json"),
    projectConfigSchema,
  );

  return {
    paths,
    config: {
      schemaVersion: "1.0",
      ...userConfig,
      ...projectConfig,
      cache: userConfig?.cache,
      figma: userConfig?.figma,
    },
  };
}

export async function writeUserConfig(
  config: UserConfig,
  input: { homeDir?: string } = {},
): Promise<string> {
  const paths = createBeamPaths({ homeDir: input.homeDir });
  const configPath = join(paths.userBeamDir, "config.json");
  await writeJson(configPath, userConfigSchema.parse(config));
  return configPath;
}

export async function writeProjectConfig(
  config: ProjectConfig,
  input: { cwd?: string } = {},
): Promise<string> {
  const paths = createBeamPaths({ cwd: input.cwd });
  const configPath = join(paths.projectBeamDir, "config.json");
  await writeJson(configPath, projectConfigSchema.parse(config));
  return configPath;
}
