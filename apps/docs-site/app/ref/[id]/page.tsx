import { notFound } from "next/navigation";
import { SHOWCASES } from "@/components/showcase/registry";
import { COMPONENT_REFS } from "@/components/ui-docs/component-refs";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ palette?: string; mode?: string }> };

/**
 * One rebuilt reference on its own, for pixel and layout checks against the captured original
 * (scripts/ref-compare.mjs). Not linked from the docs.
 */
export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { palette = "default", mode } = await searchParams;
  const showcase = SHOWCASES[id] ?? COMPONENT_REFS[id];
  if (!showcase) notFound();
  const { Component } = showcase;
  return (
    <div data-theme={palette} className={`${mode ?? showcase.mode} min-h-screen bg-background p-10`}>
      <div data-ref-root className="inline-block">
        <Component />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [...Object.keys(SHOWCASES), ...Object.keys(COMPONENT_REFS)].map((id) => ({ id }));
}
