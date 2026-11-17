/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import { Loading03Icon } from "@hugeicons/core-free-icons";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

function Spinner({ className, label = "Loading", ...props }: Omit<React.ComponentProps<"span">, "children"> & { label?: string }) {
  return (
    <span role="status" data-slot="spinner" className={cn("inline-flex text-text-3", className)} {...props}>
      <Icon icon={Loading03Icon} size="sm" className="animate-spin" label={label} />
    </span>
  );
}

export { Spinner };
