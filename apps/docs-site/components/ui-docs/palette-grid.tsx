import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteBrowser, type PaletteCard } from "./palette-browser";

/** Every palette, filterable by colour family and harmony scheme; each card opens the palette's page. */
export function PaletteGrid() {
  const cards: PaletteCard[] = buildPalettes().map((p) => ({
    id: p.id,
    name: p.name,
    source: p.harmony ? `${p.harmony.scheme[0]!.toUpperCase()}${p.harmony.scheme.slice(1)}` : p.source,
    family: p.harmony?.family ?? "Curated",
    scheme: p.harmony?.scheme ?? "curated",
    display: p.display,
  }));
  return <PaletteBrowser cards={cards} />;
}
