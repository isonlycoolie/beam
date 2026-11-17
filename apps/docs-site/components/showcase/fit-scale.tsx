"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shows a pixel rebuild at its true size when it fits, and scales the whole thing down when it doesn't, so its
 * proportions never change and nothing wraps or reflows.
 */
export function FitScale({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });
  useEffect(() => {
    const measure = () => {
      if (!box.current || !inner.current) return;
      const scale = Math.min(1, box.current.clientWidth / inner.current.offsetWidth);
      setFit({ scale, height: inner.current.offsetHeight * scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={box} className="w-full" style={{ height: fit.height || undefined }}>
      <div ref={inner} className="mx-auto w-fit origin-top-left" style={{ transform: fit.scale < 1 ? `scale(${fit.scale})` : undefined }}>
        {children}
      </div>
    </div>
  );
}
