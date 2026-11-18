import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { readScreen, screenSource } from "@/lib/screens";
import { CodeFold } from "./code-fold";
import { ScreenFrame } from "./screen-frame";

const tall = (id: string) => (id.startsWith("dashboard") || id.startsWith("sidebar") ? 820 : 720);

export function ScreenPreview({ id }: { id: string }) {
  return <ScreenFrame id={id} height={tall(id)} />;
}

/** One command: sidebar layouts install as components, other screens by their screens/ path. */
export function ScreenInstall({ id, component = false }: { id: string; component?: boolean }) {
  return <DynamicCodeBlock lang="bash" code={`npx usebeam add ${component ? `ui/${id}` : `screens/${id}`}`} />;
}

/** Where the sample data lives, so swapping in real data is one edit. */
export function ScreenData({ id }: { id: string }) {
  const spec = readScreen(id);
  const withData = spec.files.filter((f) => f.endsWith(".json") || /\nconst data\b|\nconst (?:chartData|items|mails)\b/.test(`\n${screenSource(id, f)}`));
  const target = (f: string) => (f.startsWith("components/") ? f : `app/${id}/${f}`);
  return (
    <div className="text-[15px] leading-relaxed">
      {withData.length ? (
        <p>
          The sample data sits in {withData.map((f, i) => [i > 0 && (i === withData.length - 1 ? " and " : ", "), <code key={f}>{target(f)}</code>])}. Replace it with your
          own records, or load them in the page and pass them down; the components only read the same fields.
        </p>
      ) : (
        <p>This layout has no sample data: wire it to your own action or route.</p>
      )}
      <p className="text-fd-muted-foreground">
        It installs a working page at <code>app/{id}/page.tsx</code>, with its parts in <code>components/</code>. Based on {spec.source}.
      </p>
    </div>
  );
}

export function ScreenCode({ id }: { id: string }) {
  const files = readScreen(id).files.filter((f) => f.endsWith(".tsx"));
  const order = ["page.tsx", ...files.filter((f) => f !== "page.tsx")];
  return (
    <Tabs items={order.map((f) => f.replace("components/", ""))}>
      {order.map((f) => (
        <Tab key={f} value={f.replace("components/", "")}>
          <CodeFold>
            <DynamicCodeBlock lang="tsx" code={screenSource(id, f)} codeblock={{ "data-line-numbers": true, className: "max-h-[560px]" }} />
          </CodeFold>
        </Tab>
      ))}
    </Tabs>
  );
}
