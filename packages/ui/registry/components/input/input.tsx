/* Based on shadcn/ui (MIT). Restyled for Beam UI: token height, quiet border, clear focus and invalid states. */
import type * as React from "react";
import { cn } from "../../../lib/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-(--control-md) w-full min-w-0 rounded-md border border-input bg-background px-3 text-body text-text-1 shadow-1",
        "transition-[border-color,box-shadow] duration-(--dur-fast) ease-(--ease-out) outline-none",
        "placeholder:text-text-3 selection:bg-primary selection:text-primary-foreground",
        "hover:border-text-3/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
        "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
        "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-60",
        "file:me-3 file:border-0 file:bg-transparent file:text-small file:font-medium file:text-text-1",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
