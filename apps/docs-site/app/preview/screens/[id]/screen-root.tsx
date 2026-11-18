"use client";

import { useEffect, useState } from "react";
import { SCREENS } from "@/components/screens/screens.gen";
import { GLASS_PHOTO } from "@/components/ui-docs/surface-toggle";

/** Glass follows the docs' Normal · Glass switch, which lives in the parent page's storage (same origin). */
function useGlass() {
  const [glass, setGlass] = useState(false);
  useEffect(() => {
    const sync = () => {
      let on = false;
      try {
        on = localStorage.getItem("beam-surface") === "glass";
      } catch {}
      setGlass(on);
      if (on) document.documentElement.dataset.surface = "glass";
      else delete document.documentElement.dataset.surface;
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return glass;
}

/** The screen on Beam's type and surface; the palette comes from body[data-theme], the mode from the site. */
export function ScreenRoot({ id }: { id: string }) {
  const Screen = SCREENS[id];
  const glass = useGlass();
  if (!Screen) return null;
  return (
    <div
      className="min-h-svh bg-background bg-cover bg-fixed bg-center font-text text-[14px] leading-[20px] text-foreground"
      style={glass ? { backgroundImage: `url(${GLASS_PHOTO})` } : undefined}
    >
      <Screen />
    </div>
  );
}
