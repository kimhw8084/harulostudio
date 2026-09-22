"use client";
import { useEffect, useRef, type CSSProperties } from "react";
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
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !once.current) {
          once.current = true;
          play();
        }
      },
      { threshold: 0.55 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stageRef, play]);
  const pose = reduced || paused
    ? REST
    : interpolatePose(PAGE_COMPOSITION_POSE, REST, ease(progress));
  return (
    <div
      className="footer-return"
      ref={stageRef}
      data-systems="17 24"
      style={
        {
          "--return-progress":
            reduced || paused || progress === 0 ? 1 : progress,
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
      <button onClick={replay} aria-label="Replay mark assembly">
        Replay return
      </button>
    </div>
  );
}
