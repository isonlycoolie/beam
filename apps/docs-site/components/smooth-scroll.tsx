"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Lenis smooth scrolling for the page, plus a gentle reveal as content scrolls into view.
 * Both switch off for people who ask for reduced motion.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      // lerp follows wheel and touchpad input continuously. A fixed duration restarts its tween on every
      // small touchpad event, which makes the speed lurch and the page feel like it vibrates.
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      // In-page links (the "On this page" list) glide to their heading, clearing the sticky header.
      anchors: { offset: -140, duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) },
      autoRaf: true,
      // The sidebar and search dialog scroll on their own. Code blocks are not excluded: they only
      // scroll sideways, and letting vertical wheel ticks over them go native made the page jump and snap back.
      prevent: (node) => Boolean(node.closest("#nd-sidebar, [role='dialog']")),
    });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // A new page starts at the top, without animating through the old one. Skipped on first load,
  // where it would yank the page back to the top if the visitor started scrolling before hydration.
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname === firstPath.current) return;
    firstPath.current = "";
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  // Reveal headings, paragraphs, code and tables once, as they enter the viewport.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = document.querySelectorAll<HTMLElement>("#nd-page .prose > *");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    targets.forEach((el) => {
      // Content already on screen at load stays put; only what is below the fold animates in.
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add("beam-reveal");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
