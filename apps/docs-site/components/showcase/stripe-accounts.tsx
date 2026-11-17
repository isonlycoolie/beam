/**
 * Design reference: Stripe (stripe.com, "Connected Accounts" dashboard illustration), captured 2026-11-18.
 * Rebuilt from measured values (Pictures/beam/references/stripe/connected-accounts.json): a 536px panel,
 * 24px sides, columns 127.812 / 116.312 / 153.391 / 89.469px, 31px rows with a 1px top rule.
 * Our code, Geist in place of Söhne, palette tokens in place of Stripe's colours, plain marks in place of its art.
 */
const COLUMNS = "127.812px 116.312px 153.391px 89.4688px";

const ROWS: Array<[name: string, country: string, balance: string, volume: string]> = [
  ["Vital Flow", "Canada", "$8,348.00", "$71,562.98"],
  ["Daybreak Yoga", "United States", "$1,502.00", "$7,905.35"],
  ["Sacred Space", "UK", "$1,247.00", "$24,569.09"],
  ["Jackson Hot Yoga", "Australia", "$3,660.00", "$12,643.30"],
  ["Harmony Flow", "United States", "$30,930.00", "$294,669.65"],
  ["Balance at Brunch", "Canada", "$335.00", "$3,650.36"],
  ["Breathline Studio", "United States", "$2,245.00", "$8,608.00"],
  ["Quiet Fire Yoga", "UK", "$388.00", "$1,568.87"],
  ["Zenith Zen", "Australia", "$660.00", "$1,643.30"],
  ["M.E. Yoga", "Canada", "$4,424.00", "$6,709.60"],
];

// The reference colours each account's mark differently; the palette's chart colours do the same job.
const MARK = ["var(--chart-3)", "var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-2)", "var(--chart-1)", "var(--chart-5)", "var(--chart-3)", "var(--chart-4)", "var(--chart-2)"];

const HIGHLIGHT = 1;
// Measured mark heights: four of the reference's marks are 17px tall, which makes their rows 32px instead of 31px.
const MARK_HEIGHT = [16, 16, 17, 17, 16, 17, 16, 16, 17, 16];

export function StripeAccounts() {
  return (
    <div className="w-[536px] border-l border-border bg-card pb-[21px] font-[family-name:var(--theme-font-text)]" style={{ fontSize: 16 }}>
      <div className="px-6 pt-6 pb-[18px] text-[14px] leading-[23.38px] font-normal text-text-1">Connected Accounts</div>
      <div className="grid px-6 pb-2 text-[9px] leading-[14.4px] text-text-1" style={{ gridTemplateColumns: COLUMNS }}>
        <div>Accounts</div>
        <div>Account country</div>
        <div>Payment balance (USD)</div>
        <div>Volume (USD)</div>
      </div>
      {ROWS.map(([name, country, balance, volume], i) => {
        const on = i === HIGHLIGHT;
        const value = on ? "font-normal text-text-1" : "font-light text-text-2";
        return (
          <div key={name} className="relative border-t border-border">
            {on && <div className="absolute inset-0 bg-surface-2 shadow-[0_2px_5px_0_rgba(0,0,0,0.1)]" />}
            <div className="relative grid px-6 pt-1.5 pb-2 text-[10px] leading-[14.5px]" style={{ gridTemplateColumns: COLUMNS }}>
              <div className="flex items-center gap-1.5 font-normal text-text-1">
                {/* Decorative: the account's name follows. */}
                <span aria-hidden className="w-4 shrink-0 rounded-full" style={{ background: MARK[i], height: MARK_HEIGHT[i] }} />
                {name}
              </div>
              <div className="self-center font-light text-text-2">{country}</div>
              <div className={`self-center tracking-[-0.3px] ${value}`}>{balance}</div>
              <div className={`self-center tracking-[-0.3px] ${value}`}>{volume}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
