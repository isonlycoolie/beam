/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

// Same measured box as Select's trigger (34px, 1px --input, 6px radius, 1px shadow, 14/500px), with the
// platform's own list. Best on phones.
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div data-slot="native-select-wrapper" className="relative w-fit">
      <select
        data-slot="native-select"
        className={cn(
          "h-[34px] w-full appearance-none rounded-(--radius-md) border border-input bg-card ps-2 pe-7 text-[14px] leading-[16px] font-medium text-text-1",
          "shadow-(--shadow-control) outline-none focus-visible:shadow-(--focus-ring) disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <Icon icon={UnfoldMoreIcon} size="sm" className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-text-1" />
    </div>
  );
}

export { NativeSelect };
