"use client";

import * as React from "react";
import { Label } from "@beam/ui/components/label";
import { TagInput } from "@beam/ui/components/tag-input";

export default function TagInputLimit() {
  const [tags, setTags] = React.useState(["Payments", "Payouts", "Refunds"]);
  const full = tags.length >= 3;
  return (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="topics">Topics</Label>
      <TagInput id="topics" label="Topics" value={tags} onValueChange={setTags} max={3} aria-invalid={full || undefined} />
      <p className={full ? "text-[12px] leading-[16px] text-danger" : "text-[12px] leading-[16px] text-text-3"}>
        {tags.length} of 3 topics{full ? ". Remove one to add another." : "."}
      </p>
    </div>
  );
}
