import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaletteFilterPage } from "@/components/ui-docs/palette-filter-page";
import { SCHEMES } from "@/components/ui-docs/palette-grid";

type Props = { params: Promise<{ scheme: string }> };

const LEAD: Record<string, string> = {
  curated: "Established open-source palettes, kept as their makers designed them.",
  complementary: "A primary and the colour opposite it on the colour wheel: the strongest contrast.",
  analogous: "A primary with its two neighbours on the colour wheel: one calm family.",
  triadic: "Three colours a third of the colour wheel apart: lively, and still balanced.",
  "split-complementary": "A primary with the two neighbours of its opposite: strong contrast, softer than a complement.",
};

export default async function Page({ params }: Props) {
  const { scheme } = await params;
  const s = SCHEMES.find(([v]) => v === scheme);
  if (!s) notFound();
  return <PaletteFilterPage title={s[1]} lead={LEAD[scheme]!} scheme={scheme} />;
}

export const generateStaticParams = () => SCHEMES.map(([scheme]) => ({ scheme }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scheme } = await params;
  return { title: `${SCHEMES.find(([v]) => v === scheme)?.[1] ?? "Palettes"} palettes` };
}
