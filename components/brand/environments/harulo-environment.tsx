"use client";

import { useEffect, useRef } from "react";
import { useBrandScene } from "../scene/brand-scene";
import { useExperience } from "@/components/experience-provider";
import { resolveChannels, quietScene, type SceneMaterial } from "@/lib/brand/scene";

/** Shared lifecycle, three deliberately different low-cost materials. */
export function HaruloEnvironment({ material = "flow" }: { material?: SceneMaterial }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useBrandScene();
  const { theme, reduced } = useExperience();
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d", { alpha: true });
    if (!element || !context || !scene?.subscribe || reduced) return;
    let width = 0;
    let height = 0;
    let active = false;
    let state = resolveChannels(quietScene);
    const palette = () => theme === "dark" ? { cobalt: "111,134,255", ember: "255,113,82" } : { cobalt: "18,61,255", ember: "255,92,53" };
    const drawFlow = () => {
      const { cobalt, ember } = palette();
      const ringX = width * state.ring.center.x;
      const ringY = height * state.ring.center.y;
      const radius = Math.min(width, height) * state.ring.radius;
      for (let stream = 0; stream < 10; stream += 1) {
        const baseline = height * (stream + 1) / 11;
        context.beginPath();
        context.moveTo(-40, baseline);
        let x = -40;
        let y = baseline;
        for (let step = 0; step < 18; step += 1) {
          x += (width + 80) / 18;
          const dy = (ringY - y) * Math.exp(-Math.pow((x - ringX) / (radius * 2.5), 2)) * 0.12;
          const pointer = state.satellite.target.y * 8 * Math.exp(-Math.pow((x - ringX) / (radius * 3), 2));
          y += dy + pointer;
          context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(${cobalt},${0.055 + stream % 3 * 0.018})`;
        context.lineWidth = stream === 5 ? 1.2 : 0.7;
        context.stroke();
      }
      context.strokeStyle = `rgba(${cobalt},.18)`;
      context.lineWidth = Math.max(1, radius * 0.018);
      context.beginPath();
      context.arc(ringX, ringY, radius, Math.PI * 0.18, Math.PI * 1.75);
      context.stroke();
      context.fillStyle = `rgba(${ember},${0.25 + state.satellite.energy * 0.5})`;
      context.beginPath();
      context.arc(width * state.satellite.position.x, height * state.satellite.position.y, 2.5 + state.satellite.energy * 5, 0, Math.PI * 2);
      context.fill();
    };
    const drawMembrane = () => {
      const { cobalt, ember } = palette();
      const ringX = width * state.ring.center.x;
      const ringY = height * state.ring.center.y;
      const radius = Math.min(width, height) * state.ring.radius;
      for (let row = 0; row <= 12; row += 1) {
        context.beginPath();
        for (let col = 0; col <= 20; col += 1) {
          const x = col / 20 * width;
          const y = row / 12 * height;
          const distance = Math.hypot(x - ringX, y - ringY);
          const tension = Math.max(0, 1 - distance / (radius * 3.8)) * 16 * (state.ring.focus + 0.25);
          const primary = Math.exp(-Math.pow((y - height * .58) / 42, 2)) * 8;
          const point = col === 0 ? context.moveTo.bind(context) : context.lineTo.bind(context);
          point(x, y + tension + primary);
        }
        context.strokeStyle = `rgba(${cobalt},${0.04 + row % 3 * 0.018})`;
        context.lineWidth = .7;
        context.stroke();
      }
      context.fillStyle = `rgba(${ember},${0.22 + state.satellite.energy * .4})`;
      context.beginPath();
      context.arc(width * state.satellite.position.x, height * state.satellite.position.y, 3 + state.satellite.energy * 4, 0, Math.PI * 2);
      context.fill();
    };
    const drawDayNext = () => {
      const { cobalt, ember } = palette();
      const progress = state.primaryTier.contentProgress;
      const railY = height * .42;
      context.lineWidth = 1;
      context.strokeStyle = `rgba(${cobalt},.16)`;
      context.beginPath();
      context.moveTo(width * .08, railY);
      context.lineTo(width * (.24 + progress * .64), railY);
      context.moveTo(width * .08, railY + 20);
      context.lineTo(width * (.18 + state.secondaryTier.extension * .72), railY + 20);
      context.stroke();
      context.fillStyle = `rgba(${ember},${0.25 + state.satellite.energy * .5})`;
      context.beginPath();
      context.arc(width * (.18 + progress * .62), railY, 3 + state.satellite.energy * 4, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = `rgba(${cobalt},.1)`;
      context.beginPath();
      context.arc(width * .5, height * .52, Math.min(width, height) * .18, Math.PI * .08, Math.PI * 1.86);
      context.stroke();
    };
    const draw = () => {
      if (!active || document.hidden || width <= 0 || height <= 0) return;
      context.clearRect(0, 0, width, height);
      if (material === "flow") drawFlow();
      else if (material === "membrane") drawMembrane();
      else drawDayNext();
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, matchMedia("(pointer: coarse)").matches ? 1 : 1.5);
      element.width = Math.max(1, Math.round(width * dpr));
      element.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; draw(); }, { rootMargin: "80px" });
    resize.observe(element);
    observer.observe(element);
    const unsubscribe = scene.subscribe((value) => { state = value; draw(); });
    const visibility = () => draw();
    document.addEventListener("visibilitychange", visibility);
    return () => { unsubscribe(); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); context.clearRect(0, 0, width, height); };
  }, [scene, material, theme, reduced]);
  return (
    <div className={`harulo-environment environment-${material}`} aria-hidden="true" data-environment={material}>
      <svg className="environment-static" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        {material === "flow" ? <path d="M0 420H310C420 420 330 160 500 160S660 420 760 420H1000M0 445H340C450 445 370 210 500 210S630 445 790 445H1000" fill="none" stroke="currentColor" /> : material === "membrane" ? <path d="M0 380H1000M0 420H1000M0 460H1000M420 0C470 180 470 520 420 700M580 0C530 180 530 520 580 700" fill="none" stroke="currentColor" /> : <><path d="M90 330H910M90 355H700" fill="none" stroke="currentColor" /><circle cx="500" cy="390" r="120" fill="none" stroke="currentColor" /></>}
      </svg>
      <canvas ref={canvas} />
    </div>
  );
}
