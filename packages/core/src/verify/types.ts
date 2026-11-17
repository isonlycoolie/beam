/** One visible element as the browser rendered it. Values are exactly what getComputedStyle returned. */
export type CapturedElement = {
  /** Stable path like body>main>section:2>h1:1, used to pair elements across two pages. */
  path: string;
  tag: string;
  text: string;
  box: { x: number; y: number; width: number; height: number };
  style: Record<StyleKey, string>;
};

export const STYLE_KEYS = [
  "color",
  "backgroundColor",
  "backgroundImage",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textTransform",
  "textAlign",
  "borderRadius",
  "borderTopWidth",
  "borderTopColor",
  "boxShadow",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "gap",
  "opacity",
] as const;

export type StyleKey = (typeof STYLE_KEYS)[number];

/** A top-level block of the page (header, hero, footer...) used to score the page part by part. */
export type CapturedSection = { index: number; label: string; top: number; height: number };

export type PageCapture = {
  url: string;
  width: number;
  height: number;
  png: Buffer;
  elements: CapturedElement[];
  sections: CapturedSection[];
};
