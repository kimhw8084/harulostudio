"use client";
import { useEffect, useRef } from "react";
import { useBrandScene } from "../scene/brand-scene";
import { useExperience } from "@/components/experience-provider";
import {
  resolveChannels,
  quietScene,
  type SceneMaterial,
} from "@/lib/brand/scene";

/** Event-driven Canvas 2D. No particles, shaders, network assets, or idle RAF loop. */
export function HaruloEnvironment({
  material = "flow",
}: {
  material?: SceneMaterial;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    scene = useBrandScene();
  const subscribe = scene?.subscribe;
  const { theme, reduced, paused } = useExperience();
  useEffect(() => {
    const element = canvas.current,
      context = element?.getContext("2d", { alpha: true });
    if (!element || !context || !subscribe || reduced || paused) return;
    let width = 0,
      height = 0,
      state = resolveChannels(quietScene),
      active = false;
    const draw = () => {
      if (!active || document.hidden || !width || !height) return;
      context.clearRect(0, 0, width, height);
      const dark = theme === "dark",
        cobalt = dark ? "111,134,255" : "18,61,255";
      const x = width * state.ring.center.x,
        y = height * state.ring.center.y;
      const phase = state.secondaryTier.historyProgress,
        energy = state.satellite.energy;
      const radius =
        Math.min(width, height) * (0.31 + state.ring.reveal * 0.06);
      context.lineWidth = 0.8;
      for (let i = 0; i < 12; i++) {
        context.strokeStyle = `rgba(${cobalt},${dark ? 0.12 : 0.09})`;
        context.beginPath();
        if (material === "flow") {
          const baseline = (height * (i + 1)) / 13;
          context.moveTo(-30, baseline);
          context.bezierCurveTo(
            width * 0.22,
            baseline - 70 * phase,
            x,
            baseline + (y - baseline) * 0.34 + energy * 20,
            width + 30,
            baseline - 45,
          );
        } else if (material === "chrono") {
          const baseline = height * (0.13 + i * 0.064);
          context.moveTo(width * 0.05, baseline);
          context.lineTo(width * (0.2 + phase * 0.25), baseline);
          context.bezierCurveTo(
            x - radius,
            baseline,
            x - radius,
            y + radius * 0.5,
            width * 0.92,
            baseline,
          );
        } else {
          const baseline = (height * (i + 1)) / 13;
          context.moveTo(0, baseline);
          context.bezierCurveTo(
            x * 0.6,
            baseline,
            x * 0.8,
            baseline + (y - baseline) * (0.3 + energy * 0.15),
            x,
            baseline + energy * 12,
          );
          context.bezierCurveTo(
            x * 1.2,
            baseline + energy * 12,
            width * 0.85,
            baseline,
            width,
            baseline,
          );
        }
        context.stroke();
      }
      // The four material properties: aperture, signal, primary plane, historical echo.
      context.strokeStyle = `rgba(${cobalt},.16)`;
      context.lineWidth = Math.max(1, radius * 0.012);
      context.beginPath();
      context.arc(x, y, radius, Math.PI * 0.72, Math.PI * 1.95);
      context.stroke();
      context.fillStyle = dark ? "rgba(255,113,82,.38)" : "rgba(255,92,53,.4)";
      const sx = width * state.satellite.position.x,
        sy = height * state.satellite.position.y;
      context.beginPath();
      context.arc(sx, sy, 3 + energy * 4, 0, Math.PI * 2);
      context.fill();
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(
        devicePixelRatio || 1,
        matchMedia("(pointer: coarse)").matches ? 1 : 1.5,
      );
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      draw();
    });
    resize.observe(element);
    observer.observe(element);
    const unsubscribe = subscribe((value) => {
      state = value;
      draw();
    });
    return () => {
      unsubscribe();
      resize.disconnect();
      observer.disconnect();
      context.clearRect(0, 0, width, height);
    };
  }, [subscribe, material, theme, reduced, paused]);
  return (
    <div
      className={`harulo-environment environment-${material}`}
      aria-hidden="true"
      data-environment={material}
    >
      <svg
        className="environment-static"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 420H310C420 420 330 160 500 160S660 420 760 420H1000M0 445H340C450 445 370 210 500 210S630 445 790 445H1000"
          fill="none"
          stroke="currentColor"
        />
        <path d="M110 540H790M230 565H597" stroke="currentColor" />
      </svg>
      <canvas ref={canvas} />
    </div>
  );
}
