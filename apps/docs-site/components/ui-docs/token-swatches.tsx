import type { ReactNode } from "react";

const COLOURS = [
  ["background", "Page"], ["surface-2", "Raised"], ["card", "Card"], ["border", "Border"],
  ["primary", "Primary"], ["secondary", "Secondary"], ["success", "Success"], ["warning", "Warning"], ["danger", "Danger"],
  ["chart-1", "Chart 1"], ["chart-2", "Chart 2"], ["chart-3", "Chart 3"],
] as const;
const TEXT = [["text-1", "Primary text"], ["text-2", "Secondary text"], ["text-3", "Tertiary text"]] as const;
const TYPE = [["text-display", "Display"], ["text-h1", "Heading 1"], ["text-h2", "Heading 2"], ["text-h3", "Heading 3"], ["text-body", "Body text"], ["text-small", "Small text"], ["text-caption", "Caption"]] as const;

/** A quiet bordered panel in the page's colour, following the site's mode, with the default palette's tokens. */
function Panel({ children }: { children: ReactNode }) {
  return (
    <div data-theme="default" className="not-prose my-6 rounded-xl border border-fd-border p-6 sm:p-8">
      {children}
    </div>
  );
}

/** Live colour tokens of the default palette (Graphite). Other palettes fill the same names. */
export function ColorSwatches() {
  return (
    <Panel>
      <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {COLOURS.map(([token, label]) => (
          <div key={token} className="flex flex-col gap-1.5">
            <div className="h-14 rounded-(--radius-md) ring-1 ring-inset ring-border" style={{ background: `var(--${token})` }} />
            <span className="text-caption text-text-1">{label}</span>
            <code className="text-caption text-text-3">--{token}</code>
          </div>
        ))}
        {TEXT.map(([token, label]) => (
          <div key={token} className="flex flex-col gap-1.5">
            <div className="grid h-14 place-items-center rounded-(--radius-md) bg-surface-2 text-h2" style={{ color: `var(--${token})` }}>
              Aa
            </div>
            <span className="text-caption text-text-1">{label}</span>
            <code className="text-caption text-text-3">--{token}</code>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/** The type scale, every step that text is allowed to use. */
export function TypeScale() {
  return (
    <Panel>
      <div className="flex w-full flex-col divide-y divide-border">
        {TYPE.map(([cls, label]) => (
          <div key={cls} className="flex items-baseline justify-between gap-6 py-3">
            <span className={`${cls} truncate text-text-1`}>{label}</span>
            <code className="shrink-0 text-caption text-text-3">{cls}</code>
          </div>
        ))}
      </div>
    </Panel>
  );
}
