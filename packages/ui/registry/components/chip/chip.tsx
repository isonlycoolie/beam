/* Anatomy from Sesama UI (MIT); styled as Beam's own controls (see CREDITS.md). */
"use client";

import { GlassBackdrop } from "../liquid-glass/liquid-glass";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot, Toggle as TogglePrimitive } from "radix-ui";
import type * as React from "react";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";

// Toggle's heights and sides (24, 28 and 44px), Badge's 6px radius, weight and soft tone pairs, Button's secondary
// fill and hover. Pressed reads like a pressed Toggle: full-strength text and a 2px ring, --primary or the tone.
const chipVariants = cva(
  [
    "group/chip relative inline-flex w-fit max-w-full shrink-0 items-center whitespace-nowrap rounded-(--radius-md) font-medium",
    "transition-[background-color,color,box-shadow] duration-(--dur-fast) ease-(--ease-out)",
    "outline-none focus-visible:shadow-(--focus-ring) disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0",
    "data-[state=on]:shadow-[0_0_0_2px_currentColor]",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-text-2 hover:not-disabled:bg-accent hover:not-disabled:text-text-1 data-[state=on]:bg-card data-[state=on]:text-text-1 data-[state=on]:shadow-[0_0_0_2px_var(--primary)]",
        info: "bg-info-soft text-info",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        // The shared name for danger, as on Button.
        destructive: "bg-danger-soft text-danger",
      },
      size: {
        sm: "h-6 gap-1.5 px-2 text-[13px] leading-[16px] [&_svg]:size-3.5",
        md: "h-7 gap-1.5 px-3 text-[14px] leading-[20px] [&_svg]:size-4",
        lg: "h-(--control-lg) gap-2 px-3 text-[14px] leading-[20px] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type ChipVariantProps = VariantProps<typeof chipVariants>;

/** A compact item, tag or filter that only shows a value. Add ChipRemove inside to make it removable. */
function Chip({ className, variant, size, asChild = false, children, ...props }: React.ComponentProps<"span"> & ChipVariantProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp data-slot="chip" data-variant={variant ?? "default"} data-size={size ?? "md"} className={cn(chipVariants({ variant, size }), className)} {...props}>
      {/* Slot takes exactly one child: with asChild the child element is the chip, without a glass layer. */}
      {asChild ? (
        children
      ) : (
        <>
          <GlassBackdrop />
          {children}
        </>
      )}
    </Comp>
  );
}

/** A chip that turns on and off, for filters. Controlled with `pressed` and `onPressedChange`. */
function ChipToggle({ className, variant, size, children, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & ChipVariantProps) {
  return (
    <TogglePrimitive.Root
      data-slot="chip"
      data-variant={variant ?? "default"}
      data-size={size ?? "md"}
      className={cn(chipVariants({ variant, size }), "cursor-pointer", className)}
      {...props}
    >
      <GlassBackdrop />
      {children}
    </TogglePrimitive.Root>
  );
}

/** The chip's remove button: 16px, a 12px cross. `label` names it, e.g. "Remove Design". */
function ChipRemove({ className, label = "Remove", ...props }: Omit<React.ComponentProps<"button">, "children"> & { label?: string }) {
  return (
    <button
      type="button"
      data-slot="chip-remove"
      aria-label={label}
      className={cn(
        "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-text-2 outline-none",
        "hover:text-text-1 focus-visible:shadow-(--focus-ring) disabled:pointer-events-none group-data-[size=lg]/chip:size-5 [&_svg]:size-3!",
        className,
      )}
      {...props}
    >
      <Icon icon={Cancel01Icon} size="sm" />
    </button>
  );
}

export { Chip, ChipToggle, ChipRemove, chipVariants };
