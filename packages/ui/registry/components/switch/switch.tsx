/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Checkout settings: a 32 x 20 track, 10px radius, 1px inset; on is --primary, off is --input.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-8 shrink-0 items-center rounded-[10px] border border-transparent p-px transition-colors duration-(--dur-fast)",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        "outline-none focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-4 rounded-full bg-white shadow-(--shadow-control) transition-transform duration-(--dur-fast) data-[state=checked]:translate-x-3"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
