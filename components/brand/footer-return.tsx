"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { HaruloMark } from "./harulo-mark";
import { useBrandMotion } from "./use-brand-motion";
import {
  REST,
  ease,
  interpolatePose,
  motion,
  type BrandPose,
} from "@/lib/brand/motion";

const PAGE_COMPOSITION_POSE: BrandPose = {
  ring: { x: 14, y: 18, width: 72, height: 52, rx: 26, strokeWidth: 3.4 },
  satellite: { cx: 82, cy: 18, r: 3.2 },
  primary: { x: 12, y: 76, width: 76, height: 4, rx: 2 },
  secondary: { x: 12, y: 86, width: 41, height: 3, rx: 1.5 },
};

export type PageBrandDescriptor = {
  pageId: string;
  title: string;
  metadata: string[];
  anchors: { aperture?: string; primary?: string; secondary?: string; signal?: string };
};

export function FooterReturn({ descriptor }: { descriptor: PageBrandDescriptor }) {
  const {
    ref: stageRef,
    play,
    replay,
    progress,
    reduced,
    paused,
  } = useBrandMotion(motion.orbit);
  const once = useRef(false);
  const measureRef = useRef<() => void>(() => undefined);
  const [sourcePose, setSourcePose] = useState<BrandPose>(PAGE_COMPOSITION_POSE);
  const [anchorsMeasured, setAnchorsMeasured] = useState(false);
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measureAnchors = () => {
      const stageRect = node.getBoundingClientRect();
      if (!stageRect.width || !stageRect.height) return;
      const rectFor = (key: keyof PageBrandDescriptor["anchors"]) => {
        const id = descriptor.anchors[key];
        return id ? document.getElementById(id)?.getBoundingClientRect() ?? null : null;
      };
      const toRing = (rect: DOMRect | null) => rect
        ? { x: ((rect.left - stageRect.left) / stageRect.width) * 100, y: ((rect.top - stageRect.top) / stageRect.height) * 100, width: (rect.width / stageRect.width) * 100, height: (rect.height / stageRect.height) * 100, rx: Math.min(rect.width, rect.height) / stageRect.width * 50, strokeWidth: 3.4 }
        : PAGE_COMPOSITION_POSE.ring;
      const toTier = (rect: DOMRect | null, fallback: BrandPose["primary"]) => rect
        ? { x: ((rect.left - stageRect.left) / stageRect.width) * 100, y: ((rect.top - stageRect.top) / stageRect.height) * 100, width: (rect.width / stageRect.width) * 100, height: Math.max(1, (rect.height / stageRect.height) * 100), rx: 1 }
        : fallback;
      const signal = rectFor("signal");
      setSourcePose({
        ring: toRing(rectFor("aperture")),
        primary: toTier(rectFor("primary"), PAGE_COMPOSITION_POSE.primary),
        secondary: toTier(rectFor("secondary"), PAGE_COMPOSITION_POSE.secondary),
        satellite: signal
          ? { cx: ((signal.left + signal.width / 2 - stageRect.left) / stageRect.width) * 100, cy: ((signal.top + signal.height / 2 - stageRect.top) / stageRect.height) * 100, r: Math.min(6, Math.max(2, signal.width / stageRect.width * 50)) }
          : PAGE_COMPOSITION_POSE.satellite,
      });
      setAnchorsMeasured(true);
    };
    measureRef.current = measureAnchors;
    measureAnchors();
    const resize = new ResizeObserver(measureAnchors);
    resize.observe(node);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !once.current) {
          measureAnchors();
          once.current = true;
          requestAnimationFrame(() => play());
        }
      },
      { threshold: 0.55 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      resize.disconnect();
      if (measureRef.current === measureAnchors) measureRef.current = () => undefined;
    };
  }, [stageRef, play, descriptor]);
  const pose = reduced || paused
    ? REST
    : interpolatePose(sourcePose, REST, ease(progress));
  return (
    <div
      className="footer-return"
      ref={stageRef}
      id="footer-return-stage"
      data-systems="17 24"
      data-page={descriptor.pageId}
      data-anchors-measured={anchorsMeasured}
      data-complete={reduced || paused || progress >= 1}
      style={
        {
          "--return-progress": reduced || paused ? 1 : progress,
        } as CSSProperties
      }
    >
      <div className="return-publication" aria-hidden="true">
        <strong>{descriptor.title}</strong>
        <div>
          {descriptor.metadata.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
      <HaruloMark pose={pose} />
      <span className="return-signal-anchor" aria-hidden="true" />
      <p className="return-closing">{descriptor.title}</p>
      {!reduced && !paused && <button onClick={() => { measureRef.current(); requestAnimationFrame(() => replay()); }} aria-label="Replay mark assembly">Replay return</button>}
    </div>
  );
}
