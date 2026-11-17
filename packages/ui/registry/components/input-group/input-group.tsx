/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import type * as React from "react";
import { cn } from "../../../lib/cn";

// One measured field box (6px radius, the field shadow, the 3px focus halo) holding the input and its add-ons.
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "flex h-(--control-md) w-full items-center rounded-(--radius-md) bg-card shadow-(--shadow-1) has-[input:focus-visible]:shadow-(--focus-ring) has-[[aria-invalid=true]]:shadow-[0_0_0_1px_var(--danger)]",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input-group-input" className={cn("h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] leading-[20px] text-text-1 outline-none placeholder:text-text-3", className)} {...props} />;
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="input-group-addon" className={cn("flex items-center gap-1 px-3 text-[14px] text-text-3 first:pe-0 last:ps-0 [&_svg]:size-4", className)} {...props} />;
}

export { InputGroup, InputGroupAddon, InputGroupInput };
