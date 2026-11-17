import { Banner } from "fumadocs-ui/components/banner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** Striped announcement bar with a gradient underline, 52px tall like the reference. */
export function Announcement() {
  return (
    <Banner id="beam-v02" height="52px" className="beam-banner">
      <p className="text-sm text-[#a5a5a6]">
        <strong className="font-semibold text-[#fafafa]">Beam 0.2 is here.</strong> Five design tools for coding agents: Clone, Figma,
        Craft, Glass and Verify.
      </p>
      <Link
        href="/docs"
        className="ms-3 inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-[#fafafa]/80 px-2 py-1 text-xs font-medium text-[#fafafa] transition-colors hover:bg-white/10"
      >
        Read the docs <ArrowRight className="size-3.5" />
      </Link>
    </Banner>
  );
}
