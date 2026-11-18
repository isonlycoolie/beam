import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

/** The one way to install a component: Beam's CLI adds it, its dependencies and the tokens it needs. */
export function InstallTabs({ name }: { name: string; dependencies?: string[] }) {
  return <DynamicCodeBlock lang="bash" code={`npx usebeam add ui/${name}`} />;
}
