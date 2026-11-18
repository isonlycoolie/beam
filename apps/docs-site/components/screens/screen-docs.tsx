import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import Link from "next/link";
import { allScreens, readScreen, screenSource } from "@/lib/screens";
import { ScreenFrame } from "./screen-frame";
import { ScreenThumb } from "./screen-thumb";

const tall = (id: string) => (id.startsWith("dashboard") || id.startsWith("sidebar") ? 820 : 720);

export function ScreenPreview({ id }: { id: string }) {
  return <ScreenFrame id={id} height={tall(id)} />;
}

export function ScreenInstall({ id }: { id: string }) {
  return (
    <Tabs items={["Command", "shadcn CLI"]}>
      <Tab value="Command">
        <DynamicCodeBlock lang="bash" code={`npx usebeam add screens/${id}`} />
      </Tab>
      <Tab value="shadcn CLI">
        <DynamicCodeBlock lang="bash" code={`npx shadcn@latest add https://beam.dev/r/screens/${id}.json`} />
      </Tab>
    </Tabs>
  );
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
        <p>This screen has no sample data: wire the form to your own action or route.</p>
      )}
      <p className="text-fd-muted-foreground">It installs into <code>app/{id}/page.tsx</code>, with its parts in <code>components/</code>. Based on {spec.source}.</p>
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
          <DynamicCodeBlock lang="tsx" code={screenSource(id, f)} codeblock={{ "data-line-numbers": true, className: "max-h-[560px]" }} />
        </Tab>
      ))}
    </Tabs>
  );
}

const GROUP_TITLES: Record<string, string> = { Dashboard: "Dashboards", Sidebar: "Sidebars", Login: "Login", "Sign up": "Sign up" };

/** Every screen, grouped, each card showing the live page scaled down. */
export function ScreenGrid() {
  const screens = allScreens();
  const groups = Object.keys(GROUP_TITLES).map((g) => ({ g, items: screens.filter((s) => s.group === g) }));
  return (
    <div className="not-prose flex flex-col gap-12">
      {groups.map(({ g, items }) => (
        <section key={g}>
          <h2 className="mb-4 text-[18px] font-semibold text-fd-foreground">
            {GROUP_TITLES[g]} <span className="ms-1 text-[14px] font-normal text-fd-muted-foreground">{items.length}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((s) => (
              <Link key={s.id} href={`/docs/screens/${s.id}`} className="group block">
                <div className="overflow-hidden rounded-xl border border-fd-border transition-colors group-hover:border-fd-foreground/30">
                  <ScreenThumb id={s.id} />
                </div>
                <div className="mt-3 text-[14px] font-medium text-fd-foreground">{s.title.split(" · ").slice(1).join(" · ")}</div>
                <div className="text-[13px] text-fd-muted-foreground">{s.summary}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
