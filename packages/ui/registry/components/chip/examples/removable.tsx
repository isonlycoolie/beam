"use client";

import { useState } from "react";
import { Chip, ChipRemove } from "@beam/ui/components/chip";

export default function ChipRemovable() {
  const [tags, setTags] = useState(["Design", "Research", "Billing"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip key={tag}>
          {tag}
          <ChipRemove label={`Remove ${tag}`} onClick={() => setTags((current) => current.filter((t) => t !== tag))} />
        </Chip>
      ))}
    </div>
  );
}
