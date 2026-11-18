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

export function TabBar({ items, value, defaultValue, onValueChange, className, ...props }: TabBarProps) {
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
      if (jump || reduced) {
        cancelAnimationFrame(frame.current);
        state.current = { x, w, v: 0, stretch: 0 };
        setLens({ ...state.current });
      } else animate();
    },
    [animate, reduced],
  );

  // Rest on the active tab: jump there on first paint and on resize, glide there when the tab changes.
  const first = useRef(true);
  useLayoutEffect(() => {
    const s = slot(items.findIndex((i) => i.value === active));
    if (!s || dragging) return;
    moveTo(s.x, s.w, first.current);
    first.current = false;
  }, [active, items, slot, moveTo, dragging]);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const observer = new ResizeObserver(() => {
      const s = slot(items.findIndex((i) => i.value === active));
      if (s) moveTo(s.x, s.w, true);
    });
    observer.observe(row);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [active, items, slot, moveTo]);

  // Drag: the lens follows the finger, then snaps to the nearest tab.
  const drag = useRef<{ id: number; startX: number; moved: boolean } | null>(null);
  const pointerX = (e: PointerEvent) => e.clientX - (rowRef.current?.getBoundingClientRect().left ?? 0);
  const nearest = (x: number) => {
    let best = 0;
    let bestD = Number.POSITIVE_INFINITY;
    items.forEach((_, i) => {
      const s = slot(i);
      if (!s) return;
      const d = Math.abs(s.x + s.w / 2 - x);
      if (d < bestD) [best, bestD] = [i, d];
    });
    return best;
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, startX: e.clientX, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved && Math.abs(e.clientX - d.startX) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      rowRef.current?.setPointerCapture(e.pointerId);
    }
    const w = target.current.w || state.current.w;
    const max = (rowRef.current?.clientWidth ?? 0) - w;
    moveTo(Math.max(0, Math.min(max, pointerX(e) - w / 2)), w);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    setDragging(false);
    const i = nearest(pointerX(e));
    const s = slot(i);
    if (s) moveTo(s.x, s.w);
    const item = items[i];
    if (item) select(item.value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const i = items.findIndex((x) => x.value === active);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const n = (next + items.length) % items.length;
    const item = items[n];
    if (!item) return;
    select(item.value);
    tabRefs.current[n]?.focus();
  };

  const lensStyle = lens && {
    transform: `translateX(${lens.x}px) scaleX(${1 + lens.stretch}) scaleY(${1 - lens.stretch * 0.35}) scale(${dragging ? 1.12 : 1})`,
    width: lens.w,
  };

  return (
    <nav data-slot="tab-bar" aria-label={props["aria-label"] ?? "Tabs"} className={cn("inline-flex", className)} {...props}>
      <LiquidGlass radius={999} className="p-1 shadow-[0_8px_32px_rgb(0_0_0/0.18)]">
        {/* The tint sits above the bent backdrop, so labels keep their contrast over bright and dark photos. */}
        <span aria-hidden="true" className="absolute inset-0 rounded-[inherit] bg-(--tab-bar-tint)" />
        <div
          ref={rowRef}
          role="tablist"
          aria-orientation="horizontal"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative flex touch-pan-y select-none items-stretch"
        >
          {lensStyle && (
            <LiquidGlass
              aria-hidden="true"
              data-slot="tab-bar-lens"
              radius={999}
              bend={dragging ? 1.6 : 0.8}
              frost={dragging ? 0 : 1}
              className={cn("pointer-events-none absolute inset-y-0 left-0 origin-center transition-[box-shadow] duration-200", dragging ? "z-20" : "z-0")}
              style={{ ...lensStyle, boxShadow: dragging ? "0 8px 24px rgb(0 0 0 / 0.22)" : "none" }}
            >
              {/* Above the lens's own bent backdrop, so the active label keeps its contrast. Lifted, it clears. */}
              <span className={cn("absolute inset-0 rounded-[inherit] transition-colors duration-200", dragging ? "bg-white/10" : "bg-(--tab-bar-lens)")} />
            </LiquidGlass>
          )}
          {items.map((item, i) => {
            const selected = item.value === active;
            const Tag = item.href ? "a" : "button";
            return (
              <Tag
                key={item.value}
                ref={(el: HTMLAnchorElement | HTMLButtonElement | null) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                aria-selected={selected}
                aria-current={selected && item.href ? "page" : undefined}
                tabIndex={selected ? 0 : -1}
                {...(item.href ? { href: item.href } : { type: "button" as const })}
                onClick={() => select(item.value)}
                className={cn(
                  "relative z-10 flex min-w-[68px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 pt-1.5 pb-1 outline-none transition-colors duration-200",
                  "focus-visible:shadow-(--focus-ring)",
                  selected ? "text-(--tab-bar-active)" : "text-(--tab-bar-ink)",
                )}
              >
                <HugeiconsIcon icon={item.icon} size={24} strokeWidth={selected ? 2 : 1.75} aria-hidden="true" />
                <span className="text-[10px] leading-[12px] font-medium">{item.label}</span>
              </Tag>
            );
          })}
        </div>
      </LiquidGlass>
    </nav>
  );
}
