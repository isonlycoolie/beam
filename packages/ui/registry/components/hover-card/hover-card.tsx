/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";

import { HoverCard as HoverCardPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

// The measured popover surface with 16px padding.
function HoverCardContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        sideOffset={sideOffset}
        className={cn("z-50 w-72 rounded-(--radius-md) border border-input bg-popover p-4 text-popover-foreground shadow-(--shadow-3) outline-none", className)}
        {...props}
      >
        <GlassBackdrop />
        {props.children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
