/* Anatomy from Sesama UI (MIT); built from Beam's Popover, Calendar and Button, as shadcn composes them (see CREDITS.md). */
"use client";

import { Calendar03Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Icon } from "../../../icons/icon";
import { cn } from "../../../lib/cn";
import { Button } from "../button/button";
import { Calendar } from "../calendar/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

const SAME_YEAR: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const FULL: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

/** "Nov 18, 2026", or "Nov 3 – Nov 18, 2026" for a range (the year once when both ends share it). */
function formatDateValue(value: Date | DateRange | undefined, locale?: string) {
  if (!value) return "";
  if (value instanceof Date) return value.toLocaleDateString(locale, FULL);
  if (!value.from) return "";
  if (!value.to) return `${value.from.toLocaleDateString(locale, FULL)} –`;
  const sameYear = value.from.getFullYear() === value.to.getFullYear();
  return `${value.from.toLocaleDateString(locale, sameYear ? SAME_YEAR : FULL)} – ${value.to.toLocaleDateString(locale, FULL)}`;
}

type Common = {
  placeholder?: string;
  /** sm, md or lg: the trigger takes Button's size. */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Shows a clear button once a date is picked. */
  clearable?: boolean;
  /** The trigger's id, for a Label's htmlFor. */
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
};

type DatePickerProps =
  | (Common & { mode?: "single"; value?: Date; defaultValue?: Date; onValueChange?: (date: Date | undefined) => void })
  | (Common & { mode: "range"; value?: DateRange; defaultValue?: DateRange; onValueChange?: (range: DateRange | undefined) => void });

// The trigger is an outline Button with the calendar icon first; the month opens in a Popover, as shadcn's date picker.
function DatePicker(props: DatePickerProps) {
  const { placeholder = props.mode === "range" ? "Pick dates" : "Pick a date", size = "md", disabled, clearable = true, id, className } = props;
  const [inner, setInner] = React.useState<Date | DateRange | undefined>(props.defaultValue);
  const value = props.value !== undefined ? props.value : inner;
  const [open, setOpen] = React.useState(false);

  const change = (next: Date | DateRange | undefined) => {
    if (props.value === undefined) setInner(next);
    (props.onValueChange as ((v: typeof next) => void) | undefined)?.(next);
  };
  const label = formatDateValue(value);

  return (
    <div data-slot="date-picker" data-size={size} className={cn("relative inline-flex w-fit min-w-0", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
