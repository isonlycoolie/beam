/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

// A 16px box, 2px radius, a 1px ring in --text-3 with two soft drop shadows; 12px to its label.
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer grid size-4 shrink-0 place-items-center rounded-(--radius-sm) bg-card text-primary-foreground",
        "shadow-[0_0_0_1px_var(--text-3),0_2px_4px_rgb(0_0_0/0.07),0_1px_1.5px_rgb(0_0_0/0.05)]",
        "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_0_1px_var(--primary)]",
        "outline-none focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:shadow-[0_0_0_1px_var(--danger)]",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator">
        <Icon icon={Tick02Icon} size="sm" weight={2} className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
