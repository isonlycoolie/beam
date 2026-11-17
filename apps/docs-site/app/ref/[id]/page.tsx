import { notFound } from "next/navigation";
import { SHOWCASES } from "@/components/showcase/registry";
import { COMPONENT_REFS } from "@/components/ui-docs/component-refs";
import { ThemeRoot } from "./theme-root";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ palette?: string; mode?: string }> };

/**
 * One rebuilt reference on its own, for pixel and layout checks against the captured original
 * (scripts/ref-compare.mjs). Not linked from the docs, and off in production builds: some rebuilds carry the
 * reference's own words so text can be matched. Set BEAM_REF_HARNESS=1 to build it for checks.
 */
const ON = process.env.NODE_ENV !== "production" || process.env.BEAM_REF_HARNESS === "1";

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  if (!ON) notFound();
  const { palette = "default", mode } = await searchParams;
  const showcase = SHOWCASES[id] ?? COMPONENT_REFS[id];
  if (!showcase) notFound();
  const { Component } = showcase;
  return (
    <div data-theme={palette} className={`${mode ?? showcase.mode} min-h-screen bg-background p-10`}>
      <ThemeRoot palette={palette} mode={mode ?? showcase.mode} />
      <div data-ref-root className="inline-block">
        <Component />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  if (!ON) return [];
  return [...Object.keys(SHOWCASES), ...Object.keys(COMPONENT_REFS)].map((id) => ({ id }));
}
