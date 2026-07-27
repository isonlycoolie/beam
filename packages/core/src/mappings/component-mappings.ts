import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { createBeamPaths } from "../config/paths.js";
import { writeJson } from "../config/json-file.js";
import { BeamInvalidInputError } from "../errors.js";

export const componentMappingSchema = z.object({
  figmaComponentId: z.string().min(1),
  figmaName: z.string().min(1),
  codeReference: z.object({
    package: z.string().min(1).default("app"),
    importPath: z.string().min(1),
    exportName: z.string().min(1),
  }),
  notes: z.string().optional(),
});

export const componentMappingsFileSchema = z.object({
  schemaVersion: z.literal("1.0"),
  components: z.array(componentMappingSchema),
});

export type ComponentMapping = z.infer<typeof componentMappingSchema>;
export type ComponentMappingsFile = z.infer<typeof componentMappingsFileSchema>;

export async function loadComponentMappings(
  input: { cwd?: string } = {},
): Promise<ComponentMappingsFile> {
  const path = mappingsPath(input);
  try {
    return componentMappingsFileSchema.parse(
      JSON.parse(await readFile(path, "utf8")),
    );
  } catch (error) {
    if (isNodeError(error, "ENOENT")) {
      return { schemaVersion: "1.0", components: [] };
    }
    throw new BeamInvalidInputError("Beam component mappings are invalid.");
  }
}

export async function saveComponentMapping(
  mapping: ComponentMapping,
  input: { cwd?: string } = {},
): Promise<ComponentMappingsFile> {
  const file = await loadComponentMappings(input);
  const parsed = componentMappingSchema.parse(mapping);
  return writeMappings(
    {
      schemaVersion: "1.0",
      components: [
        ...file.components.filter(
          (item) => item.figmaComponentId !== parsed.figmaComponentId,
        ),
        parsed,
      ],
    },
    input,
  );
}

export async function removeComponentMapping(
  figmaComponentId: string,
  input: { cwd?: string } = {},
): Promise<ComponentMappingsFile> {
  const file = await loadComponentMappings(input);
  return writeMappings(
    {
      schemaVersion: "1.0",
      components: file.components.filter(
        (item) => item.figmaComponentId !== figmaComponentId,
      ),
    },
    input,
  );
}

async function writeMappings(
  file: ComponentMappingsFile,
  input: { cwd?: string },
): Promise<ComponentMappingsFile> {
  await writeJson(mappingsPath(input), componentMappingsFileSchema.parse(file));
  return file;
}

function mappingsPath(input: { cwd?: string }): string {
  return join(createBeamPaths(input).projectBeamDir, "mappings.json");
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}
