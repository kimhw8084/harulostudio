import { HARULO } from "./geometry";

// The same four primitives survive every intermediate pose. No replacement logos.
export type Ring = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  strokeWidth: number;
};
export type Tier = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
};
export type BrandPose = {
  ring: Ring;
  satellite: { cx: number; cy: number; r: number };
  primary: Tier;
  secondary: Tier;
};
export const REST: BrandPose = {
  ring: {
    x: HARULO.ring.cx - HARULO.ring.r,
    y: HARULO.ring.cy - HARULO.ring.r,
    width: HARULO.ring.r * 2,
    height: HARULO.ring.r * 2,
    rx: HARULO.ring.r,
    strokeWidth: HARULO.ring.strokeWidth,
  },
  satellite: { ...HARULO.satellite },
  primary: { ...HARULO.primary },
  secondary: { ...HARULO.secondary },
};

export const motion = {
  micro: 160,
  hover: 240,
  settle: 480,
  publish: 640,
  assemble: 960,
  open: 1100,
  collapse: 820,
  orbit: 1800,
  transition: 560,
  study: 5600,
  ease: {
    open: "cubic-bezier(.22,.78,.18,1)",
    settle: "cubic-bezier(.16,1,.3,1)",
    publish: "cubic-bezier(.65,0,.2,1)",
  },
} as const;

export type StudyId =
  | "open"
  | "edition"
  | "timeline"
  | "navigation"
  | "portal"
  | "loading"
  | "stamp"
  | "family"
  | "screenshot"
  | "version"
  | "closure"
  | "mobile";
export type Study = {
  id: StudyId;
  name: string;
  family: string;
  purpose: string;
  target: BrandPose;
};
const ring = (
  x: number,
  y: number,
  width: number,
  height: number,
  rx: number,
  strokeWidth = 2,
): Ring => ({ x, y, width, height, rx, strokeWidth });
const tier = (
  x: number,
  y: number,
  width: number,
  height = 2,
  rx = height / 2,
): Tier => ({ x, y, width, height, rx });
const satellite = (cx: number, cy: number, r = 3) => ({ cx, cy, r });
export const studies: Study[] = [
  {
    id: "open",
    name: "A little space",
    family: "OPEN / ASSEMBLE",
    purpose:
      "The ring opens into a working interface. The tiers become its publishing rails.",
    target: {
      ring: ring(8, 9, 84, 62, 9),
      satellite: satellite(84, 17, 2),
      primary: tier(8, 80, 58, 3),
      secondary: tier(8, 88, 31.32),
    },
  },
  {
    id: "edition",
    name: "One published work",
    family: "PUBLISH",
    purpose:
      "An edition surface, its status, its name, and its version emerge from four pieces.",
    target: {
      ring: ring(19, 6, 62, 66, 5),
      satellite: satellite(77, 83),
      primary: tier(19, 80, 43, 3),
      secondary: tier(19, 88, 23.22),
    },
  },
  {
    id: "timeline",
    name: "From version to version",
    family: "ORBIT / PUBLISH",
    purpose:
      "The primary tier becomes a release track. The ring holds a major edition; the satellite marks progress.",
    target: {
      ring: ring(40, 25, 20, 20, 10, 3),
      satellite: satellite(79, 51, 3.5),
      primary: tier(8, 50, 84),
      secondary: tier(42, 65, 45.36),
    },
  },
  {
    id: "navigation",
    name: "Toward somewhere",
    family: "ORBIT",
    purpose:
      "The ring becomes navigation containment and the satellite becomes the selected destination.",
    target: {
      ring: ring(6, 30, 88, 31, 15.5),
      satellite: satellite(21, 45.5, 4),
      primary: tier(36, 39, 39, 2.8),
      secondary: tier(36, 49, 21.06),
    },
  },
  {
    id: "portal",
    name: "Into the next page",
    family: "OPEN",
    purpose:
      "The same contour opens beyond the viewport. Content passes through, without delaying navigation.",
    target: {
      ring: ring(-28, -28, 156, 156, 64, 3),
      satellite: satellite(84, 17, 4),
      primary: tier(12, 75, 63, 3),
      secondary: tier(12, 86, 34.02),
    },
  },
  {
    id: "loading",
    name: "Something taking shape",
    family: "ORBIT / ASSEMBLE",
    purpose:
      "One finite orbit resolves into a progress instrument. Used only while work is actually pending.",
    target: {
      ring: ring(32, 20, 36.5, 36.5, 18.25, 3),
      satellite: satellite(72, 39, 4.35),
      primary: tier(20, 69, 60, 3),
      secondary: tier(20, 77, 32.4, 3),
    },
  },
  {
    id: "stamp",
    name: "Published. Settled.",
    family: "SETTLE",
    purpose:
      "An open registration frame gathers its metadata rails, then locks precisely into the master mark.",
    target: {
      ring: ring(19, 14, 62, 48, 4, 1.8),
      satellite: satellite(74, 25, 2.5),
      primary: tier(28, 72, 44, 3),
      secondary: tier(38.12, 83, 23.76),
    },
  },
  {
    id: "family",
    name: "Different work. One origin.",
    family: "OPEN / PUBLISH",
    purpose:
      "The ring becomes a product world; the satellite holds its state, while the publisher rails remain.",
    target: {
      ring: ring(18, 10, 58, 58, 29, 3),
      satellite: satellite(80, 22, 4.35),
      primary: tier(22, 78, 56, 3.4),
      secondary: tier(34.88, 87, 30.24, 2.75),
    },
  },
  {
    id: "screenshot",
    name: "A closer look",
    family: "OPEN",
    purpose:
      "A circular crop becomes a full software viewport. Nothing is exchanged behind a fading logo.",
    target: {
      ring: ring(4, 17, 92, 55, 2.5),
      satellite: satellite(89, 24, 2),
      primary: tier(9, 81, 67, 3),
      secondary: tier(9, 89, 36.18),
    },
  },
  {
    id: "version",
    name: "The next edition",
    family: "PUBLISH / NEXT DAY",
    purpose:
      "A version is registered on the primary tier. The secondary tier carries its publication date.",
    target: {
      ring: ring(8, 23, 23, 23, 11.5, 3),
      satellite: satellite(87, 29, 3),
      primary: tier(37, 48, 52, 3),
      secondary: tier(37, 65, 28.08),
    },
  },
  {
    id: "closure",
    name: "A day, complete",
    family: "ASSEMBLE / SETTLE",
    purpose:
      "The separated ring, satellite and publishing planes return to their exact resting coordinates.",
    target: {
      ring: ring(9, 8, 45, 45, 22.5, 7.25),
      satellite: satellite(84, 19, 4.35),
      primary: tier(17, 72, 70, 6.8, 3.4),
      secondary: tier(42, 90, 37.8, 5.5, 2.75),
    },
  },
  {
    id: "mobile",
    name: "A place to go",
    family: "OPEN / ORBIT",
    purpose:
      "A compact mark opens a navigation surface. Its tiers become hierarchy, its satellite a destination.",
    target: {
      ring: ring(26, 4, 48, 90, 9),
      satellite: satellite(37, 25, 3),
      primary: tier(34, 49, 32, 3),
      secondary: tier(34, 72, 17.28),
    },
  },
];

export const studyById = (id: StudyId) => studies.find((s) => s.id === id)!;
export const ease = (t: number) =>
  1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 4);
const mixObject = <T extends object>(a: T, b: T, t: number): T =>
  Object.fromEntries(
    Object.entries(a).map(([key, value]) => [
      key,
      Number(value) + (Number(b[key as keyof T]) - Number(value)) * t,
    ]),
  ) as T;
export function interpolatePose(
  from: BrandPose,
  to: BrandPose,
  t: number,
): BrandPose {
  if (t <= 0) return from;
  if (t >= 1) return to;
  return {
    ring: mixObject(from.ring, to.ring, t),
    satellite: mixObject(from.satellite, to.satellite, t),
    primary: mixObject(from.primary, to.primary, t),
    secondary: mixObject(from.secondary, to.secondary, t),
  };
}
export function studyPose(id: StudyId, progress: number): BrandPose {
  if (progress <= 0 || progress >= 1) return REST;
  const amount =
    progress < 0.1
      ? 0
      : progress < 0.42
        ? ease((progress - 0.1) / 0.32)
        : progress < 0.68
          ? 1
          : 1 - ease((progress - 0.68) / 0.32);
  const pose = interpolatePose(REST, studyById(id).target, amount);
  if (id === "loading" && progress > 0.1 && progress < 0.68) {
    const turn = Math.min(1, (progress - 0.1) / 0.58) * Math.PI * 2;
    const cx = pose.ring.x + pose.ring.width / 2,
      cy = pose.ring.y + pose.ring.height / 2;
    const dx = pose.satellite.cx - cx,
      dy = pose.satellite.cy - cy;
    return {
      ...pose,
      satellite: {
        ...pose.satellite,
        cx: cx + dx * Math.cos(turn) - dy * Math.sin(turn),
        cy: cy + dx * Math.sin(turn) + dy * Math.cos(turn),
      },
    };
  }
  return pose;
}
export function ringPath({ x, y, width: w, height: h, rx }: Ring) {
  const r = Math.min(rx, w / 2, h / 2);
  return `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
}
