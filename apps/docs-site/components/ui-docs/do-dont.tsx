import { CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EXAMPLES } from "./examples.gen";

/** Live right and wrong versions side by side, with the reason under each. Never screenshots. */
export function DoDont({ name, doNote, dontNote }: { name: string; doNote: string; dontNote: string }) {
  const Do = EXAMPLES[`${name}/do`]?.Component;
  const Dont = EXAMPLES[`${name}/dont`]?.Component;
  if (!Do || !Dont) throw new Error(`Add do.tsx and dont.tsx to ${name}/do-dont.`);
  const panel = (ok: boolean, Example: typeof Do, note: string) => (
    <figure className="flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#121212]">
      <div data-theme="beam" className="light flex min-h-[200px] flex-1 items-center justify-center bg-background p-8">
        <Example />
      </div>
      <figcaption className="flex items-start gap-2 border-t border-[#2a2a2a] px-4 py-3 text-sm">
        <span className={ok ? "text-[#3ccf8e]" : "text-[#ff5c75]"}>
          <HugeiconsIcon icon={ok ? CheckmarkCircle02Icon : Cancel01Icon} size={18} strokeWidth={1.75} />
        </span>
        <span className="text-[#d4d4d4]">
          <strong className="text-[#f5f5f4]">{ok ? "Do." : "Don't."}</strong> {note}
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
