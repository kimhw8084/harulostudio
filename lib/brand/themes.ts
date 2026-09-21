/** Permanent Cobalt Ember. Raw swatches never change; semantic pairs are calibrated. */
export const swatches = {
  cobalt: "#123DFF",
  ember: "#FF5C35",
  paper: "#F3F5FF",
  ink: "#101322",
  lilac: "#B8A7FF",
} as const;
export type Theme = "light" | "dark";
export function migrateTheme(value: string | null): Theme | null {
  if (value === "dark" || value === "evening") return "dark";
  if (value === "light" || value === "daylight") return "light";
  return null;
}
export const themes = {
  light: {
    background: swatches.paper,
    foreground: swatches.ink,
    card: "#E8ECFF",
    primary: swatches.cobalt,
    "primary-foreground": "#FFFFFF",
    secondary: "#DCE3FF",
    "secondary-foreground": swatches.ink,
    muted: "#E8ECFF",
    "muted-foreground": "#505979",
    accent: "#2444C7",
    border: "#B9C3E4",
    input: "#707DA7",
    ring: "#123DFF",
    destructive: "#AD3021",
    success: "#176545",
    signal: swatches.ember,
    "signal-text": "#AF3217",
    cobalt: swatches.cobalt,
    lilac: swatches.lilac,
    "brand-structure": swatches.cobalt,
    "brand-signal": swatches.ember,
    "hero-bg": swatches.paper,
    "hero-ink": swatches.ink,
    stage: "#101322",
    "stage-ink": swatches.paper,
    "surface-deep": "#DCE3FF",
    "surface-glass": "#F3F5FFDD",
    "field-opacity": ".6",
  },
  dark: {
    background: "#090B17",
    foreground: swatches.paper,
    card: "#11172B",
    primary: "#6F86FF",
    "primary-foreground": "#090B17",
    secondary: "#1D2848",
    "secondary-foreground": swatches.paper,
    muted: "#11172B",
    "muted-foreground": "#B5BEDD",
    accent: "#C7BBFF",
    border: "#364264",
    input: "#8290B6",
    ring: "#FF7152",
    destructive: "#FF937E",
    success: "#7FD8B3",
    signal: "#FF7152",
    "signal-text": "#FF947B",
    cobalt: "#6F86FF",
    lilac: "#C7BBFF",
    "brand-structure": "#6F86FF",
    "brand-signal": "#FF7152",
    "hero-bg": "#090B17",
    "hero-ink": swatches.paper,
    stage: "#11172B",
    "stage-ink": swatches.paper,
    "surface-deep": "#1D2848",
    "surface-glass": "#11172BDD",
    "field-opacity": ".42",
  },
} as const;
const declarations = (theme: Theme) =>
  Object.entries(themes[theme])
    .map(([k, v]) => `--${k}:${v}`)
    .join(";");
export const themeStyles = `:root,[data-theme="light"]{color-scheme:light;${declarations("light")}}[data-theme="dark"]{color-scheme:dark;${declarations("dark")}}@media(prefers-color-scheme:dark){:root:not([data-theme]){color-scheme:dark;${declarations("dark")}}}`;
export const themeBootstrap = `try{const t=localStorage.getItem('harulo-theme');const m=t==='evening'?'dark':t==='daylight'?'light':t;const v=m==='light'||m==='dark'?m:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=v;if(t&&t!==m)localStorage.setItem('harulo-theme',v);document.documentElement.dataset.motion=localStorage.getItem('harulo-motion')==='paused'||matchMedia('(prefers-reduced-motion:reduce)').matches?'paused':'running'}catch(e){}`;
