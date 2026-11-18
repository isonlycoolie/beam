"use client";

/*
 * Press feel for glass, after glisse (MIT, see CREDITS.md), which measured it from iOS 26: pressed, the glass
 * grows until its longer side is a few pixels bigger and leans toward the pointer; released, it springs back.
 * A mouse press stays subtle (6px); a finger gets iOS's 15px and a bounce past rest. A soft light follows the
 * pointer while pressed (--beam-press-x / --beam-press-y, and data-pressed for CSS).
 */
import { type RefObject, useEffect } from "react";

type Feel = { grow: number; press: readonly [number, number]; release: readonly [number, number] };
const POINTER: Feel = { grow: 6, press: [417.6, 29.2], release: [230, 23.7] };
const TOUCH: Feel = { grow: 15, press: [515, 27.3], release: [250, 11.8] };

/** A damped spring (mass 1) that paints every frame until it settles. */
function spring(initial: number, onChange: (value: number) => void) {
  let value = initial;
  let velocity = 0;
  let target = initial;
  let stiffness = 230;
  let damping = 23.7;
  let frame = 0;
  let last = 0;
  const step = (now: number) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    velocity += (-(value - target) * stiffness - velocity * damping) * dt;
    value += velocity * dt;
    if (Math.abs(value - target) < 0.0005 && Math.abs(velocity) < 0.0005) {
      value = target;
      velocity = 0;
      onChange(value);
      frame = 0;
      return;
    }
    onChange(value);
    frame = requestAnimationFrame(step);
  };
  return {
    set(next: number, [k, d]: readonly [number, number]) {
      target = next;
      stiffness = k;
      damping = d;
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/** Gives an element the glass press. `enabled` false leaves it untouched (Normal mode). */
export function usePress(ref: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const v = [1, 1, 0, 0];
    const paint = () => {
      el.style.scale = `${v[0]} ${v[1]}`;
      el.style.translate = `${v[2]}px ${v[3]}px`;
    };
    const springs = v.map((initial, i) =>
      spring(initial, (next) => {
        v[i] = next;
        paint();
      }),
    );
    let down: { id: number; x: number; y: number; box: DOMRect; feel: Feel } | null = null;
    const to = (next: number[], tune: readonly [number, number]) => springs.forEach((s, i) => s.set(next[i] ?? 0, tune));

    const move = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      const { box, feel } = down;
      el.style.setProperty("--beam-press-x", `${((e.clientX - box.left) / box.width) * 100}%`);
      el.style.setProperty("--beam-press-y", `${((e.clientY - box.top) / box.height) * 100}%`);
      const grow = 1 + feel.grow / Math.max(box.width, box.height);
      // Lean a little toward the pointer, as the glass is pulled.
      const dx = Math.max(-1, Math.min(1, (e.clientX - down.x) / box.width)) * 3;
      const dy = Math.max(-1, Math.min(1, (e.clientY - down.y) / box.height)) * 3;
      to([grow, grow, dx, dy], feel.press);
    };
    const press = (e: PointerEvent) => {
      if (e.button > 0) return;
      down = { id: e.pointerId, x: e.clientX, y: e.clientY, box: el.getBoundingClientRect(), feel: e.pointerType === "mouse" ? POINTER : TOUCH };
      el.dataset.pressed = "";
      move(e);
    };
    const release = (e: PointerEvent) => {
      if (!down || e.pointerId !== down.id) return;
      const { feel } = down;
      down = null;