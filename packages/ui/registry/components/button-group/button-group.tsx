/* Based on shadcn/ui (MIT). Design reference: Stripe, measured (Pictures/beam/references/stripe/ui). */
import type * as React from "react";
import { cn } from "../../../lib/cn";

// Joins measured buttons: shared edges lose their radius; only the group's outer corners stay 6px.
function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn("inline-flex items-stretch [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:first-child)]:-ms-px", className)}
      {...props}
    />
  );
}

export { ButtonGroup };
