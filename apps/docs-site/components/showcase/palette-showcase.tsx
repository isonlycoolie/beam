import { FitScale } from "./fit-scale";
import { SHOWCASES } from "./registry";

/**
 * Rebuilt reference sections, coloured only by one palette, at their captured size or scaled down whole when the
 * column is narrower (pixel rebuilds never reflow). Each follows the site's light or dark mode.
 */
export function PaletteShowcase({ palette }: { palette: string }) {
  return (
    <div className="not-prose my-6 flex flex-col gap-8">
      {Object.entries(SHOWCASES).map(([id, s]) => (
        <figure key={id} className="overflow-hidden rounded-xl border border-fd-border">
          <div data-theme={palette} className="bg-background p-6 sm:p-10">
            <FitScale>
              <s.Component />
            </FitScale>
          </div>
          <figcaption className="border-t border-fd-border px-4 py-3 text-sm text-fd-foreground">{s.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}
