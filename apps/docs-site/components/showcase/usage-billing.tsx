import { AiMagicIcon, DashboardSpeed02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/**
 * Usage billing showcase, rebuilt from measured values (Pictures/beam/references/payments/billing-plan.json): a 366px column, 24px padding,
 * 14px gap; two 306px cards with a 6px radius and a 0 16px 32px shadow; 14px inside; 31 bars 3.2px apart.
 * Our code, Geist type, a Hugeicons mark, palette tokens for every colour.
 */
const BARS = [7, 12, 23, 33, 47, 67, 37, 43, 19, 12, 50, 43, 61, 78, 63, 113, 149, 79, 60, 40, 50, 55, 48, 71, 88, 95, 111, 82, 60, 50, 58];

const card = "relative w-[306px] rounded-[6px] bg-card shadow-[0_16px_32px_0_rgba(50,50,93,0.12)]";

export function UsageBilling() {
  return (
    <div className="flex w-[366px] flex-col items-center gap-3.5 p-6 font-[family-name:var(--theme-font-text)]">
      <div className={`${card} flex h-[169px] flex-col gap-3.5 p-3.5`}>
        <div className="flex h-10 gap-2.5">
          <span className="grid size-10 place-items-center rounded-[6px] border border-border text-primary">
            <HugeiconsIcon icon={AiMagicIcon} size={20} strokeWidth={1.75} />
          </span>
          <div className="flex flex-col justify-center">
            <div className="text-[14px] leading-[20px] font-normal text-text-1">Pro Plan</div>
            <div className="text-[12px] leading-[16px] font-light tracking-[0.036px] text-text-2">Billed monthly</div>
          </div>
        </div>
        <div className="flex flex-col gap-[3px]">
          <div className="text-[12px] leading-[16px] font-normal text-text-1">Tokens</div>
          <div className="text-[11px] leading-[16px] font-light text-text-2">
            <span className="tracking-[-0.33px]">$0.01</span> per <span className="tracking-[-0.33px]">1,000</span> units
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={DashboardSpeed02Icon} size={12} strokeWidth={2} className="text-text-1" />
            <span className="block text-[12px] leading-[16px] font-normal text-text-1">Usage meter</span>
          </div>
          <div className="relative h-3.5 rounded-[4px] bg-surface-2">
            <div className="absolute top-0.5 left-0.5 h-2.5 w-[230px] rounded-[3px] bg-linear-to-r from-primary to-chart-2" />
          </div>
        </div>
      </div>
      <div className={`${card} h-[224px]`}>
        <div className="p-3.5">
          <div className="text-[11px] leading-[16px] font-light text-text-2">
            Tokens used in the last <span className="tracking-[-0.33px]">30</span> days
          </div>
          <div className="mt-0.5 text-[12px] leading-[16px] font-normal tracking-[-0.36px] text-text-1">2,010,569,010</div>
        </div>
        {/* 31 bars, bottom-aligned, centred as one 228px group like the reference. */}
        <div className="absolute inset-x-0 top-[61px] flex h-[149px] items-end justify-center gap-[3.2px]">
          {BARS.map((h, i) => (
            <div key={i} className="w-[4.26px] rounded-[1px] bg-chart-1" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  );
}
