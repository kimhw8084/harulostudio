"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  const [publication, setPublication] = useState({
    title: "A little better, every day.",
    lines: [
      "HARULO STUDIO",
      "INDEPENDENT SOFTWARE PUBLISHER",
      "조금 더 나은 하루로.",
    ],
  });
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
    const title = document.querySelector("main h1")?.textContent?.trim();
    const lines = Array.from(document.querySelectorAll("main h2"))
      .slice(0, 4)
      .map((item) => item.textContent?.trim() || "");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !once.current) {
          if (title) setPublication({ title, lines });
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
        <strong>{publication.title}</strong>
        <div>
          {publication.lines.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      </div>
      <HaruloMark pose={pose} />
      <button onClick={replay} aria-label="Replay mark assembly">
        One day → next
      </button>
    </div>
  );
}
