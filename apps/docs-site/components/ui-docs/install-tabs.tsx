import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { readSpec } from "./spec";

/** Command and Manual install paths. Each component installs on its own. */
export function InstallTabs({ name, dependencies = [] }: { name: string; dependencies?: string[] }) {
  const spec = readSpec(name);
  const deps = ["class-variance-authority", "clsx", "tailwind-merge", "@hugeicons/react", "@hugeicons/core-free-icons", ...dependencies];
  return (
    <Tabs items={["Command", "Manual"]}>
      <Tab value="Command">
        <DynamicCodeBlock lang="bash" code={`npx usebeam add ui/${name}`} />
        <p className="text-sm text-fd-muted-foreground">Or with the shadcn CLI:</p>
        <DynamicCodeBlock lang="bash" code={`npx shadcn@latest add https://beam.dev/r/${name}.json`} />
      </Tab>
      <Tab value="Manual">
        <p className="text-sm">Install the dependencies:</p>
        <DynamicCodeBlock lang="bash" code={`npm install ${deps.join(" ")}`} />
        <p className="text-sm">
          Copy <code>{`${name}.tsx`}</code> from <code>{`packages/ui/registry/components/${name}`}</code> into{" "}
          <code>components/ui</code>, and the Beam tokens and a theme into your global CSS. {spec.title} is based on {spec.source}.
        </p>
      </Tab>
    </Tabs>
  );
}
