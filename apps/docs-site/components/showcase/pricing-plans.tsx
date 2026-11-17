import { ArrowDown01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TIERS, type Tier } from "./neon-pricing-data";

/**
 * Design reference: Neon (neon.com/pricing, plan columns), captured 2026-11-18.
 * Rebuilt from measured values (Pictures/beam/references/neon/pricing-tiers.json): three 320px columns with
 * 1px rules, 24px padding, Geist Mono 14px plan labels, 28px prices at -1.12px, 38px pill buttons, 15px feature
 * rows 12px apart under 12px mono section labels. Our code; palette tokens in place of Neon's colours.
 */
const mono = "font-[family-name:var(--theme-font-mono)] font-medium uppercase";
const body = "text-[15px] leading-[20.625px] tracking-[-0.3px]";

function Info() {
  return <HugeiconsIcon icon={InformationCircleIcon} size={14} strokeWidth={1.75} className="ms-1.5 inline-block shrink-0 align-[-2px] text-text-3" />;
}

function Features({ label, items, featured, divided }: { label: string; items: Tier["postgres"]; featured?: boolean; divided?: boolean }) {
  return (
    <div className={`flex flex-col gap-3.5 px-6 py-4 ${divided ? "border-b border-dashed border-border" : ""}`}>
      <p className={`${mono} text-[12px] leading-[12px] tracking-[-0.24px] text-text-3`}>{label}</p>
      <ul className="flex flex-col gap-3">
        {items.map(([text, info]) => (
          <li key={text} className="flex gap-2">
            {/* A 14px box with a 3px inset: the 8px square bullet the reference draws. */}
            <span className={`mt-[3px] size-3.5 shrink-0 border-[3px] border-background ${featured ? "bg-primary" : "bg-text-1/90"}`} />
            <p className={`${body} ${featured ? "text-text-1" : "text-text-1/80"}`}>
              <span>{text}</span>
              {info && <Info />}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NeonPricing() {
  return (
    <ul className="grid w-[960px] grid-cols-3 border-y border-input bg-background font-[family-name:var(--theme-font-text)] text-text-1">
      {TIERS.map((t, i) => (
        <li key={t.name} className={`flex flex-col border-l border-input ${i === TIERS.length - 1 ? "border-r" : ""}`}>
          <div className="px-6 pt-6 pb-2">
            <h3 className={`${mono} text-[14px] leading-[14px] ${t.featured ? "text-link" : "text-text-2"}`}>{t.name}</h3>
            <div className="mt-14 flex flex-col gap-4">
              <h4 className="text-[28px] leading-[28px] font-normal tracking-[-1.12px]">{t.price}</h4>
              {t.note && (
                <div className="flex flex-col gap-1.5 pt-3 pb-px">
                  <p className="text-[15px] leading-[25.5px] tracking-[-0.3px] text-text-2">{t.note}</p>
                </div>
              )}
              {t.spend && (
                <div className="flex flex-col gap-1.5">
                  {/* Inline spans in a 22px line box, as measured: the price sits on the text baseline. */}
                  <div className="flex h-7 items-center gap-1.5">
                    <div className="leading-[22px]">
                      <span className={`${body} text-text-2`}>Typical spend:</span>{" "}
                      <span className="text-[20px] leading-[28px] tracking-[-0.4px]">{t.spend[0]}</span>{" "}
                      <span className={`${body} text-text-1/80`}>/mo</span>
                    </div>
                    <span className="flex">
                      <HugeiconsIcon icon={InformationCircleIcon} size={14} strokeWidth={1.75} className="text-text-3" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`${body} block text-text-2`}>Based on:</span>
                    <span className={`flex h-[31px] flex-1 items-center justify-between border border-input bg-card py-1 ps-2.5 pe-1 ${body} text-text-1/80`}>
                      <span className="block">{t.spend[1]}</span>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={1.75} className="text-text-1" />
                    </span>
                  </div>
                </div>
              )}
            </div>
            <span
              className={`mt-5 flex h-[38px] items-center justify-center rounded-full px-7 text-[14px] leading-[14px] tracking-[-0.28px] ${
                t.featured ? "bg-primary text-primary-foreground" : "border border-input text-text-1"
              }`}
            >
              {t.action}
            </span>
          </div>
          <div className="flex flex-col pb-1">
            <Features label="Lakebase Postgres" items={t.postgres} featured={t.featured} divided />
            <Features label="Backend" items={t.backend} featured={t.featured} />
          </div>
        </li>
      ))}
    </ul>
  );
}
