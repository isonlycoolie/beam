"use client";

import { SCREENS } from "@/components/screens/screens.gen";

/** The screen on Beam's type and surface; the palette comes from body[data-theme], the mode from the site. */
export function ScreenRoot({ id }: { id: string }) {
  const Screen = SCREENS[id];
  if (!Screen) return null;
  return (
    <div className="min-h-svh bg-background font-text text-[14px] leading-[20px] text-foreground">
      <Screen />
    </div>
  );
}
