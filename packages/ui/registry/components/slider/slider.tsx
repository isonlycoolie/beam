/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Composed from measured parts: the usage meter's 4px-radius --surface-2 track, a --primary fill, and a 16px
// thumb with the field shadow.
function Slider({ className, defaultValue, value, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const count = (value ?? defaultValue ?? [0]).length;
  return (
    <SliderPrimitive.Root data-slot="slider" defaultValue={defaultValue} value={value} className={cn("relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50", className)} {...props}>
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-[4px] bg-surface-2 shadow-[inset_0_0_0_1px_var(--border)]">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb key={i} className="block size-4 rounded-full bg-card shadow-(--shadow-1) outline-none focus-visible:shadow-(--focus-ring)" />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
