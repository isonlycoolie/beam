/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import type * as React from "react";
import { cn } from "../../../lib/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-(--radius-md) bg-card text-text-1 shadow-(--shadow-1) outline-none",
        "transition-shadow duration-(--dur-fast) placeholder:text-text-3",
        "focus-visible:shadow-(--focus-ring) aria-invalid:shadow-[0_0_0_1px_var(--danger),0_0_0_3px_color-mix(in_oklab,var(--danger)_25%,transparent)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "field-sizing-content min-h-20 px-3 py-2 text-[14px] leading-[20px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
