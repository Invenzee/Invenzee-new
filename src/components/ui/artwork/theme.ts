import type { ArtTone, ArtVariant } from "@/content/site";

export type Palette = {
  bg: string;
  surface: string;
  surface2: string;
  line: string;
  lineStrong: string;
  fg: string;
  fgSoft: string;
  accent: string;
  accentOn: string;
};

export const palettes: Record<ArtTone, Palette> = {
  navy: {
    bg: "#101145",
    surface: "#171A4A",
    surface2: "#1F2360",
    line: "rgba(255,255,255,0.14)",
    lineStrong: "rgba(255,255,255,0.30)",
    fg: "#FFFFFF",
    fgSoft: "rgba(255,255,255,0.58)",
    accent: "#4BC5DE",
    accentOn: "#101145",
  },
  ink: {
    bg: "#0E1030",
    surface: "#171A4A",
    surface2: "#1C214F",
    line: "rgba(255,255,255,0.12)",
    lineStrong: "rgba(255,255,255,0.28)",
    fg: "#FFFFFF",
    fgSoft: "rgba(255,255,255,0.55)",
    accent: "#4BC5DE",
    accentOn: "#101145",
  },
  cyan: {
    bg: "#4BC5DE",
    surface: "#86E2F5",
    surface2: "#FFFFFF",
    line: "rgba(16,17,69,0.20)",
    lineStrong: "rgba(16,17,69,0.40)",
    fg: "#101145",
    fgSoft: "rgba(16,17,69,0.55)",
    accent: "#101145",
    accentOn: "#FFFFFF",
  },
  paper: {
    bg: "#E1E7EF",
    surface: "#FFFFFF",
    surface2: "#EFF2F6",
    line: "rgba(16,17,69,0.14)",
    lineStrong: "rgba(16,17,69,0.30)",
    fg: "#101145",
    fgSoft: "rgba(16,17,69,0.52)",
    accent: "#0B7F99",
    accentOn: "#FFFFFF",
  },
};

export const NAVY = "#101145";
export const WHITE = "#FFFFFF";
export const INK = "#07081C";
export const CYAN = "#4BC5DE";
export const CYAN_BRIGHT = "#86E2F5";
export const CYAN_DEEP = "#0B7F99";
export const PAPER = "#EFF2F6";
export const CORAL = "#FF7A59";
export const LIME = "#C6F26B";
export const VIOLET = "#9D8CFF";
export const AMBER = "#FFC857";
export const PINK = "#FF8FC7";

export const FONT = {
  display: "var(--font-outfit), sans-serif",
  accent: "var(--font-remboy), serif",
  mono: "var(--font-dm-mono), monospace",
} as const;

const MARKER: Record<ArtVariant, string> = {
  brand: CORAL,
  web: CYAN,
  app: VIOLET,
  growth: LIME,
  motion: AMBER,
  illustration: PINK,
};

export function isLight(tone: ArtTone): boolean {
  return tone === "paper" || tone === "cyan";
}

/** Web's spice is cyan on dark fields, bright cyan on paper, white on cyan. */
export function markerFor(variant: ArtVariant, tone: ArtTone): string {
  if (variant === "web") {
    if (tone === "cyan") return WHITE;
    if (tone === "paper") return CYAN;
    return CYAN_BRIGHT;
  }
  return MARKER[variant];
}

export type VariantProps = {
  p: Palette;
  id: string;
  animated: boolean;
  marker: string;
  tone: ArtTone;
};
