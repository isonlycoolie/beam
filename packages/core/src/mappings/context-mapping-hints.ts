import type { ImplementationBrief } from "../contracts/index.js";
import type { ComponentMapping } from "./component-mappings.js";

export function applyComponentMappings(
  brief: ImplementationBrief,
  mappings: ComponentMapping[],
): ImplementationBrief {
  if (mappings.length === 0) return brief;
  const byId = new Map(
    mappings.map((mapping) => [mapping.figmaComponentId, mapping]),
  );
  const components = brief.components.map((component) => {
    const componentId = String(component["componentId"] ?? "");
    const mapping = byId.get(componentId);
    if (!mapping) return component;
    return {
      ...component,
      mapping: {
        importPath: mapping.codeReference.importPath,
        exportName: mapping.codeReference.exportName,
        notes: mapping.notes,
      },
    };
  });
  const notes = mappings.map(
    (mapping) =>
      `Mapped ${mapping.figmaName} to ${mapping.codeReference.exportName} from ${mapping.codeReference.importPath}.`,
  );
  return {
    ...brief,
    components,
    implementationNotes: [...brief.implementationNotes, ...notes],
  };
}
