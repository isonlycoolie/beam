"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@beam/ui/components/badge";
import { Button } from "@beam/ui/components/button";
import { Input } from "@beam/ui/components/input";
import { StatCard } from "@beam/ui/components/stat-card";
import type { Entry } from "./palette-grid";

const TOKENS = ["background", "card", "secondary", "border", "text-1", "text-2", "text-3", "primary", "primary-foreground", "ring", "success", "warning", "danger", "chart-1", "chart-2"];

export function PaletteDetail({ palette: p, copied, copy }: { palette: Entry; copied: string | null; copy: (key: string, text: string) => void }) {
  return (
    <section className="mt-12 rounded-xl border border-fd-border">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-fd-border p-6">
        <div>
          <h3 className="text-xl font-semibold text-fd-foreground">{p.name}</h3>
          <p className="mt-1 text-sm text-fd-muted-foreground">{p.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded-lg border border-fd-border px-3 py-1.5 font-mono text-[13px] text-fd-foreground">npx usebeam add ui/palette-{p.id}</code>
          <button
            type="button"
            onClick={() => copy(`${p.id}-detail-css`, p.css)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-fd-primary px-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90"
          >
            <HugeiconsIcon icon={copied === `${p.id}-detail-css` ? Tick02Icon : Copy01Icon} size={15} strokeWidth={1.75} />
            {copied === `${p.id}-detail-css` ? "Copied" : "Copy CSS"}
          </button>
        </div>
      </header>

      {/* The palette on real components, following the site's light or dark mode. */}
      <div data-theme={p.id} className="flex flex-col gap-5 bg-background p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Revenue" value="TZS 48.2m" delta={12.4} period="last month" />
          <StatCard label="Open invoices" value="128" delta={-3.1} invertDelta period="last month" />
          <StatCard label="Paid on time" value="94" unit="%" delta={1.8} period="last month" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input className="max-w-60" placeholder="Search invoices" aria-label="Search invoices" />
          <Button>Create invoice</Button>
          <Button variant="outline">Export</Button>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="success">Paid</Badge>
          <Badge variant="danger">Overdue</Badge>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-fd-border">
        <table className="w-full text-left text-sm">
          <thead className="text-fd-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium">Token</th>
              <th className="px-6 py-3 font-medium">Light</th>
              <th className="px-6 py-3 font-medium">Dark</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((token) => (
              <tr key={token} className="border-t border-fd-border">
                <td className="px-6 py-2.5 font-mono text-[13px] text-fd-foreground">--{token}</td>
                {(["light", "dark"] as const).map((mode) => (
                  <td key={mode} className="px-6 py-2.5">
                    <button
                      type="button"
                      onClick={() => copy(`${p.id}-${mode}-${token}`, p[mode][token]!)}
                      className="inline-flex items-center gap-2.5 font-mono text-[13px] text-fd-muted-foreground hover:text-fd-foreground"
                    >
                      <span className="size-5 rounded-md ring-1 ring-fd-border ring-inset" style={{ background: p[mode][token] }} />
                      {copied === `${p.id}-${mode}-${token}` ? "Copied" : p[mode][token]}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
