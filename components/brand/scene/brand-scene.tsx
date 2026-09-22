"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { useExperience } from "@/components/experience-provider";
import { getBrandScheduler } from "@/lib/brand/scheduler";
import { clamp, quietScene, resolveChannels, sceneProgress, type BrandChannels, type BrandEvent, type SceneInput, type SceneQuality } from "@/lib/brand/scene";

type SceneAPI = {
  update: (values: Partial<SceneInput>) => void;
  emit: (event: BrandEvent) => void;
  subscribe: (callback: (channels: BrandChannels) => void) => () => void;
};
const Context = createContext<SceneAPI | null>(null);
export const useBrandScene = () => useContext(Context);

/** Scenes share one scheduler; React never renders per animation frame. */
export function BrandScene({
  children,
  className = "",
  history = 1,
  quality,
  systems = "23",
}: {
  children: ReactNode;
  className?: string;
  history?: number;
  quality?: SceneQuality;
  systems?: string;
}) {
  const node = useRef<HTMLDivElement>(null);
  const input = useRef({ ...quietScene, pointer: { x: 0, y: 0 } });
  const listeners = useRef(new Set<(value: BrandChannels) => void>());
  const invalidate = useRef<() => void>(() => {});
  const { paused, reduced, theme } = useExperience();
  const update = useCallback((values: Partial<SceneInput>) => {
    Object.assign(input.current, values);
    invalidate.current();
  }, []);
  const emit = useCallback((event: BrandEvent) => {
    if (event.type === "publication.close") update({ energy: 0 });
    else if (event.type === "publication.open" || event.type === "publication.select") update({ progress: 0.58, energy: 0.24 });
    else if (event.type === "theme.change") update({ energy: 0.2 });
  }, [update]);
  const subscribe = useCallback((callback: (value: BrandChannels) => void) => {
    listeners.current.add(callback);
    callback(resolveChannels(input.current));
    return () => listeners.current.delete(callback);
  }, []);

  useEffect(() => update({ history }), [history, update]);
  useEffect(() => {
    const element = node.current;
    const scheduler = getBrandScheduler();
    if (!element || !scheduler) return;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const level: SceneQuality = paused ? "static" : reduced ? "reduced" : quality ?? (coarse || innerWidth < 768 ? "balanced" : "full");
    element.dataset.quality = level;
    let visible = false;
    let bounds: DOMRect | null = null;
    let last = 0;
    const measure = () => {
      const next = element.getBoundingClientRect();
      bounds = next.width > 0 && next.height > 0 ? next : null;
    };
    const updateProgress = () => {
      measure();
      if (!bounds) {
        input.current.progress = 0;
        return;
      }
      input.current.progress = sceneProgress(innerHeight, bounds.top, bounds.height);
    };
    const frame = (now: number) => {
      if (!visible || document.hidden) return false;
      const elapsed = Math.min(64, now - last || 16);
      last = now;
      if (level === "static" || level === "reduced") input.current.energy = 0;
      else input.current.energy *= Math.pow(0.91, elapsed / 16);
      if (input.current.energy < 0.006) input.current.energy = 0;
      const state = resolveChannels(input.current);
      element.style.setProperty("--field-x", `${state.ring.center.x * 100}%`);
      element.style.setProperty("--field-y", `${state.ring.center.y * 100}%`);
      element.style.setProperty("--scene-energy", String(state.satellite.energy));
      element.style.setProperty("--scene-progress", String(state.ring.reveal));
      element.style.setProperty("--scene-history", String(state.secondaryTier.historyProgress));
      element.style.setProperty("--tier-extension", String(state.primaryTier.extension));
      element.style.setProperty("--field-dx", `${input.current.pointer.x * (level === "full" ? 3 : 0)}px`);
      element.style.setProperty("--field-dy", `${input.current.pointer.y * (level === "full" ? 3 : 0)}px`);
      listeners.current.forEach((callback) => callback(state));
      element.dataset.active = state.satellite.energy > 0 ? "true" : "false";
      return state.satellite.energy > 0;
    };
    const registration = {
      frame,
      active: () => visible,
      scroll: updateProgress,
      resize: measure,
      visibility: () => undefined,
    };
    invalidate.current = () => { scheduler.request(); };
    const onThemeChange = (event: Event) => {
      const to = (event as CustomEvent<"light" | "dark">).detail;
      if (to === "light" || to === "dark") emit({ type: "theme.change", to });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) updateProgress();
      scheduler.request();
    }, { rootMargin: "80px" });
    const resize = new ResizeObserver(() => { measure(); scheduler.request(); });
    const move = (event: PointerEvent) => {
      if (level !== "full" || event.pointerType !== "mouse") return;
      if (!bounds) measure();
      if (!bounds || !bounds.width || !bounds.height) return;
      input.current.pointer = { x: clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 2 - 1, y: clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 2 - 1 };
      input.current.energy = Math.max(input.current.energy, 0.18);
      scheduler.request();
    };
    const leave = () => { input.current.pointer = { x: 0, y: 0 }; scheduler.request(); };
    observer.observe(element);
    resize.observe(element);
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    window.addEventListener("harulo:theme-change", onThemeChange);
    const unregister = scheduler.register(registration);
    scheduler.request();
    return () => {
      unregister();
      observer.disconnect();
      resize.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      window.removeEventListener("harulo:theme-change", onThemeChange);
      invalidate.current = () => {};
    };
  }, [paused, reduced, quality, theme, emit]);
  return <Context.Provider value={{ update, emit, subscribe }}><div ref={node} className={`brand-scene ${className}`} data-systems={systems} data-quality="static">{children}</div></Context.Provider>;
}
