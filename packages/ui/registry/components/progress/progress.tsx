/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// The billing card's usage meter: a 14px --surface-2 track with a 4px radius, and a 10px fill inset 2px with a
// 3px radius.
function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("relative h-3.5 w-full overflow-hidden rounded-[4px] bg-surface-2", className)} {...props}>
      <div className="absolute inset-0.5">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full rounded-[3px] bg-primary transition-[width] duration-(--dur-base)"
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
