/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import type * as React from "react";
import { cn } from "../../../lib/cn";

// The chip's measured box (12/500/16px, 1px --input border, 6px radius) at key size.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-[4px] border border-input bg-card px-1 font-[family-name:var(--theme-font-text)] text-[12px] leading-[16px] font-medium text-text-2",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
