/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// muted: Checkout panel note (--secondary fill, 6px radius, 12/16px padding, 14/20px, 4px gap).
// rule: Docs note (a 4px --border rule on the left, 12px in, a 12/600 title, 4px gap).
const calloutVariants = cva("flex flex-col gap-1 text-[14px] leading-[20px] text-text-2", {
  variants: {
    variant: {
      muted: "rounded-(--radius-md) bg-secondary px-4 py-3",
      rule: "border-s-4 border-border ps-3",
    },
  },
  defaultVariants: { variant: "muted" },
});

function Callout({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof calloutVariants>) {
  return <div data-slot="callout" role="note" className={cn(calloutVariants({ variant }), className)} {...props} />;
}

function CalloutTitle({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 data-slot="callout-title" className={cn("text-[12px] leading-[16px] font-semibold text-text-1", className)} {...props} />;
}

export { Callout, CalloutTitle, calloutVariants };
