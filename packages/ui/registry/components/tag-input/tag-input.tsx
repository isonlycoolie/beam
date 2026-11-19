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
    if (next.length !== tags.length) commit(next);
    setDraft("");
  };
  const chipSize = size === "lg" ? "md" : "sm";

  return (
    <div
      data-slot="tag-input"
      data-size={size ?? "md"}
      data-disabled={disabled || undefined}
      role="group"
      aria-label={label}
      className={cn(tagInputVariants({ size }), className)}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      <GlassBackdrop />
      {tags.map((tag) => (
        <Chip key={tag} size={chipSize}>
          {tag}
          <ChipRemove label={`Remove ${tag}`} disabled={disabled} onClick={() => commit(tags.filter((t) => t !== tag))} />
        </Chip>
      ))}
      <input
        ref={inputRef}
        id={id}
        data-slot="tag-input-input"
        aria-label={label}
        value={draft}
        disabled={disabled}
        readOnly={full}
        placeholder={tags.length === 0 ? placeholder : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === ",") && !event.nativeEvent.isComposing) {
            if (!draft.trim()) return;
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
            commit(tags.slice(0, -1));
          }
        }}
        onPaste={(event) => {
          const text = event.clipboardData.getData("text");
          if (!/[,\n]/.test(text)) return;
          event.preventDefault();
          add(draft + text);
        }}
        onBlur={() => draft.trim() && add(draft)}
        className="h-6 min-w-16 flex-1 bg-transparent px-1.5 outline-none placeholder:text-text-3 disabled:cursor-not-allowed"
      />
      {name ? <input type="hidden" name={name} value={tags.join(",")} /> : null}
    </div>
  );
}

export { addTags, TagInput, tagInputVariants };
