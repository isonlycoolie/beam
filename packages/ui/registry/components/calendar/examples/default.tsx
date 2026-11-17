"use client";

import { useState } from "react";
import { Calendar } from "@beam/ui/components/calendar";

export default function CalendarDefault() {
  return (
    <CalendarExample />
  );
}

function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 18));
  return <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 10, 1)} className="rounded-(--radius-card) border border-border" />;
}
