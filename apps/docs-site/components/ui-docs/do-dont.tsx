import { CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EXAMPLES } from "./examples.gen";

/** Live right and wrong versions side by side, with the reason under each. Never screenshots. */
export function DoDont({ name, doNote, dontNote }: { name: string; doNote: string; dontNote: string }) {
  const Do = EXAMPLES[`${name}/do`]?.Component;
  const Dont = EXAMPLES[`${name}/dont`]?.Component;
  if (!Do || !Dont) throw new Error(`Add do.tsx and dont.tsx to ${name}/do-dont.`);
  const panel = (ok: boolean, Example: typeof Do, note: string) => (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-fd-border">
      {/* Same stage as every preview: the page's colour, following the site's light or dark mode. */}
      <div data-theme="default" className="flex min-h-[200px] flex-1 items-center justify-center p-8">
        <Example />
      </div>
      <figcaption className="flex items-start gap-2 border-t border-fd-border px-4 py-3 text-sm">
        <span className={ok ? "text-fd-foreground" : "text-fd-muted-foreground"}>
          <HugeiconsIcon icon={ok ? CheckmarkCircle02Icon : Cancel01Icon} size={18} strokeWidth={1.75} />
        </span>
        <span className="text-fd-muted-foreground">
          <strong className="font-medium text-fd-foreground">{ok ? "Do." : "Don't."}</strong> {note}
        </span>
      </figcaption>
    </figure>
  );
  return (
    // Stacked, full width: layout rules (rows, columns, balance) only show at a real width.
    <div className="not-prose my-6 grid gap-4">
      {panel(true, Do, doNote)}
      {panel(false, Dont, dontNote)}
    </div>
  );
}
