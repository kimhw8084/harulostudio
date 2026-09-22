"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Pause, Play } from "lucide-react";
import { HaruloMark } from "@/components/brand/harulo-mark";
import { migrateTheme, type Theme } from "@/lib/brand/themes";
import { Button } from "@/components/ui/button";

type Preferences = {
  ready: boolean;
  theme: Theme;
  paused: boolean;
  reduced: boolean;
  setTheme: (v: Theme) => void;
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
  const [theme, setTheme] = useState<Theme>("light");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const manualTheme = useRef<string | null>(null);
  /* eslint-disable react-hooks/set-state-in-effect -- Read external browser preferences once after deterministic SSR hydration. No render-derived state or update loop. */
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    manualTheme.current = migrateTheme(read("harulo-theme"));
    const syncTheme = () =>
      setTheme(
        manualTheme.current
          ? (manualTheme.current as Theme)
          : scheme.matches
            ? "dark"
            : "light",
      );
    const syncMotion = () => setReduced(motion.matches);
    const syncStorage = (e: StorageEvent) => {
      if (e.key === "harulo-theme" || e.key === null) {
        manualTheme.current = migrateTheme(read("harulo-theme"));
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
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.motion =
      paused || reduced ? "paused" : "running";
    document.documentElement.dataset.enhanced = "true";
  }, [ready, theme, paused, reduced]);
  return (
    <Context.Provider
      value={{
        ready,
        theme,
        paused,
        reduced,
        setTheme(v) {
          manualTheme.current = v;
          write("harulo-theme", v);
          setTheme(v);
          window.dispatchEvent(new CustomEvent("harulo:theme-change", { detail: v }));
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
  const { ready, theme, setTheme } = useExperience();
  return (
    <Button
      className="theme-button control-button"
      variant="ghost"
      type="button"
      disabled={!ready}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <HaruloMark key={theme} className="theme-orbit" />
      <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
    </Button>
  );
}
export function MotionControl() {
  const { ready, paused, reduced, setPaused } = useExperience();
  const preferenceId = useId();
  return (
    <div className="motion-tools">
      <Button
        className="motion-button control-button"
        variant="ghost"
        type="button"
        disabled={!ready || reduced}
        onClick={() => setPaused(!paused)}
        aria-describedby={reduced ? preferenceId : undefined}
      >
        {paused || reduced ? (
          <Play aria-hidden="true" />
        ) : (
          <Pause aria-hidden="true" />
        )}
        {reduced ? "Motion reduced" : paused ? "Resume motion" : "Pause motion"}
      </Button>
      {reduced && (
        <span className="metadata" id={preferenceId}>
          Following your device preference.
        </span>
      )}
    </div>
  );
}
