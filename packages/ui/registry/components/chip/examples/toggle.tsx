"use client";

import { useState } from "react";
import { ChipToggle } from "@beam/ui/components/chip";

const FILTERS = ["Open", "Assigned to me", "Has replies", "Archived"];

export default function ChipToggleExample() {
  const [on, setOn] = useState<string[]>(["Open"]);
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <ChipToggle
          key={filter}
          pressed={on.includes(filter)}
          onPressedChange={(pressed) => setOn((current) => (pressed ? [...current, filter] : current.filter((f) => f !== filter)))}
          disabled={filter === "Archived"}
        >
          {filter}
        </ChipToggle>
      ))}
    </div>
  );
}
