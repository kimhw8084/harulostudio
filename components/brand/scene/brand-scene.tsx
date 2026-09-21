"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useExperience } from "@/components/experience-provider";
import {
  clamp,
  quietScene,
  resolveChannels,
  type BrandChannels,
  type SceneInput,
  type SceneQuality,
} from "@/lib/brand/scene";

type SceneAPI = {
  update: (values: Partial<SceneInput>) => void;
  subscribe: (callback: (channels: BrandChannels) => void) => () => void;
};
const Context = createContext<SceneAPI | null>(null);
export const useBrandScene = () => useContext(Context);

/** Writes local CSS variables; no animation-frame React renders or global scroll state. */
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
  const node = useRef<HTMLDivElement>(null),
    input = useRef({ ...quietScene, pointer: { x: 0, y: 0 } });
  const listeners = useRef(new Set<(v: BrandChannels) => void>());
  const invalidate = useRef<() => void>(() => {});
  const { paused, reduced, theme } = useExperience();
  const update = useCallback((values: Partial<SceneInput>) => {
    Object.assign(input.current, values);
    invalidate.current();
  }, []);
  const subscribe = useCallback((callback: (v: BrandChannels) => void) => {
    listeners.current.add(callback);
    callback(resolveChannels(input.current));
    return () => {
      listeners.current.delete(callback);
    };
  }, []);
  useEffect(() => {
    update({ history });
  }, [history, update]);
  useEffect(() => {
    const el = node.current;
    if (!el) return;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const level = paused
      ? "static"
      : reduced
        ? "reduced"
        : (quality ?? (coarse || innerWidth < 768 ? "balanced" : "full"));
    el.dataset.quality = level;
    let visible = false,
      frame = 0,
      last = 0;
    const paint = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const elapsed = Math.min(64, now - last || 16);
      last = now;
      if (level === "static" || level === "reduced") input.current.energy = 0;
      else input.current.energy *= Math.pow(0.91, elapsed / 16);
      if (input.current.energy < 0.006) input.current.energy = 0;
      const state = resolveChannels(input.current);
      el.style.setProperty("--field-x", `${state.ring.center.x * 100}%`);
      el.style.setProperty("--field-y", `${state.ring.center.y * 100}%`);
      el.style.setProperty("--scene-energy", String(state.satellite.energy));
      el.style.setProperty("--scene-progress", String(state.ring.reveal));
      el.style.setProperty(
        "--scene-history",
        String(state.secondaryTier.historyProgress),
      );
      el.style.setProperty(
        "--tier-extension",
        String(state.primaryTier.extension),
      );
      el.style.setProperty(
        "--field-dx",
        `${input.current.pointer.x * (level === "full" ? 3 : 0)}px`,
      );
      el.style.setProperty(
        "--field-dy",
        `${input.current.pointer.y * (level === "full" ? 3 : 0)}px`,
      );
      listeners.current.forEach((callback) => callback(state));
      el.dataset.active = state.satellite.energy > 0 ? "true" : "false";
      if (state.satellite.energy > 0) frame = requestAnimationFrame(paint);
    };
    const request = () => {
      if (visible && !document.hidden && !frame)
        frame = requestAnimationFrame(paint);
    };
    invalidate.current = request;
    const scroll = () => {
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      input.current.progress = clamp(
        (innerHeight - rect.top) / (innerHeight + rect.height),
      );
      request();
    };
    const move = (event: PointerEvent) => {
      if (level !== "full" || event.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      input.current.pointer = {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1,
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1,
      };
      input.current.energy = Math.max(input.current.energy, 0.18);
      request();
    };
    const leave = () => {
      input.current.pointer = { x: 0, y: 0 };
      request();
    };
    const activate = () => {
      input.current.energy = 1;
      request();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else request();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) scroll();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: "80px" },
    );
    observer.observe(el);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    el.addEventListener("click", activate);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      invalidate.current = () => {};
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("click", activate);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reduced, quality, theme]);
  return (
    <Context.Provider value={{ update, subscribe }}>
      <div
        ref={node}
        className={`brand-scene ${className}`}
        data-systems={systems}
        data-quality="static"
      >
        {children}
      </div>
    </Context.Provider>
  );
}
