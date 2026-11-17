import type { BundleNode, BundleVariable, FigmaBundle } from "../../core/src/figma-bundle/types.js";
import { rgb, serializeNode, type NodeLike } from "./serialize.js";

const EXPORTABLE = new Set(["FRAME", "COMPONENT", "INSTANCE", "SECTION", "GROUP", "COMPONENT_SET"]);
const VECTORS = new Set(["VECTOR", "BOOLEAN_OPERATION", "STAR", "POLYGON", "LINE"]);

figma.showUI(__html__, { width: 320, height: 236, themeColors: true });

/** Icons and logos travel as SVG: assets, vectors and boolean shapes. Their insides are not walked. */
function vectorNodes(node: SceneNode, found: SceneNode[] = []): SceneNode[] {
  if (!node.visible) return found;
  if (("isAsset" in node && node.isAsset && node.type !== "INSTANCE") || VECTORS.has(node.type)) found.push(node);
  else if ("children" in node) for (const child of node.children) vectorNodes(child, found);
  return found;
}

function walk(node: BundleNode, visit: (n: BundleNode) => void): void {
  visit(node);
  for (const child of node.children) walk(child, visit);
}

async function readVariables(): Promise<BundleVariable[]> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const out: BundleVariable[] = [];
  for (const collection of collections) {
    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (!variable) continue;
      for (const mode of collection.modes) {
        const raw = variable.valuesByMode[mode.modeId];
        let value = String(raw);
        if (raw && typeof raw === "object" && "type" in raw && raw.type === "VARIABLE_ALIAS")
          value = `var(${(await figma.variables.getVariableByIdAsync(raw.id))?.name ?? raw.id})`;
        else if (raw && typeof raw === "object" && "r" in raw) value = rgb(raw, "a" in raw ? (raw as RGBA).a : 1);
        out.push({ collection: collection.name, name: variable.name, mode: mode.name, type: variable.resolvedType, value });
      }
    }
  }
  return out;
}

async function exportSelection(): Promise<FigmaBundle> {
  const node = figma.currentPage.selection[0];
  if (!node || figma.currentPage.selection.length !== 1 || !EXPORTABLE.has(node.type))
    throw new Error("Select exactly one frame, component or section.");
  const box = node.absoluteBoundingBox ?? { x: 0, y: 0 };
  const frame = serializeNode(node as unknown as NodeLike, box);

  const svgs: Record<string, string> = {};
  for (const vector of vectorNodes(node)) {
    if (vector === node) continue;
    svgs[vector.id] = await (vector as FrameNode).exportAsync({ format: "SVG_STRING" });
  }
  const images: Record<string, string> = {};
  walk(frame, (n) => {
    if (svgs[n.id]) n.svg = n.id;
    for (const fill of n.fills) if (fill.startsWith("image:")) images[fill.slice(6)] = "";
  });
  for (const hash of Object.keys(images)) {
    const bytes = await figma.getImageByHash(hash)?.getBytesAsync();
    if (bytes) images[hash] = figma.base64Encode(bytes);
  }
  const render = async (value: number) =>
    figma.base64Encode(await (node as FrameNode).exportAsync({ format: "PNG", constraint: { type: "SCALE", value } }));

  return {
    schemaVersion: "1.0",
    source: { fileName: figma.root.name, pageName: figma.currentPage.name, frameName: node.name, nodeId: node.id },
    exportedAt: new Date().toISOString(),
    frame,
    renders: { "1x": await render(1), "2x": await render(2) },
    images,
    svgs,
    variables: await readVariables(),
  };
}

figma.ui.onmessage = async (message: { type: string }) => {
  if (message.type !== "export") return;
  try {
    const bundle = await exportSelection();
    figma.ui.postMessage({ type: "bundle", name: bundle.source.frameName, json: JSON.stringify(bundle) });
  } catch (error) {
    figma.ui.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
  }
};
