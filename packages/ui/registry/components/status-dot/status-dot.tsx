/* Anatomy from Sesama UI (MIT); styled with Beam's tokens (see CREDITS.md). */
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../../lib/cn";

// An 8px dot 6px from its word, in the type of the control sizes beside it: 13px with sm, 14px with md, 16px with lg.
const statusDotVariants = cva("inline-flex w-fit shrink-0 items-center text-text-1", {
  variants: {
    variant: {
      default: "[--dot:var(--input)]",
      info: "[--dot:var(--info)]",
      success: "[--dot:var(--success)]",
      warning: "[--dot:var(--warning)]",
      danger: "[--dot:var(--danger)]",
      // The shared name for danger, as on Button.
      destructive: "[--dot:var(--danger)]",
      disabled: "[--dot:var(--text-3)] [&>[data-slot=status-dot-mark]]:opacity-45",
    },
    size: {
      sm: "gap-1.5 text-[13px] leading-[20px] [--dot-size:8px]",
      md: "gap-1.5 text-[14px] leading-[20px] [--dot-size:8px]",
      lg: "gap-2 text-[16px] leading-[24px] [--dot-size:10px]",
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

type StatusDotProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof statusDotVariants> & {
    /** Visible text next to the dot. Without it, `label` names the dot for screen readers. */
    children?: React.ReactNode;
    /** The dot's accessible name when there is no visible text, e.g. "Online". */
    label?: string;
    /** Pulses while something is in progress. Still under reduced motion. */
    pulse?: boolean;
  };

function StatusDot({ className, variant, size, label, pulse = false, children, ...props }: StatusDotProps) {
  const named = children == null && label;
  return (
    <span
      data-slot="status-dot"
      data-variant={variant ?? "default"}
      data-size={size ?? "md"}
      data-pulse={pulse || undefined}
      role={named ? "img" : undefined}
      aria-label={named ? label : undefined}
      className={cn(statusDotVariants({ variant, size }), className)}
      {...props}
    >
      <span
        data-slot="status-dot-mark"
        aria-hidden="true"
        className={cn("size-(--dot-size) shrink-0 rounded-full bg-(--dot)", pulse && "motion-safe:animate-[beam-pulse_1.5s_ease-in-out_infinite]")}
      />
      {children != null && <span data-slot="status-dot-label">{children}</span>}
    </span>
  );
}

export { StatusDot, statusDotVariants };
