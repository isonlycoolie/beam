"use client";

import { useEffect, useRef, useState } from "react";

/** A screen drawn at 1440x900 and scaled to the card, so the overview shows the real page, not a picture of it. */
export function ScreenThumb({ id }: { id: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    if (!box.current) return;
    const measure = () => box.current && setScale(box.current.clientWidth / 1440);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={box} className="relative aspect-[16/10] w-full overflow-hidden bg-fd-background">
      {scale > 0 && (
        <iframe
          title={`${id} thumbnail`}
          src={`/preview/screens/${id}`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 origin-top-left border-0"
          style={{ width: 1440, height: 900, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
