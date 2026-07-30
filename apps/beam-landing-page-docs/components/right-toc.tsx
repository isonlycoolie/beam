"use client";

import { useEffect, useState } from "react";

type RightTocProps = {
  items: { href: string; title: string }[];
};

export function RightToc({ items }: RightTocProps) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const contentRoot = document.querySelector(".content");
    const sections = items
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const activeEntry = visibleEntries[0];

        if (activeEntry?.target.id) {
          setActiveHref(`#${activeEntry.target.id}`);
        }
      },
      {
        root: contentRoot,
        rootMargin: "-12% 0px -62% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="rightToc">
      <div className="tocTitle">On this page</div>
      {items.map((item) => (
        <a
          className={activeHref === item.href ? "active" : undefined}
          href={item.href}
          key={item.href}
        >
          {item.title}
        </a>
      ))}
    </aside>
  );
}
