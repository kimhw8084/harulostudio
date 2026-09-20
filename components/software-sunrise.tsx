"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperience } from "./experience-provider";

/** A real, ephemeral browser interaction; never presented as a released product. */
export function SoftwareSunrise() {
  const { ready, paused, reduced } = useExperience();
  const frame = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [thought, setThought] = useState("");
  const [kept, setKept] = useState(false);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    if (paused || reduced) {
      el.style.setProperty("--day-progress", "0.5");
      return;
    }
    let raf = 0;
    let visible = false;
    const measure = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
      );
      el.style.setProperty("--day-progress", String(progress));
    };
    const update = () => {
      if (!raf && visible && !document.hidden)
        raf = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.dataset.inView = String(visible);
      update();
    });
    observer.observe(el);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, reduced]);
  function reset() {
    setKept(false);
    setThought("");
    requestAnimationFrame(() => input.current?.focus());
  }
  return (
    <div className="software-sunrise" ref={frame}>
      <div className="sunrise-coordinate metadata" aria-hidden="true">
        <span>FROM AN ORDINARY DAY</span>
        <span>↗</span>
      </div>
      <div className="solar-art" aria-hidden="true">
        <picture>
          <source
            srcSet="/images/daylight-640.webp 640w, /images/daylight-1122.webp 1122w"
            sizes="(max-width: 760px) 90vw, 45vw"
            type="image/webp"
          />
          <img
            src="/images/daylight.jpg"
            width="1122"
            height="1402"
            alt=""
            fetchPriority="high"
          />
        </picture>
        <span className="solar-horizon" />
      </div>
      <div className="study-window" data-kept={kept}>
        <div className="study-chrome">
          <span className="study-register" aria-hidden="true">
            ✳
          </span>
          <span>ONE SMALL THING</span>
          <span className="metadata">A HARULO STUDY</span>
        </div>
        <div className="study-body">
          <div className="study-heading">
            <Sun aria-hidden="true" />
            <span>Make a little room.</span>
          </div>
        <p>For one thing that matters today.</p>
        <noscript><p className="resource-note">Enable JavaScript to try this small study. Everything else is here to read and explore.</p></noscript>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (thought.trim()) setKept(true);
            }}
          >
            <label htmlFor="day-thought" className="sr-only">
              One thing for today
            </label>
            <Input
              ref={input}
              id="day-thought"
              value={thought}
              onChange={(e) => {
                setThought(e.target.value);
                setKept(false);
              }}
              placeholder="What’s on your mind?"
              maxLength={120}
              disabled={!ready}
              autoComplete="off"
            />
            <div className="study-action">
              <span className="study-note">Stays in this tab.</span>
              <Button
                type="submit"
                disabled={!ready || !thought.trim() || kept}
                className="study-submit"
              >
                {kept ? (
                  <Check aria-hidden="true" />
                ) : (
                  <ArrowUpRight aria-hidden="true" />
                )}
                {kept ? "In view" : "Keep in view"}
              </Button>
            </div>
          </form>
          <div className="study-result" role="status" aria-live="polite">
            {kept && (
              <>
                <span>{thought.trim()}</span>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Clear your thought"
                  onClick={reset}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="study-colophon">
          <span>A small interaction, made with care.</span>
          <span aria-hidden="true">하루로 ↗</span>
        </div>
      </div>
      <p className="study-caption">
        An interactive studio study. Not a released app.
      </p>
    </div>
  );
}
