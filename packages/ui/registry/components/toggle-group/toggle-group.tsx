/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";
import { toggleVariants } from "../toggle/toggle";

// The Docs integration picker: Toggle boxes 8px apart.
function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("flex items-center gap-2", className)} {...props} />;
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return <ToggleGroupPrimitive.Item data-slot="toggle-group-item" className={cn(toggleVariants(), className)} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
