import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaletteFilterPage } from "@/components/ui-docs/palette-filter-page";
import { FAMILIES } from "@/components/ui-docs/palette-grid";

type Props = { params: Promise<{ family: string }> };

export default async function Page({ params }: Props) {
  const { family } = await params;
  const f = FAMILIES.find(([s]) => s === family);
  if (!f) notFound();
  const lead = family === "curated" ? "Established open-source palettes, kept as their makers designed them." : `Palettes led by ${f[1].toLowerCase()}, each in four colour-harmony schemes.`;
  return <PaletteFilterPage title={f[1]} lead={lead} family={family} />;
}

export const generateStaticParams = () => FAMILIES.map(([family]) => ({ family }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { family } = await params;
  return { title: `${FAMILIES.find(([s]) => s === family)?.[1] ?? "Palettes"} palettes` };
}
