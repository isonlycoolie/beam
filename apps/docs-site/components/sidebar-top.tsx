"use client";

import { Check, ChevronDown, ChevronLeft, Copy, Frame, Layers, Paintbrush, ScanEye, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";

type Tool = { slug: string; name: string; icon: ComponentType<{ className?: string }> };

/** Each tool is its own section of the docs, the way the reference splits products. */
export const TOOLS: Tool[] = [
  { slug: "clone", name: "Clone", icon: Copy },
  { slug: "figma", name: "Figma", icon: Frame },
  { slug: "craft", name: "Craft", icon: Paintbrush },
  { slug: "glass", name: "Glass", icon: Layers },
  { slug: "verify", name: "Verify", icon: ScanEye },
];

function currentTool(pathname: string): Tool | undefined {
  const slug = pathname.split("/")[2];
  return TOOLS.find((tool) => tool.slug === slug);
}

/** "All docs" back link, the section title, and a tool picker in place of the reference's version select. */
export function SidebarTop() {
  const pathname = usePathname();
  const tool = currentTool(pathname);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => !box.current?.contains(event.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const Icon = tool?.icon ?? Sparkles;
  return (
    <div className="flex flex-col gap-2 pb-2">
      <Link href="/docs" className="flex h-9 items-center gap-2 rounded-[10px] px-2 text-sm font-medium text-[#f5f5f4]/90 hover:bg-white/[0.06]">
        <ChevronLeft className="size-4" /> All docs
      </Link>
      <div className="flex h-9 items-center gap-2 px-2 text-sm font-medium text-[#f5f5f4]">
        <Icon className="size-4" /> {tool?.name ?? "Getting started"}
      </div>
      <div ref={box} className="relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#2a2a2a] px-2.5 text-sm hover:bg-white/[0.04]"
          aria-expanded={open}
        >
          <span className="text-[#a5a5a6]">Tool</span>
          <span className="flex items-center gap-1.5 font-medium text-[#f5f5f4]">
            {tool?.name ?? "Choose"} <ChevronDown className="size-3.5" />
          </span>
        </button>
        {open && (
          <div className="absolute inset-x-0 top-11 z-30 rounded-xl border border-[#2a2a2a] bg-[#141414] p-1 shadow-2xl">
            {TOOLS.map((item) => (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                onClick={() => setOpen(false)}
                className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-[#f5f5f4] hover:bg-white/[0.08]"
              >
                <item.icon className="size-4 text-[#a5a5a6]" />
                <span className="flex-1">{item.name}</span>
                {item.slug === tool?.slug && <Check className="size-4" />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SidebarStatus() {
  return (
    <a href="https://github.com/isonlycoolie/beam/actions" className="flex items-center gap-2 px-2 py-2 text-xs text-[#a5a5a6] hover:text-[#f5f5f4]">
      <span className="size-2 rounded-full bg-[#00bbcb]" /> All systems operational
    </a>
  );
}
