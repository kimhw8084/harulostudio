import { HARULO, proportions } from "./geometry";

export type SceneQuality = "full" | "balanced" | "reduced" | "static";
export type SceneMaterial = "flow" | "day-next" | "membrane";
export interface Point { x: number; y: number; }
export interface BrandChannels {
  ring: { center: Point; radius: number; fieldStrength: number; reveal: number; focus: number };
  satellite: { position: Point; energy: number; velocity: number; target: Point };
  primaryTier: { extension: number; registration: number; contentProgress: number };
  secondaryTier: { extension: number; echo: number; historyProgress: number };
}
export interface SceneInput { progress: number; energy: number; focus: number; history: number; pointer: Point; }
export type BrandEvent =
  | { type: "publication.open"; productId: string }
  | { type: "publication.select"; productId: string }
  | { type: "publication.close" }
  | { type: "theme.change"; to: "light" | "dark" };
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export function sceneProgress(viewportHeight: number, viewportTop: number, height: number) {
  if (viewportHeight <= 0 || height <= 0) return 0;
  return clamp((viewportHeight - viewportTop) / (viewportHeight + height));
}
export const quietScene: SceneInput = { progress: 0, energy: 0, focus: 0, history: 1, pointer: { x: 0, y: 0 } };

export function resolveChannels(input: SceneInput): BrandChannels {
  const p = clamp(input.progress), f = clamp(input.focus), e = clamp(input.energy), h = clamp(input.history);
  return {
    ring: { center: { x: HARULO.ring.cx / 100 + input.pointer.x * 0.012, y: HARULO.ring.cy / 100 + input.pointer.y * 0.012 }, radius: HARULO.ring.r / 100, fieldStrength: e * 0.54, reveal: p, focus: f },
    satellite: { position: { x: HARULO.satellite.cx / 100 + p * 0.12, y: HARULO.satellite.cy / 100 + (1 - h) * 0.23 }, target: input.pointer, velocity: e * proportions.satelliteRatio, energy: e },
    primaryTier: { extension: 0.4 + p * 0.6, registration: 1 - e, contentProgress: p },
    secondaryTier: { extension: (0.4 + p * 0.6) * proportions.tierRatio, echo: (1 - h) * 0.36, historyProgress: h },
  };
}
