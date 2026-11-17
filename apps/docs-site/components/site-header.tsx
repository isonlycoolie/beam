"use client";

import { useNotebookLayout } from "fumadocs-ui/layouts/notebook";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Menu, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SectionTabs } from "./section-tabs";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

/**
 * Floating header: logo and "/ docs", a centred "Search or ask AI" pill, then GitHub,
 * feedback and a white "Get started" pill. Measured from the reference at 1920px.
 */
export function SiteHeader(props: ComponentProps<"header">) {
  const { slots } = useNotebookLayout();
  const { setOpenSearch } = useSearchContext();
  const SidebarTrigger = slots.sidebar?.trigger;
  return (
    <header
      id="nd-subnav"
      {...props}
      className="sticky top-(--fd-docs-row-1) z-20 [grid-area:header] bg-[#0f0f0f]/95 layout:[--fd-header-height:75px]"
    >
      <div className="mx-auto flex h-[74px] max-w-[1552px] items-center gap-4 px-4 md:px-6">
        <Link href="/docs" className="flex shrink-0 items-center gap-2.5">
          <img src="/brand/mark.svg" alt="" className="size-8" />
          <img src="/brand/wordmark-white.svg" alt="beam" className="h-[24px] w-auto" />
          <span className="text-lg font-light text-[#a5a5a6]">/</span>
          <span className="font-mono text-lg font-medium text-white">docs</span>
        </Link>
        <SectionTabs className="ms-6 self-stretch max-md:hidden" />
        <div className="flex flex-1 justify-end max-md:hidden">
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="flex h-9 w-[300px] items-center gap-2.5 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] ps-4 pe-1.5 text-sm text-[#a5a5a6] transition-colors hover:border-[#3a3a3a]"
          >
            <Search className="size-4" />
            <span className="flex-1 text-start">Search or ask AI...</span>
            <kbd className="rounded-full bg-white/[0.08] px-2.5 py-0.5 font-sans text-xs font-medium text-[#d4d4d4]">Ctrl K</kbd>
          </button>
        </div>
        <div className="ms-auto flex items-center gap-1">
          <a href="https://github.com/isonlycoolie/beam" aria-label="GitHub" className="grid size-9 place-items-center rounded-full text-[#d4d4d4] hover:text-white max-sm:hidden">
            <GitHubIcon />
          </a>
          <a href="https://github.com/isonlycoolie/beam/discussions" aria-label="Community" className="grid size-9 place-items-center rounded-full text-[#d4d4d4] hover:text-white max-sm:hidden">
            <MessageSquare className="size-[18px]" />
          </a>
          <Link href="/docs/getting-started" className="ms-2 inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full bg-[#fafafa] px-4 text-sm font-medium text-[#0f0f0f] hover:bg-white">
            Get started
          </Link>
          {SidebarTrigger && (
            <SidebarTrigger className="ms-1 grid size-9 place-items-center rounded-full text-[#d4d4d4] md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </SidebarTrigger>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-[1552px] border-b border-[#2a2a2a]" />
      {/* Phones: the sections scroll in a row under the header. */}
      <div className="overflow-x-auto border-b border-[#2a2a2a] px-4 md:hidden">
        <SectionTabs className="h-11" />
      </div>
    </header>
  );
}
