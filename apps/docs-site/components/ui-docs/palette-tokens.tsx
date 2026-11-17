"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

type Adjustment = { mode: "light" | "dark"; token: string; official: string; used: string };

const TOKENS = ["background", "card", "secondary", "accent", "border", "input", "text-1", "text-2", "text-3", "primary", "primary-foreground", "link", "ring", "success", "warning", "danger", "chart-1", "chart-2", "chart-3"];

/** Every token in light and dark, click a value to copy it; values moved for contrast show the official one too. */
export function PaletteTokens({ light, dark, adjustments, css }: { light: Record<string, string>; dark: Record<string, string>; adjustments: Adjustment[]; css: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
  };
  const official = (mode: "light" | "dark", token: string) => adjustments.find((a) => a.mode === mode && a.token === token)?.official;
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border">
      <div className="flex items-center justify-between gap-4 border-b border-fd-border px-5 py-3">
        <span className="text-sm text-fd-muted-foreground">Values marked with the official colour were darkened or lightened to reach 4.5:1.</span>
        <button
          type="button"
          onClick={() => copy("css", css)}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-fd-border px-3 text-sm font-medium text-fd-foreground hover:bg-fd-accent"
        >
          <HugeiconsIcon icon={copied === "css" ? Tick02Icon : Copy01Icon} size={15} strokeWidth={1.75} />
          {copied === "css" ? "Copied" : "Copy CSS"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-fd-muted-foreground">
            <tr>
              <th className="px-5 py-2.5 font-medium">Token</th>
              <th className="px-5 py-2.5 font-medium">Light</th>
              <th className="px-5 py-2.5 font-medium">Dark</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((token) => (
              <tr key={token} className="border-t border-fd-border">
                <td className="px-5 py-2 font-mono text-[13px] text-fd-foreground">--{token}</td>
                {(["light", "dark"] as const).map((mode) => {
                  const value = (mode === "light" ? light : dark)[token]!;
                  const was = official(mode, token);
                  return (
                    <td key={mode} className="px-5 py-2">
                      <button type="button" onClick={() => copy(`${mode}-${token}`, value)} className="inline-flex min-h-6 items-center gap-2.5 font-mono text-[13px] text-fd-muted-foreground hover:text-fd-foreground">
                        <span className="size-5 rounded-md ring-1 ring-fd-border ring-inset" style={{ background: value }} />
                        {copied === `${mode}-${token}` ? "Copied" : value}
                        {was && <span className="text-xs text-fd-muted-foreground/80">official {was}</span>}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
