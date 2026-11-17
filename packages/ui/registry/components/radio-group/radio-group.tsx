/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />;
}

// A plain radio: the Checkbox's 16px box, round.
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-full bg-card shadow-[0_0_0_1px_var(--text-3),0_2px_4px_rgb(0_0_0/0.07)]",
        "data-[state=checked]:shadow-[0_0_0_1px_var(--primary)] outline-none focus-visible:shadow-(--focus-ring) disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  );
}

// Checkout currency choice: 44px cards, 12px padding, 6px radius, 16/500/18.4px; the chosen card's 1px border
// turns --text-1, the others stay --input.
function RadioCard({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      className={cn(
        "flex h-11 items-center gap-1 rounded-(--radius-md) border border-input bg-card p-3 text-start text-[16px] leading-[18.4px] font-medium text-text-1",
        "data-[state=checked]:border-text-1 outline-none focus-visible:shadow-(--focus-ring) disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { RadioCard, RadioGroup, RadioGroupItem };
