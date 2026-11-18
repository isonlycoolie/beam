"use client";

/*
 * Tab Bar: the floating bottom navigation of iOS, in Liquid Glass. A glass lens sits behind the active tab; when
 * the tab changes it travels there on a spring, stretching along its path and settling round. Press and drag
 * along the bar and the lens lifts, follows your finger and magnifies what it passes over; let go and it snaps to
 * the nearest tab. Arrow keys, Home and End move between tabs.
 */
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { type ComponentProps, type KeyboardEvent, type PointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../../lib/cn";
import { LiquidGlass } from "../liquid-glass/liquid-glass";

export type TabBarItem = { value: string; label: string; icon: IconSvgElement; href?: string };

export type TabBarProps = Omit<ComponentProps<"nav">, "onChange"> & {
  items: TabBarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Over light content: a darker rim and shadow so the bar's edge still reads. */
  overLight?: boolean;
};

// The spring the lens rides on: stiff enough to arrive quickly, damped just under critical for one soft overshoot.
const STIFFNESS = 520;
const DAMPING = 38;

type Lens = { x: number; w: number; v: number; stretch: number };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = () => setReduced(q.matches);
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function TabBar({ items, value, defaultValue, onValueChange, overLight = false, className, ...props }: TabBarProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const active = value ?? inner;
  const reduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const [lens, setLens] = useState<Lens | null>(null);
  const [dragging, setDragging] = useState(false);
  const target = useRef({ x: 0, w: 0 });
  const state = useRef<Lens>({ x: 0, w: 0, v: 0, stretch: 0 });
  const frame = useRef(0);

  const select = useCallback(
    (next: string) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [onValueChange, value],
  );

  /** Where the lens rests for a tab: the tab's box inside the row. */
  const slot = useCallback((index: number) => {
    const tab = tabRefs.current[index];
    return tab ? { x: tab.offsetLeft, w: tab.offsetWidth } : null;
  }, []);

  const animate = useCallback(() => {
    cancelAnimationFrame(frame.current);
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const s = state.current;
      const t = target.current;
      const force = (t.x - s.x) * STIFFNESS - s.v * DAMPING;
      s.v += force * dt;
      s.x += s.v * dt;
      s.w += (t.w - s.w) * Math.min(1, dt * 18);
      // Faster travel, longer lens: iOS's liquid stretch.
      s.stretch = Math.min(0.4, Math.abs(s.v) / 2400);
      setLens({ ...s });
      if (Math.abs(t.x - s.x) > 0.3 || Math.abs(s.v) > 4) frame.current = requestAnimationFrame(step);
      else {
        state.current = { x: t.x, w: t.w, v: 0, stretch: 0 };
        setLens({ ...state.current });
      }
    };
    frame.current = requestAnimationFrame(step);
  }, []);

  const moveTo = useCallback(
    (x: number, w: number, jump = false) => {
      target.current = { x, w };