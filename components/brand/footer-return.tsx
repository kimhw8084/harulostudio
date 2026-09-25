"use client";

import { useEffect, useRef, useState } from "react";
import { brandCopy } from "@/lib/brand/copy";
import { ease, interpolatePose, motion, REST, type BrandPose } from "@/lib/brand/motion";
import { useExperience } from "@/components/experience-provider";
import { HaruloMark } from "./harulo-mark";

// Both poses live within this SVG. No page element can supply mark geometry.
const SOURCE: BrandPose = {
  ring: { x: 15, y: 24, width: 70, height: 38, rx: 19, strokeWidth: 3 },
  satellite: { cx: 85, cy: 21, r: 4.35 },
  primary: { x: 14, y: 72, width: 72, height: 4, rx: 2 },
  secondary: { x: 14, y: 82, width: 39, height: 3, rx: 1.5 },
};

export function FooterReturn() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { reduced } = useExperience();
  useEffect(() => {
    const node = section.current;
    if (!node || reduced) return;
    let frame = 0;
    let started = 0;
    let elapsed = 0;
    let complete = false;
    // The visual harness can hold the local SOURCE pose before its section enters view.
    // The flag is set before hydration and released with a single event.
    let held = Boolean((window as Window & { __HARULO_TEST_HOLD_RETURN__?: boolean }).__HARULO_TEST_HOLD_RETURN__);
    const tick = (time: number) => {
      frame = 0;
      if (document.hidden) { started = 0; return; }
      if (!started) started = time;
      elapsed = Math.min(motion.finalReturn, elapsed + time - started);
      started = time;
      setProgress(elapsed / motion.finalReturn);
      if (elapsed < motion.finalReturn) frame = requestAnimationFrame(tick);
      else complete = true;
    };
    const visible = () => {
      if (!held && !document.hidden && !complete && node.getBoundingClientRect().top < innerHeight && !frame) frame = requestAnimationFrame(tick);
    };
    const release = () => { held = false; visible(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !held && !complete && !frame) frame = requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    observer.observe(node);
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("harulo:test-return-release", release);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visible); window.removeEventListener("harulo:test-return-release", release); cancelAnimationFrame(frame); };
  }, [reduced]);
  const value = reduced ? 1 : progress;
  return <section className="home-final-return" ref={section} aria-label="Harulo closing signature" data-complete={value >= 1} data-progress={value.toFixed(3)}>
    <div><p className="eyebrow">TODAY / TOWARD</p><h2>{brandCopy.closing}</h2></div>
    <HaruloMark pose={value >= 1 ? REST : interpolatePose(SOURCE, REST, ease(value))} title="Harulo Studio" />
  </section>;
}
