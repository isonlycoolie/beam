/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// The Docs segmented boxes: 28px, 4px radius, 14px, a 1px --border ring; pressed takes a 2px --primary ring.
const toggleVariants = cva(
  "inline-flex h-7 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] bg-card px-3 text-[14px] text-text-2 shadow-[0_0_0_1px_var(--border)] outline-none hover:text-text-1 focus-visible:shadow-(--focus-ring) disabled:opacity-50 data-[state=on]:text-text-1 data-[state=on]:shadow-[0_0_0_2px_var(--primary)] [&_svg]:size-4 [&_svg]:shrink-0",
  { variants: { size: { md: "", sm: "h-6 px-2 text-[13px]" } }, defaultVariants: { size: "md" } },
);

function Toggle({ className, size, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ size }), className)} {...props} />;
}

export { Toggle, toggleVariants };
