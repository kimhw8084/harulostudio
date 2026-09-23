"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Moon, Sun } from "lucide-react";
import { migrateTheme, type Theme } from "@/lib/brand/themes";
import { Button } from "@/components/ui/button";

type Preferences = {
  ready: boolean;
  theme: Theme;
  reduced: boolean;
  setTheme: (v: Theme) => void;
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
    };
    const visibility = () => {
      document.documentElement.dataset.pageVisible = String(!document.hidden);
    };
    syncTheme();
    syncMotion();
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
    document.documentElement.dataset.motion = reduced ? "paused" : "running";
    document.documentElement.dataset.enhanced = "true";
  }, [ready, theme, reduced]);
  return (
    <Context.Provider
      value={{
        ready,
        theme,
        reduced,
        setTheme(v) {
          manualTheme.current = v;
          write("harulo-theme", v);
          setTheme(v);
          window.dispatchEvent(new CustomEvent("harulo:theme-change", { detail: v }));
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
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
    </Button>
  );
}
