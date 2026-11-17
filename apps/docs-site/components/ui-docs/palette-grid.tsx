import Link from "next/link";
import { buildPalettes } from "@beam/ui/palettes/palettes.ts";
import { PaletteStrip } from "./palette-strip";

/** Every palette as a colour strip, its name and source; the name opens the palette's page. */
export function PaletteGrid() {
  const palettes = buildPalettes();
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {palettes.map((p) => (
        <div key={p.id}>
          <PaletteStrip colors={p.display} />
          <Link href={`/docs/palettes/${p.id}`} className="group mt-2.5 flex flex-col gap-0.5 px-1">
            <span className="text-[15px] text-fd-foreground group-hover:underline group-hover:underline-offset-4">{p.name}</span>
            <span className="text-xs text-fd-muted-foreground">{p.source}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
