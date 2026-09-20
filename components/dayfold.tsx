"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExperience } from "./experience-provider";

export function MinuteInstrument({
  onProgress,
}: {
  onProgress?: (remaining: number) => void;
}) {
  const instrument = useRef<HTMLDivElement>(null);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let inView = false;
    const tick = () => {
      const seconds = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(seconds);
      onProgress?.(seconds);
      if (!seconds) setRunning(false);
    };
    const visibility = () => {
      clearInterval(interval);
      if (!document.hidden && inView) {
        tick();
        interval = setInterval(tick, 250);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      visibility();
    });
    if (instrument.current) observer.observe(instrument.current);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [running, onProgress]);
  function toggle() {
    if (running) {
      setRemaining(
        Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
      );
      setRunning(false);
    } else {
      const seconds = remaining || 60;
      setRemaining(seconds);
      deadline.current = Date.now() + seconds * 1000;
      setRunning(true);
    }
  }
  function reset() {
    setRunning(false);
    setRemaining(60);
    onProgress?.(60);
  }
  return (
    <div className="minute-instrument" ref={instrument}>
      <p className="instrument-kicker">ONE MINUTE. ENTIRELY YOURS.</p>
      <div
        className="minute-clock"
        role="timer"
        aria-label={`${remaining} seconds remaining`}
      >
        {Math.floor(remaining / 60)
          .toString()
          .padStart(2, "0")}
        <span>:</span>
        {(remaining % 60).toString().padStart(2, "0")}
      </div>
      <p className="minute-message" role="status">
        {remaining === 0
          ? "A little space, made. Take it with you."
          : running
            ? "Nothing else needs you for this minute."
            : remaining < 60
              ? "Your minute can wait."
              : "No scores. No streaks. Just a little room."}
      </p>
      <div className="minute-actions">
        <Button onClick={toggle} className="instrument-button">
          {running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {running
            ? "Pause timer"
            : remaining < 60 && remaining > 0
              ? "Resume timer"
              : "Start minute"}
        </Button>
        <Button
          onClick={reset}
          variant="ghost"
          className="instrument-reset"
          aria-label="Reset minute"
        >
          <RotateCcw aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export function Dayfold() {
  const { ready, paused, reduced } = useExperience();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const frame = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let visible = false,
      raf = 0;
    const measure = () => {
      raf = 0;
      if (!visible || document.hidden || paused || reduced) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty(
        "--fold-scroll",
        String(
          Math.max(-1, Math.min(1, (innerHeight * 0.45 - r.top) / innerHeight)),
        ),
      );
    };
    const update = () => {
      if (!raf && visible && !document.hidden && !paused && !reduced)
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
    if (paused || reduced) el.style.setProperty("--fold-scroll", "0");
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, reduced]);
  return (
    <div className="dayfold" data-open={open} ref={frame}>
      <div className="fold-topline metadata">
        <span>H / EXPERIMENT 001</span>
        <span>
          {open ? "APPLICATION" : "PUBLICATION"}{" "}
          <span aria-hidden="true">↗</span>
        </span>
      </div>
      <div className="fold-stage">
        <div className="fold-poster" aria-hidden="true">
          <span className="fold-poster-top">
            A DAY.
            <br />
            UNFOLDED.
          </span>
          <span className="fold-poster-number">
            24
            <span>
              HOURS.
              <br />
              ENDLESS
              <br />
              POSSIBILITY.
            </span>
          </span>
          <span className="fold-poster-korean" lang="ko">
            하루로
          </span>
        </div>
        <svg
          className="fold-object"
          viewBox="0 0 1000 600"
          preserveAspectRatio={open ? "xMidYMax meet" : "xMidYMid meet"}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`${id}-surface`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#b5cf3b" />
              <stop offset=".47" stopColor="#e8ff61" />
              <stop offset=".5" stopColor="#f8ffbf" />
              <stop offset=".505" stopColor="#849b21" />
              <stop offset="1" stopColor="#e8ff61" />
            </linearGradient>
          </defs>
          <g className="fold-orientation">
            <g className="fold-breath">
              {Array.from({ length: 24 }, (_, i) => (
                <rect
                  key={i}
                  className="fold-slat"
                  x="270"
                  y="293"
                  width="460"
                  height="14"
                  rx="1"
                  fill={`url(#${id}-surface)`}
                  data-spent={open && i >= Math.ceil((remaining / 60) * 24)}
                  style={
                    {
                      "--shift": `${(i - 11.5) * 17}px`,
                      "--width": Math.sqrt(1 - Math.pow((i - 11.5) / 12, 2)),
                      "--column": `${(i - 11.5) * 35}px`,
                      "--length": 0.19 + (i % 4) * 0.028,
                      "--order": i,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          </g>
        </svg>
        <div id={id} className="fold-application" hidden={!open}>
          {open && <MinuteInstrument onProgress={setRemaining} />}
        </div>
      </div>
      <div className="fold-bottomline">
        <p>
          {open
            ? "A working studio experiment. Not a released product."
            : "Good software changes what a day can be."}
        </p>
        <Button
          className="fold-trigger"
          disabled={!ready}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setOpen(!open);
            setRemaining(60);
          }}
        >
          {open ? "Fold it back" : "Open the day"}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
      <noscript>
        <p className="fold-noscript">
          The Dayfold is an interactive studio experiment. Enable JavaScript to
          open its one-minute focus timer.
        </p>
      </noscript>
    </div>
  );
}
