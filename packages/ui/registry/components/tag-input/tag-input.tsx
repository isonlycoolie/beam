/* Anatomy and keyboard from Sesama UI (MIT); built from Beam's Input Group and Chip (see CREDITS.md). */
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../../lib/cn";
import { Chip, ChipRemove } from "../chip/chip";
import { GlassBackdrop } from "../liquid-glass/liquid-glass";

/** Adds the tags in `raw` (split on commas and new lines) to `tags`: trimmed, no blanks, no repeats, at most `max`. */
function addTags(tags: readonly string[], raw: string, max = Number.POSITIVE_INFINITY) {
  const next = [...tags];
  for (const part of raw.split(/[,\n]/)) {
    const tag = part.trim();
    if (!tag || next.some((t) => t.toLowerCase() === tag.toLowerCase())) continue;
    if (next.length >= max) break;
    next.push(tag);
  }
  return next;
}

// Input's field (card, field shadow, focus ring on the whole box) at Input's heights; chips one step smaller inside.
const tagInputVariants = cva(
  [
    "relative flex w-full min-w-0 flex-wrap items-center rounded-(--radius-md) bg-card text-text-1 shadow-(--shadow-1)",
    "transition-shadow duration-(--dur-fast) has-[input:focus-visible]:shadow-(--focus-ring)",
    "aria-invalid:shadow-[0_0_0_1px_var(--danger),0_0_0_3px_color-mix(in_oklab,var(--danger)_25%,transparent)]",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "min-h-(--control-sm) gap-1 px-1 py-0.5 text-[13px] leading-[18px]",
        md: "min-h-(--control-md) gap-1 px-1.5 py-1 text-[14px] leading-[20px]",
        lg: "min-h-(--control-lg) gap-1.5 px-2 py-1.5 text-[16px] leading-[24px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

type TagInputProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> &
  VariantProps<typeof tagInputVariants> & {
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (tags: string[]) => void;
    /** The most tags it takes; typing stops adding at the limit. */
    max?: number;
    placeholder?: string;
    disabled?: boolean;
    /** Names the text field for screen readers, e.g. "Tags". */
    label?: string;
    /** Submits the tags with a form, joined by commas. */
    name?: string;
    id?: string;
  };

function TagInput({ value: valueProp, defaultValue = [], onValueChange, max, placeholder, disabled = false, label, name, id, size, className, ...props }: TagInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const tags = valueProp ?? inner;
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const full = max !== undefined && tags.length >= max;

  const commit = (next: string[]) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  const add = (raw: string) => {
    const next = addTags(tags, raw, max);
