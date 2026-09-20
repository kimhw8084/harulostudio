import type { CSSProperties } from "react";

export type Palette = {
  id: string;
  name: string;
  character: string;
  colors: string[];
  tokens: Record<string, string>;
};
const rgb = (hex: string) =>
  hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16));
function luminance(hex: string) {
  return rgb(hex)
    .map((v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
function mix(a: string, b: string, t: number) {
  const x = rgb(a),
    y = rgb(b);
  return `#${x
    .map((v, i) =>
      Math.round(v + (y[i] - v) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
const ink = (bg: string) =>
  contrast(bg, "#101114") > contrast(bg, "#ffffff") ? "#101114" : "#ffffff";
export function readable(color: string, bg: string, ratio = 4.6) {
  if (contrast(color, bg) >= ratio) return color;
  const target = ink(bg);
  for (let i = 1; i <= 100; i++) {
    const candidate = mix(color, target, i / 100);
    if (contrast(candidate, bg) >= ratio) return candidate;
  }
  return target;
}
function palette(
  id: string,
  name: string,
  character: string,
  colors: string[],
  bg: string,
  fg: string,
  primary: string,
  secondary: string,
  accent: string,
  hero: string,
  stage: string,
): Palette {
  const surface = mix(bg, fg, 0.035),
    elevated = mix(bg, fg, 0.075),
    foreground = readable(fg, bg);
  return {
    id,
    name,
    character,
    colors,
    tokens: {
      background: bg,
      foreground,
      primary,
      "primary-foreground": ink(primary),
      secondary,
      "secondary-foreground": ink(secondary),
      accent,
      "accent-foreground": ink(accent),
      muted: readable(mix(foreground, bg, 0.28), bg),
      border: readable(mix(foreground, bg, 0.72), bg, 3.1),
      surface,
      elevated,
      active: primary,
      "active-foreground": ink(primary),
      "product-surface": surface,
      metadata: readable(mix(foreground, primary, 0.2), bg),
      focus: readable(secondary, bg, 3.2),
      selection: primary,
      "selection-foreground": ink(primary),
      destructive: readable("#cc302c", bg),
      success: readable("#158456", bg),
      shadow: `${fg}25`,
      ambient: `${accent}30`,
      hero,
      "hero-foreground": ink(hero),
      stage,
      "stage-foreground": ink(stage),
      mark: readable(primary, stage),
      "surface-foreground": readable(fg, surface),
      "elevated-foreground": readable(fg, elevated),
      inverse: foreground,
      "inverse-foreground": ink(foreground),
    },
  };
}
export const palettes: Palette[] = [
  palette(
    "01",
    "Solar Ink",
    "Light-powered, dramatic, editorial.",
    ["#0B0B0A", "#FFD83D", "#F5F0E6", "#F24E36", "#55534D"],
    "#F5F0E6",
    "#0B0B0A",
    "#FFD83D",
    "#F24E36",
    "#FFD83D",
    "#FFD83D",
    "#0B0B0A",
  ),
  palette(
    "02",
    "Cobalt Ember",
    "Digital precision. A warm collision.",
    ["#123DFF", "#FF5C35", "#F3F5FF", "#101322", "#B8A7FF"],
    "#F3F5FF",
    "#101322",
    "#123DFF",
    "#FF5C35",
    "#B8A7FF",
    "#123DFF",
    "#101322",
  ),
  palette(
    "03",
    "Korean Signal",
    "Clear, cultural, sharply graphic.",
    ["#111111", "#E63B2E", "#2764D8", "#F5F2EB", "#64615C"],
    "#F5F2EB",
    "#111111",
    "#E63B2E",
    "#2764D8",
    "#2764D8",
    "#111111",
    "#2764D8",
  ),
  palette(
    "04",
    "Acid Day",
    "Experimental. A future software label.",
    ["#C8FF32", "#573CFF", "#090A08", "#F5F7F2", "#FF6856"],
    "#F5F7F2",
    "#090A08",
    "#573CFF",
    "#C8FF32",
    "#FF6856",
    "#C8FF32",
    "#573CFF",
  ),
  palette(
    "05",
    "Midnight Sun",
    "Cinematic, deep, luminous.",
    ["#081627", "#FFB627", "#4361A8", "#F0F3F7", "#CB6A46"],
    "#081627",
    "#F0F3F7",
    "#FFB627",
    "#4361A8",
    "#CB6A46",
    "#FFB627",
    "#081627",
  ),
  palette(
    "06",
    "Digital Jade",
    "An uncommon calm. Human precision.",
    ["#0E8F72", "#092E2B", "#E8F3EE", "#FF876D", "#C7D6CF"],
    "#E8F3EE",
    "#092E2B",
    "#0E8F72",
    "#FF876D",
    "#C7D6CF",
    "#0E8F72",
    "#092E2B",
  ),
  palette(
    "07",
    "Mono Signal",
    "Reduced to the loudest essentials.",
    ["#050505", "#FAFAF7", "#FF4D00", "#8B8B87", "#E4E4DF"],
    "#FAFAF7",
    "#050505",
    "#FF4D00",
    "#050505",
    "#E4E4DF",
    "#050505",
    "#050505",
  ),
  palette(
    "08",
    "Violet Dawn",
    "Dreamlike atmosphere. Exact structure.",
    ["#211742", "#A88AF7", "#FFB49B", "#F7EEFA", "#50265D"],
    "#F7EEFA",
    "#211742",
    "#A88AF7",
    "#50265D",
    "#FFB49B",
    "#211742",
    "#50265D",
  ),
  palette(
    "09",
    "Saffron Circuit",
    "Warm publication. Technical instrument.",
    ["#F5A400", "#173A5E", "#FAF5E8", "#E64A35", "#697062"],
    "#FAF5E8",
    "#173A5E",
    "#F5A400",
    "#E64A35",
    "#697062",
    "#F5A400",
    "#173A5E",
  ),
  palette(
    "10",
    "Ice / Fire",
    "Cool clarity with a burning edge.",
    ["#DDF6FF", "#32C8E6", "#E65028", "#111419", "#F8FAFA"],
    "#DDF6FF",
    "#111419",
    "#E65028",
    "#32C8E6",
    "#32C8E6",
    "#32C8E6",
    "#111419",
  ),
];
export function paletteStyle(p: Palette): CSSProperties {
  return Object.fromEntries(
    Object.entries(p.tokens).map(([key, value]) => [`--brand-${key}`, value]),
  ) as CSSProperties;
}
export function contrastChecks(p: Palette) {
  return [
    ["Body", "foreground", "background"],
    ["Secondary text", "muted", "background"],
    ["Button", "primary-foreground", "primary"],
    ["Hero", "hero-foreground", "hero"],
    ["Stage", "stage-foreground", "stage"],
    ["Vector mark", "mark", "stage"],
    ["Metadata", "metadata", "background"],
    ["Surface", "surface-foreground", "surface"],
    ["Elevated", "elevated-foreground", "elevated"],
    ["Selection", "selection-foreground", "selection"],
    ["Destructive", "destructive", "background"],
    ["Success", "success", "background"],
  ].map(([label, a, b]) => ({
    label,
    ratio: contrast(p.tokens[a], p.tokens[b]),
  }));
}
