import { Add01Icon, Delete02Icon, Share01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LiquidGlass } from "@beam/ui/components/liquid-glass";

const ACTIONS = [
  { label: "Add", icon: Add01Icon },
  { label: "Share", icon: Share01Icon },
  { label: "Delete", icon: Delete02Icon },
];

/** A floating toolbar over a photo, the way iOS places controls over media. */
export default function LiquidGlassToolbar() {
  return (
    <div
      className="relative flex h-[320px] w-full max-w-[560px] items-end justify-center overflow-hidden rounded-[16px] bg-cover bg-center pb-6"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1120&q=55&auto=format&fit=crop)" }}
    >
      <LiquidGlass className="flex items-center gap-1 p-1.5">
        {ACTIONS.map((a) => (
          <button key={a.label} type="button" aria-label={a.label} className="flex size-11 items-center justify-center rounded-full text-text-1 outline-none hover:bg-black/5 focus-visible:shadow-(--focus-ring)">
            <HugeiconsIcon icon={a.icon} size={22} strokeWidth={1.75} />
          </button>
        ))}
      </LiquidGlass>
    </div>
  );
}
