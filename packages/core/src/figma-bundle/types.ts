/**
 * The file the Beam Figma plugin exports (*.beam.json). It is plain data in CSS units, so Beam can read
 * it without the Figma API: no token, no rate limits, any Figma plan.
 */
export type BundleText = {
  characters: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  fontSize: number;
  /** CSS value: "24px" or "normal". */
  lineHeight: string;
  /** CSS value: "-0.32px" or "normal". */
  letterSpacing: string;
  align: "left" | "center" | "right" | "justify";
  textCase: "none" | "uppercase" | "lowercase" | "capitalize";
  color: string;
};

export type BundleLayout = {
  mode: "row" | "column";
  padding: [number, number, number, number];
  gap: number;
  justify: string;
  align: string;
};

export type BundleNode = {
  id: string;
  name: string;
  type: string;
  /** Position relative to the exported frame's top-left corner. */
  box: { x: number; y: number; width: number; height: number };
  opacity: number;
  /** CSS paints, topmost last: "rgb(...)", "linear-gradient(...)" or "image:<hash>". */
  fills: string[];
  stroke?: { color: string; width: number };
  /** CSS border-radius, for example "12px" or "8px 8px 0px 0px". */
  radius?: string;
  /** CSS box-shadow built from drop shadows. */
  shadow?: string;
  layout?: BundleLayout;
  text?: BundleText;
  /** Key in the bundle's svgs map when this node was exported as a vector. */
  svg?: string;
  children: BundleNode[];
};

export type BundleVariable = { collection: string; name: string; mode: string; type: string; value: string };

export type FigmaBundle = {
  schemaVersion: "1.0";
  source: { fileName: string; pageName: string; frameName: string; nodeId: string };
  exportedAt: string;
  frame: BundleNode;
  /** Frame renders as base64 PNG at 1x and 2x. */
  renders: { "1x": string; "2x": string };
  /** Image fills by hash, base64. */
  images: Record<string, string>;
  /** Vector nodes (icons, logos) as SVG markup, keyed by node id. */
  svgs: Record<string, string>;
  variables: BundleVariable[];
};
