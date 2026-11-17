"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The docs' top-level sections. Each one has its own sidebar; Blocks joins when its first blocks ship. */
export const SECTIONS = [
  { href: "/docs", name: "Docs" },
  { href: "/docs/components", name: "Components" },
  { href: "/docs/palettes", name: "Palettes" },
  { href: "/docs/icons", name: "Icons" },
] as const;

function active(pathname: string): string {
  return SECTIONS.slice(1).find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`))?.href ?? "/docs";
}

/** Section links with a 2px underline on the active one, sitting on the header's bottom edge. */
export function SectionTabs({ className = "" }: { className?: string }) {
  const current = active(usePathname());
  return (
    <nav aria-label="Docs sections" className={`flex items-stretch gap-6 ${className}`}>
      {SECTIONS.map((s) => {
        const on = s.href === current;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={on ? "page" : undefined}
            className={`relative flex items-center whitespace-nowrap text-[15px] font-medium transition-colors ${
              on ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-white" : "text-[#a5a5a6] hover:text-white"
            }`}
          >
            {s.name}
          </Link>
        );
      })}
    </nav>
  );
}
