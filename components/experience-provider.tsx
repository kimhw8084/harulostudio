"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Moon, Pause, Play, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Preferences = {
  ready: boolean;
  evening: boolean;
  paused: boolean;
  reduced: boolean;
  setEvening: (v: boolean) => void;
  setPaused: (v: boolean) => void;
};
const Context = createContext<Preferences | null>(null);
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* The choice still applies to this visit. */
  }
}
export function useExperience() {
  const value = useContext(Context);
  if (!value) throw new Error("ExperienceProvider is required");
  return value;
}

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [evening, setEvening] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const manualTheme = useRef<string | null>(null);
  /* eslint-disable react-hooks/set-state-in-effect -- Read external browser preferences once after deterministic SSR hydration. No render-derived state or update loop. */
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    manualTheme.current = read("harulo-theme");
    const syncTheme = () =>
      setEvening(
        manualTheme.current
          ? manualTheme.current === "evening"
          : scheme.matches,
      );
    const syncMotion = () => setReduced(motion.matches);
    const syncStorage = (e: StorageEvent) => {
      if (e.key === "harulo-theme" || e.key === null) {
        manualTheme.current = read("harulo-theme");
        syncTheme();
      }
      if (e.key === "harulo-motion" || e.key === null)
        setPaused(read("harulo-motion") === "paused");
    };
    const visibility = () => {
      document.documentElement.dataset.pageVisible = String(!document.hidden);
    };
    syncTheme();
    syncMotion();
    setPaused(read("harulo-motion") === "paused");
    setReady(true);
    visibility();
    motion.addEventListener("change", syncMotion);
    scheme.addEventListener("change", syncTheme);
    window.addEventListener("storage", syncStorage);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", syncMotion);
      scheme.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", syncStorage);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = evening ? "evening" : "daylight";
    document.documentElement.dataset.motion =
      paused || reduced ? "paused" : "running";
    document.documentElement.dataset.enhanced = "true";
  }, [ready, evening, paused, reduced]);
  return (
    <Context.Provider
      value={{
        ready,
        evening,
        paused,
        reduced,
        setEvening(v) {
          manualTheme.current = v ? "evening" : "daylight";
          write("harulo-theme", v ? "evening" : "daylight");
          setEvening(v);
        },
        setPaused(v) {
          write("harulo-motion", v ? "paused" : "running");
          setPaused(v);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function ThemeControl() {
  const { ready, evening, setEvening } = useExperience();
  return (
    <Button
      className="theme-button control-button"
      variant="ghost"
      type="button"
      disabled={!ready}
      aria-label="Evening theme"
      aria-pressed={evening}
      onClick={() => setEvening(!evening)}
    >
      {evening ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
      <span>{evening ? "Evening" : "Daylight"}</span>
    </Button>
  );
}
export function MotionControl() {
  const { ready, paused, reduced, setPaused } = useExperience();
  return (
    <div className="motion-tools">
      <Button
        className="motion-button control-button"
        variant="ghost"
        type="button"
        disabled={!ready || reduced}
        onClick={() => setPaused(!paused)}
        aria-describedby={reduced ? "motion-preference" : undefined}
      >
        {paused || reduced ? (
          <Play aria-hidden="true" />
        ) : (
          <Pause aria-hidden="true" />
        )}
        {reduced ? "Motion reduced" : paused ? "Resume motion" : "Pause motion"}
      </Button>
      {reduced && (
        <span className="metadata" id="motion-preference">
          Following your device preference.
        </span>
      )}
    </div>
  );
}
