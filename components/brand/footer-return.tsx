"use client";
import { useEffect, useRef } from "react";
import { HaruloMark } from "./harulo-mark";
import { useBrandMotion } from "./use-brand-motion";
import {
  REST,
  ease,
  interpolatePose,
  motion,
  studyById,
} from "@/lib/brand/motion";

export function FooterReturn() {
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
  const pose =
    reduced || paused || progress === 0 || progress >= 1
      ? REST
      : interpolatePose(studyById("closure").target, REST, ease(progress));
  return (
    <div className="footer-return" ref={stageRef}>
      <HaruloMark pose={pose} />
      <button onClick={replay} aria-label="Replay mark assembly">
        One day → next
      </button>
    </div>
  );
}
