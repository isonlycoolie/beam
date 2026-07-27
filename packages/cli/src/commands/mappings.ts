import {
  loadComponentMappings,
  removeComponentMapping,
  saveComponentMapping,
} from "@beam/core";
import { heading, jsonBlock } from "../terminal.js";

export async function mappingsCommand(
  action: string,
  options: {
    figmaComponentId?: string;
    figmaName?: string;
    import?: string;
    export?: string;
    notes?: string;
    json?: boolean;
    cwd?: string;
  },
): Promise<void> {
  const cwd = options.cwd ?? process.cwd();

  if (action === "list") {
    writeMappingOutput(await loadComponentMappings({ cwd }), options.json);
    return;
  }

  if (action === "add") {
    writeMappingOutput(
      await saveComponentMapping(
        {
          figmaComponentId: required(
            options.figmaComponentId,
            "figma component id",
          ),
          figmaName: required(options.figmaName, "figma name"),
          codeReference: {
            package: "app",
            importPath: required(options.import, "import path"),
            exportName: required(options.export, "export name"),
          },
          ...(options.notes ? { notes: options.notes } : {}),
        },
        { cwd },
      ),
      options.json,
    );
    return;
  }

  if (action === "remove") {
    writeMappingOutput(
      await removeComponentMapping(
        required(options.figmaComponentId, "figma component id"),
        { cwd },
      ),
      options.json,
    );
    return;
  }

  throw new Error(`Unsupported mappings action: ${action}`);
}

function required(value: string | undefined, label: string): string {
  if (!value) throw new Error(`Missing ${label}.`);
  return value;
}

function writeMappingOutput(value: unknown, json = false): void {
  if (json) {
    process.stdout.write(`${jsonBlock(value)}\n`);
    return;
  }

  process.stdout.write(`${heading("Beam mappings")}\n\n${jsonBlock(value)}\n`);
}
