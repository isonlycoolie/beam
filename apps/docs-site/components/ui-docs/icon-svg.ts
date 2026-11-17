export type Element = [string, Record<string, string>];
export type IconEntry = [string, Element[]];

/** Same defaults scripts/gen-icon-index.mjs strips out. */
const DEFAULTS: Record<string, string> = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" };

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function toSvg(elements: Element[], size: number): string {
  const children = elements
    .map(([tag, attrs]) => {
      const all = tag === "path" && !attrs.fill ? { ...DEFAULTS, ...attrs } : attrs;
      return `<${tag} ${Object.entries(all).map(([k, v]) => `${kebab(k)}="${v}"`).join(" ")}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">${children}</svg>`;
}
