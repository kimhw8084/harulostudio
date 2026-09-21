import { HARULO, proportions } from "./geometry";

export type SceneQuality = "full" | "balanced" | "reduced" | "static";
export type SceneMaterial = "flow" | "chrono" | "membrane";
export interface Point {
  x: number;
  y: number;
}
export interface BrandChannels {
  ring: {
    center: Point;
    radius: number;
    fieldStrength: number;
    reveal: number;
    focus: number;
  };
  satellite: {
    position: Point;
    energy: number;
    velocity: number;
    target: Point;
  };
  primaryTier: {
    extension: number;
    registration: number;
    contentProgress: number;
  };
  secondaryTier: { extension: number; echo: number; historyProgress: number };
}
export interface SceneInput {
  progress: number;
  energy: number;
  focus: number;
  history: number;
  pointer: Point;
}
export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));
export const quietScene: SceneInput = {
  progress: 0,
  energy: 0,
  focus: 0,
  history: 1,
  pointer: { x: 0, y: 0 },
};

/** Normalized material channels. These describe an environment, never a second master mark. */
export function resolveChannels(input: SceneInput): BrandChannels {
  const p = clamp(input.progress),
    f = clamp(input.focus),
    e = clamp(input.energy),
    h = clamp(input.history);
  return {
    ring: {
      center: {
        x: HARULO.ring.cx / 100 + input.pointer.x * 0.012,
        y: HARULO.ring.cy / 100 + input.pointer.y * 0.012,
      },
      radius: HARULO.ring.r / 100,
      fieldStrength: e * 0.54,
      reveal: p,
      focus: f,
    },
    satellite: {
      position: {
        x: HARULO.satellite.cx / 100 + p * 0.12,
        y: HARULO.satellite.cy / 100 + (1 - h) * 0.23,
      },
      target: input.pointer,
      velocity: e * proportions.satelliteRatio,
      energy: e,
    },
    primaryTier: {
      extension: 0.4 + p * 0.6,
      registration: 1 - e,
      contentProgress: p,
    },
    secondaryTier: {
      extension: (0.4 + p * 0.6) * proportions.tierRatio,
      echo: (1 - h) * 0.36,
      historyProgress: h,
    },
  };
}

export const productionSystems = [
  ["01", "Living aperture", "The ring focuses the working instrument.", "hero"],
  [
    "02",
    "Cobalt → Ember",
    "Energy marks a change, then returns to structure.",
    "theme",
  ],
  [
    "03",
    "Publication loom",
    "Title and metadata travel on paired rails.",
    "catalog",
  ],
  [
    "04",
    "Interface genesis",
    "A canonical mark unfolds into usable software.",
    "hero",
  ],
  [
    "05",
    "Magnetic field",
    "A nearby pointer creates a small, bounded tension.",
    "hero",
  ],
  [
    "06",
    "Spatial fold",
    "An edition separates into publication planes.",
    "catalog",
  ],
  [
    "07",
    "Release river",
    "A selected release registers against its chronology.",
    "releases",
  ],
  [
    "08",
    "Palimpsest",
    "An earlier edition remains beside its successor.",
    "releases",
  ],
  [
    "09",
    "Cobalt field cut",
    "An aperture interrupts a publisher-scale plane.",
    "history",
  ],
  [
    "10",
    "Satellite writes",
    "The active signal extends a reading rail.",
    "releases",
  ],
  [
    "11",
    "Semantic gravity",
    "Opening an edition aligns its application and metadata.",
    "catalog",
  ],
  [
    "12",
    "Product portal",
    "A named product surface persists across native navigation.",
    "catalog",
  ],
  [
    "13",
    "Typographic resonance",
    "Display type and metadata share the tier relationship.",
    "hero",
  ],
  [
    "14",
    "Edition stack",
    "A native disclosure opens the published artifact.",
    "catalog",
  ],
  [
    "15",
    "Chrono lens",
    "A decade becomes a manually inspectable field.",
    "history",
  ],
  [
    "16",
    "Signal transfer",
    "One Ember destination follows the selected year.",
    "history",
  ],
  [
    "17",
    "Registration lock",
    "Publication layers align at the end of a state change.",
    "releases",
  ],
  [
    "18",
    "Living grid",
    "The 0.54 tier ratio organizes shared layouts.",
    "catalog",
  ],
  [
    "19",
    "Software X-ray",
    "Inspect the keyboard, accessibility and data contracts.",
    "product",
  ],
  [
    "20",
    "Daily state memory",
    "Only this browser remembers an explored era.",
    "history",
  ],
  [
    "21",
    "Ember ignition",
    "Opening the instrument sends a finite energy wave.",
    "hero",
  ],
  [
    "22",
    "Publication surface",
    "An optional chronological atlas retains native links.",
    "history",
  ],
  [
    "23",
    "Four-state material",
    "Four typed channels drive geometry, light, layout and history.",
    "all",
  ],
  [
    "24",
    "Final return",
    "A publication composition resolves into the exact master.",
    "footer",
  ],
] as const;
