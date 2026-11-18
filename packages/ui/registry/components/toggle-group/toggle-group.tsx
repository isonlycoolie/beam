/* Based on shadcn/ui (MIT). Sizes, type and shadows are measured references (see CREDITS.md). */
"use client";

import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "../../../lib/cn";
import { toggleVariants } from "../toggle/toggle";

type ToggleGroupStyle = VariantProps<typeof toggleVariants> & { variant?: "default" | "outline" };
const ToggleGroupContext = React.createContext<ToggleGroupStyle>({ variant: "default", size: "md" });

// default: Toggle boxes 8px apart. outline: one segmented control with a 1px --input ring and dividers.
function ToggleGroup({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & ToggleGroupStyle) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn("flex w-fit items-center", variant === "outline" ? "gap-0 rounded-(--radius-md) shadow-[0_0_0_1px_var(--input)]" : "gap-2", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { variant, size } = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={variant}
      className={cn(
        toggleVariants({ size }),
        variant === "outline" && "rounded-none border-s border-input shadow-none first:rounded-s-(--radius-md) first:border-s-0 last:rounded-e-(--radius-md)",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
