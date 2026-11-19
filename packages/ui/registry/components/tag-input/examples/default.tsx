"use client";

import * as React from "react";
import { Label } from "@beam/ui/components/label";
import { TagInput } from "@beam/ui/components/tag-input";

export default function TagInputDefault() {
  const [tags, setTags] = React.useState(["Design", "Research"]);
  return (
    <div className="flex w-[360px] flex-col gap-2">
      <Label htmlFor="tags">Tags</Label>
      <TagInput id="tags" label="Tags" value={tags} onValueChange={setTags} placeholder="Add a tag" />
      <p className="text-[12px] leading-[16px] text-text-3">Press Enter or comma to add a tag.</p>
    </div>
  );
}
