/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Checkout field: 6px radius, a 1px --input ring with two soft shadows, 12px sides; focus adds a 3px halo.
// lg is the Checkout size (44px, 16/24); md is the dashboard size (36px, 14/20).
const inputVariants = cva(
  [
        "w-full min-w-0 rounded-(--radius-md) bg-card text-text-1 shadow-(--shadow-1) outline-none",
        "transition-shadow duration-(--dur-fast) placeholder:text-text-3",
        "focus-visible:shadow-(--focus-ring) aria-invalid:shadow-[0_0_0_1px_var(--danger),0_0_0_3px_color-mix(in_oklab,var(--danger)_25%,transparent)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
    "file:me-3 file:border-0 file:bg-transparent file:text-[14px] file:font-medium file:text-text-1",
  ],
  {
    variants: {
      size: {
        md: "h-(--control-md) px-3 text-[14px] leading-[20px]",
        lg: "h-(--control-lg) px-3 py-2 text-[16px] leading-[24px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

function Input({ className, type, size, ...props }: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return <input type={type} data-slot="input" className={cn(inputVariants({ size }), className)} {...props} />;
}

export { Input, inputVariants };
