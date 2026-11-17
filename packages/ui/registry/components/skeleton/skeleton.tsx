/* Based on shadcn/ui (MIT). Restyled for Beam UI: a soft shimmer that stops for reduced motion. */
import type * as React from "react";
import { cn } from "../../../lib/cn";

/** A placeholder block. Size it exactly like the content it stands in for (rule skeleton.fidelity). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-(--radius-md) bg-surface-2",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[beam-shimmer_1.4s_var(--ease-out)_infinite]",
        "after:bg-linear-to-r after:from-transparent after:via-white/40 dark:after:via-white/5 after:to-transparent",
        "motion-reduce:after:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
