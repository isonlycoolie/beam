"use client";

import { Compass01Icon, Home01Icon, LibraryIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { TabBar } from "@beam/ui/components/tab-bar";
import { useState } from "react";

const PHOTOS = ["photo-1506905925346-21bda4d32df4", "photo-1469474968028-56623f02e42e", "photo-1501785888041-af3ef285b470", "photo-1470071459604-3b5ec3a7fe05", "photo-1500530855697-b586d89ba3ee", "photo-1519681393784-d120267933ba"];

const TABS = [
  { value: "home", label: "Home", icon: Home01Icon },
  { value: "explore", label: "Explore", icon: Compass01Icon },
  { value: "library", label: "Library", icon: LibraryIcon },
  { value: "search", label: "Search", icon: Search01Icon },
];

/** A phone screen: photos scroll under the bar, so the glass has something to bend. */
export default function TabBarDefault() {
  const [tab, setTab] = useState("home");
  return (
    <div className="relative h-[560px] w-[320px] overflow-hidden rounded-[32px] border border-border bg-background">
      <div className="h-full overflow-y-auto pb-28">
        <p className="px-5 pt-5 pb-3 text-[22px] leading-[28px] font-semibold text-text-1 capitalize">{tab}</p>
        <div className="grid gap-2 px-3">
          {PHOTOS.map((id) => (
            <img key={id} src={`https://images.unsplash.com/${id}?w=600&q=55&auto=format&fit=crop`} alt="" width={600} height={380} loading="lazy" className="h-[190px] w-full rounded-[18px] object-cover" />
          ))}
        </div>
      </div>
      <TabBar items={TABS} value={tab} onValueChange={setTab} aria-label="Sections" className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </div>
  );
}
