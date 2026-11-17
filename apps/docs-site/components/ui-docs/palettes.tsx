import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteGrid } from "./palette-grid";

/** Builds the palettes on the server and hands the grid only what it shows. */
export function Palettes() {
  const palettes = buildPalettes().map(({ hue, tint, primary, accent, ...rest }) => rest);
  return <PaletteGrid palettes={palettes} />;
}
