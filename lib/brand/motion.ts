import { HARULO } from "./geometry";

export type Ring = { x: number; y: number; width: number; height: number; rx: number; strokeWidth: number };
export type Tier = { x: number; y: number; width: number; height: number; rx: number };
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
  open: 560,
  collapse: 420,
  orbit: 1800,
  transition: 560,
  study: 1800,
  ease: {
    open: "cubic-bezier(.22,.78,.18,1)",
    settle: "cubic-bezier(.16,1,.3,1)",
    publish: "cubic-bezier(.65,0,.2,1)",
  },
} as const;

export const ease = (t: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 4);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixShape = <T extends Record<string, number>>(a: T, b: T, t: number): T => {
  const result = {} as T;
  for (const key of Object.keys(a) as (keyof T)[]) result[key] = mix(a[key], b[key], t) as T[typeof key];
  return result;
};

export function interpolatePose(a: BrandPose, b: BrandPose, t: number): BrandPose {
  const p = Math.max(0, Math.min(1, t));
  return {
    ring: mixShape(a.ring, b.ring, p),
    satellite: mixShape(a.satellite, b.satellite, p),
    primary: mixShape(a.primary, b.primary, p),
    secondary: mixShape(a.secondary, b.secondary, p),
  };
}

export function ringPath(ring: Ring) {
  const rx = Math.min(ring.rx, ring.width / 2, ring.height / 2);
  const ry = rx;
  return `M ${ring.x + rx} ${ring.y} H ${ring.x + ring.width - rx} A ${rx} ${ry} 0 1 1 ${ring.x + rx} ${ring.y + ring.height} A ${rx} ${ry} 0 1 1 ${ring.x + rx} ${ring.y}`;
}
