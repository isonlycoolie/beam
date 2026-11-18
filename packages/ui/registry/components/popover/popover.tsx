/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";

import { Popover as PopoverPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

// The measured menu surface: --popover, 1px --input border, 6px radius, 16px padding, a three-layer shadow.
function PopoverContent({ className, align = "center", sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50 rounded-(--radius-md) border border-input bg-popover text-popover-foreground shadow-(--shadow-3) w-72 p-4 outline-none", className)}
        {...props}
      >
        <GlassBackdrop />
        {props.children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
