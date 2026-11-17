import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { EXAMPLES } from "./examples.gen";
import { PreviewStage } from "./preview-stage";

const REGISTRY = join(process.cwd(), "..", "..", "packages", "ui", "registry", "components");

/** Reads an example's source exactly as it ships, so the code shown is the code that renders. */
export async function exampleSource(key: string): Promise<string> {
  const entry = EXAMPLES[key];
  if (!entry) throw new Error(`Unknown Beam UI example "${key}". Run node scripts/gen-ui-examples.mjs.`);
  return (await readFile(join(REGISTRY, entry.file), "utf8")).trim();
}

/** A live example on a themed stage, with its code below, collapsed until "View Code". */
export async function ComponentPreview({ name, example = "default", minHeight }: { name: string; example?: string; minHeight?: number }) {
  const key = `${name}/${example}`;
  const { Component } = EXAMPLES[key] ?? {};
  if (!Component) throw new Error(`Unknown Beam UI example "${key}".`);
  const code = await exampleSource(key);
  return (
    <PreviewStage minHeight={minHeight} code={<DynamicCodeBlock lang="tsx" code={code} codeblock={{ className: "my-0 rounded-none border-0 bg-transparent" }} />}>
      <Component />
    </PreviewStage>
  );
}
