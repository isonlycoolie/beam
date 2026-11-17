import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { EXAMPLES } from "./examples.gen";
import { PreviewStage } from "./preview-stage";
import { readSpec } from "./spec";

const REGISTRY = join(process.cwd(), "..", "..", "packages", "ui", "registry", "components");

/** Reads an example's source exactly as it ships, so the code shown is the code that renders. */
export async function exampleSource(key: string): Promise<string> {
  const entry = EXAMPLES[key];
  if (!entry) throw new Error(`Unknown Beam UI example "${key}". Run node scripts/gen-ui-examples.mjs.`);
  return (await readFile(join(REGISTRY, entry.file), "utf8")).trim();
}

/** "with-icon" -> "With icon". */
export const styleLabel = (id: string) => id.charAt(0).toUpperCase() + id.slice(1).replaceAll("-", " ");

async function panel(name: string, example: string) {
  const key = `${name}/${example}`;
  const Component = EXAMPLES[key]?.Component;
  if (!Component) throw new Error(`Unknown Beam UI example "${key}".`);
  // Shown as it reads once installed: shadcn's paths, not the monorepo's.
  const code = (await exampleSource(key)).replaceAll("@beam/ui/components/", "@/components/ui/").replaceAll('"@beam/ui/icons"', '"@/components/ui/icon"');
  return {
    id: example,
    label: styleLabel(example),
    preview: <Component />,
    code: <DynamicCodeBlock lang="tsx" code={code} codeblock={{ "data-line-numbers": true, className: "my-0 rounded-none border-0 bg-transparent" }} />,
  };
}

/**
 * One live example with its code. With `styles`, the component's styles from spec.json become tabs above the
 * preview (Default, Secondary, Outline...), each switching the preview and its code together.
 */
export async function ComponentPreview({ name, example = "default", styles = false, minHeight }: { name: string; example?: string; styles?: boolean; minHeight?: number }) {
  const ids = styles ? (readSpec(name).styles ?? [example]) : [example];
  const panels = await Promise.all(ids.map((id) => panel(name, id)));
  return <PreviewStage panels={panels} tabs={styles} minHeight={minHeight} />;
}
