type VisualInput = {
  paper?: unknown;
  ink?: unknown;
  burgundy?: unknown;
  brass?: unknown;
  forest?: unknown;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

export const DARK_VISUAL_DEFAULTS = {
  paper: "#0b1624",
  ink: "#f5f7fb",
  burgundy: "#df5b61",
  brass: "#e0b86a",
  forest: "#8bcf91",
};

function normalizeHexColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const hex = match[1].toLowerCase();
  const normalized = hex.length === 3
    ? hex.split("").map((char) => char + char).join("")
    : hex;

  return `#${normalized}`;
}

function toRgb(hex: string): Rgb {
  const clean = hex.slice(1);
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function channelLuminance(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const { r, g, b } = toRgb(hex);
  return 0.2126 * channelLuminance(r)
    + 0.7152 * channelLuminance(g)
    + 0.0722 * channelLuminance(b);
}

function contrastRatio(first: string, second: string): number {
  const firstLum = luminance(first);
  const secondLum = luminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableAccent(value: unknown, surface: string, fallback: string): string {
  const color = normalizeHexColor(value);
  return color && contrastRatio(surface, color) >= 3 ? color : fallback;
}

export function normalizeVisualColors(visual?: VisualInput) {
  const requestedPaper = normalizeHexColor(visual?.paper);
  const paper = requestedPaper && luminance(requestedPaper) <= 0.22
    ? requestedPaper
    : DARK_VISUAL_DEFAULTS.paper;

  const requestedInk = normalizeHexColor(visual?.ink);
  const ink = requestedInk && contrastRatio(paper, requestedInk) >= 4.5
    ? requestedInk
    : DARK_VISUAL_DEFAULTS.ink;

  return {
    paper,
    ink,
    burgundy: readableAccent(visual?.burgundy, paper, DARK_VISUAL_DEFAULTS.burgundy),
    brass: readableAccent(visual?.brass, paper, DARK_VISUAL_DEFAULTS.brass),
    forest: readableAccent(visual?.forest, paper, DARK_VISUAL_DEFAULTS.forest),
  };
}

export function visualThemeCssVars(visual?: VisualInput): Record<string, string> {
  const colors = normalizeVisualColors(visual);

  return {
    "--cream": colors.paper,
    "--ink": colors.ink,
    "--rail": colors.ink,
    "--burgundy": colors.burgundy,
    "--brass": colors.brass,
    "--forest": colors.forest,
  };
}
