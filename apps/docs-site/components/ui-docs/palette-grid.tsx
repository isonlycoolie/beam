import Link from "next/link";
import { buildPalettes, type Palette } from "@beam/ui/palettes/palettes.ts";
import { PaletteStrip } from "./palette-strip";

/** Colour families and harmony schemes, as the sidebar filters them (slug, label). */
export const FAMILIES = [
  ["curated", "Curated"],
  ["reds", "Reds"],
  ["pinks-and-purples", "Pinks and purples"],
  ["blues", "Blues"],
  ["greens", "Greens"],
  ["yellows-and-oranges", "Yellows and oranges"],
  ["earth", "Earth"],
] as const;
export const SCHEMES = [
  ["curated", "Curated"],
  ["complementary", "Complementary"],
  ["analogous", "Analogous"],
  ["triadic", "Triadic"],
  ["split-complementary", "Split-complementary"],
] as const;

const slug = (s: string) => s.toLowerCase().replaceAll(" ", "-");
const familyOf = (p: Palette) => (p.harmony ? slug(p.harmony.family) : "curated");
const schemeOf = (p: Palette) => p.harmony?.scheme ?? "curated";

/** Palettes as colour strips; the strip opens the palette. Filter by family or scheme (the sidebar's pages). */
export function PaletteGrid({ family, scheme }: { family?: string; scheme?: string }) {
  const palettes = buildPalettes().filter((p) => (!family || familyOf(p) === family) && (!scheme || schemeOf(p) === scheme));
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {palettes.map((p) => (
        <Link key={p.id} href={`/docs/palettes/${p.id}`} aria-label={p.name} title={p.name} className="block rounded-xl outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-fd-ring">
          <PaletteStrip colors={p.display} />
        </Link>
      ))}
    </div>
  );
}
