// The twelve palettes: a neutral tint, one primary (light and dark) and one accent, all in OKLCH.
import type { Lch } from "./colour.ts";

export type PaletteSource = {
  id: string;
  name: string;
  description: string;
  /** Hue and chroma of the greys. Chroma 0 is pure grey. */
  hue: number;
  tint: number;
  primary: { light: Lch; dark: Lch };
  accent: Lch;
};

export const PALETTES: PaletteSource[] = [
  { id: "default", name: "Graphite", description: "Pure greys with a black primary. The Beam UI default.", hue: 270, tint: 0, primary: { light: [0.21, 0, 0], dark: [0.96, 0, 0] }, accent: [0.56, 0, 0] },
  { id: "slate", name: "Slate", description: "Cool blue greys for dashboards and admin tools.", hue: 255, tint: 0.012, primary: { light: [0.34, 0.04, 255], dark: [0.86, 0.03, 255] }, accent: [0.6, 0.06, 240] },
  { id: "stone", name: "Stone", description: "Warm greys, quiet and editorial.", hue: 60, tint: 0.008, primary: { light: [0.3, 0.015, 60], dark: [0.92, 0.01, 60] }, accent: [0.62, 0.04, 60] },
  { id: "navy", name: "Navy", description: "Deep navy for finance and banking.", hue: 260, tint: 0.01, primary: { light: [0.36, 0.12, 262], dark: [0.74, 0.11, 258] }, accent: [0.62, 0.08, 230] },
  { id: "ink", name: "Ink", description: "Indigo ink for developer tools.", hue: 275, tint: 0.012, primary: { light: [0.42, 0.16, 275], dark: [0.75, 0.12, 275] }, accent: [0.65, 0.07, 300] },
  { id: "forest", name: "Forest", description: "Calm green for accounting and ledgers.", hue: 150, tint: 0.008, primary: { light: [0.42, 0.09, 155], dark: [0.77, 0.11, 155] }, accent: [0.7, 0.08, 120] },
  { id: "teal", name: "Teal", description: "Clinical teal for health and care.", hue: 195, tint: 0.01, primary: { light: [0.46, 0.08, 195], dark: [0.79, 0.09, 192] }, accent: [0.72, 0.07, 170] },
  { id: "oxblood", name: "Oxblood", description: "Deep red for legal and luxury.", hue: 20, tint: 0.008, primary: { light: [0.4, 0.12, 20], dark: [0.74, 0.12, 20] }, accent: [0.7, 0.06, 50] },
  { id: "plum", name: "Plum", description: "Muted plum for creative studios.", hue: 330, tint: 0.01, primary: { light: [0.4, 0.11, 330], dark: [0.76, 0.1, 330] }, accent: [0.68, 0.06, 290] },
  { id: "sand", name: "Sand", description: "Soft sand for hospitality and retail.", hue: 80, tint: 0.012, primary: { light: [0.45, 0.07, 70], dark: [0.83, 0.07, 80] }, accent: [0.72, 0.06, 95] },
  { id: "ochre", name: "Ochre", description: "Earthy ochre for logistics and field work.", hue: 75, tint: 0.01, primary: { light: [0.52, 0.12, 70], dark: [0.81, 0.12, 75] }, accent: [0.45, 0.05, 50] },
  { id: "steel", name: "Steel", description: "Industrial steel blue for operations.", hue: 230, tint: 0.015, primary: { light: [0.45, 0.05, 230], dark: [0.81, 0.04, 230] }, accent: [0.65, 0.03, 230] },
];
