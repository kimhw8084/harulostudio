"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
