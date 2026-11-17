/* Based on shadcn/ui (MIT). Restyled for Beam UI. */
"use client";

import { Label as LabelPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "../../../lib/cn";

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 text-small font-medium text-text-1",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-60 group-data-[disabled=true]:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
