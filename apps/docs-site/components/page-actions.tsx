"use client";

import { Check, ChevronDown, Copy, ExternalLink, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

/** Copy Markdown, Open in ChatGPT, Open in Claude, More: the action list above "On this page". */
export function PageActions({ markdownUrl, pageUrl }: { markdownUrl: string; pageUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [more, setMore] = useState(false);
  const prompt = encodeURIComponent(`Read ${pageUrl} so you can answer questions about it.`);
  const row = "flex h-8 w-full items-center gap-2.5 rounded-lg text-sm text-[#a5a5a6] transition-colors hover:text-[#f5f5f4]";
  const copy = async () => {
    const text = await fetch(markdownUrl).then((r) => r.text());
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="mb-4 flex flex-col border-b border-[#2a2a2a] pb-4">
      <button type="button" onClick={copy} className={row}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy Markdown"}
      </button>
      <a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noreferrer" className={row}>
        <Sparkles className="size-4" /> Open in ChatGPT
      </a>
      <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noreferrer" className={row}>
        <Sparkles className="size-4" /> Open in Claude
      </a>
      <button type="button" onClick={() => setMore((v) => !v)} className={row} aria-expanded={more}>
        <ChevronDown className={`size-4 transition-transform ${more ? "rotate-180" : ""}`} /> More
      </button>
      {more && (
        <div className="ms-6 flex flex-col">
          <a href={markdownUrl} className={row}>
            <FileText className="size-4" /> View as Markdown
          </a>
          <a href="https://github.com/isonlycoolie/beam" className={row}>
            <ExternalLink className="size-4" /> Edit on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
