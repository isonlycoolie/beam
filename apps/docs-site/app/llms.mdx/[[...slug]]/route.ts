import { notFound } from "next/navigation";
import { source } from "@/lib/source";

export const revalidate = false;

/** Serves a docs page as Markdown for "Copy Markdown" and for agents. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug?.[0] === "index" ? [] : slug);
  if (!page) notFound();
  const text = await page.data.getText("processed");
  return new Response(`# ${page.data.title}\n\n${text}`, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}

export function generateStaticParams() {
  return source.generateParams();
}
