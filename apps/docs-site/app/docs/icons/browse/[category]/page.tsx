import { DocsBody, DocsPage } from "fumadocs-ui/layouts/notebook/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconBrowser } from "@/components/ui-docs/icon-browser";
import { CATEGORIES, slugOf } from "@/lib/icon-categories.mjs";

const NAMES: string[] = [...CATEGORIES.map(([name]: [string, string]) => name), "Other"];

type Props = { params: Promise<{ category: string }> };

/** One Browse page per category; the sidebar is the filter. */
export default async function Page({ params }: Props) {
  const { category } = await params;
  const index = NAMES.findIndex((name) => slugOf(name) === category);
  if (index === -1) notFound();
  return (
    <DocsPage full breadcrumb={{ enabled: true, includeRoot: true, includePage: true }} footer={{ enabled: false }}>
      <h1 className="beam-title">{NAMES[index]}</h1>
      <p className="beam-lead mb-2">{NAMES[index]} icons from the free set. Hover for the name, click to copy.</p>
      <DocsBody>
        <IconBrowser category={index} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return NAMES.map((name) => ({ category: slugOf(name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = NAMES.find((n) => slugOf(n) === category);
  return { title: name ? `${name} icons` : "Icons" };
}
