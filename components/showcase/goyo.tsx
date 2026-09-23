"use client";

import { useEffect, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShowcaseFoot, ShowcaseShell } from "./shared";

type TimerState = "ready" | "running" | "paused" | "complete";
type FocusState = {
  phase: TimerState;
  durationMs: number;
  remainingMs: number;
  deadline: number | null;
  intention: string;
  quietMode: boolean;
};
type FocusAction =
  | { type: "SET_DURATION"; minutes: number }
  | { type: "SET_INTENTION"; value: string }
  | { type: "START"; now: number }
  | { type: "PAUSE"; now: number }
  | { type: "TICK"; now: number }
  | { type: "PREVIEW_COMPLETE" }
  | { type: "TOGGLE_QUIET"; value: boolean }
  | { type: "RESET" };

const durationFor = (minutes: number) => minutes * 60_000;

function focusReducer(state: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case "SET_DURATION": {
      const durationMs = durationFor(action.minutes);
      return { ...state, phase: "ready", durationMs, remainingMs: durationMs, deadline: null };
    }
    case "SET_INTENTION":
      return { ...state, intention: action.value };
    case "START":
      if (state.phase === "complete") return state;
      return { ...state, phase: "running", deadline: action.now + state.remainingMs };
    case "PAUSE": {
      if (state.phase !== "running") return state;
      const remainingMs = Math.max(0, (state.deadline ?? action.now) - action.now);
      return remainingMs === 0
        ? { ...state, phase: "complete", remainingMs: 0, deadline: null }
        : { ...state, phase: "paused", remainingMs, deadline: null };
    }
    case "TICK": {
      if (state.phase !== "running") return state;
      const remainingMs = Math.max(0, (state.deadline ?? action.now) - action.now);
      return remainingMs === 0
        ? { ...state, phase: "complete", remainingMs: 0, deadline: null }
        : { ...state, remainingMs };
    }
    case "PREVIEW_COMPLETE":
      return { ...state, phase: "complete", remainingMs: 0, deadline: null };
    case "TOGGLE_QUIET":
      return { ...state, quietMode: action.value };
    case "RESET":
      return {
        ...state,
        phase: "ready",
        remainingMs: state.durationMs,
        deadline: null,
        intention: "",
        quietMode: false,
      };
  }
}

const initialFocusState: FocusState = {
  phase: "ready",
  durationMs: durationFor(15),
  remainingMs: durationFor(15),
  deadline: null,
  intention: "",
  quietMode: false,
};

const format = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

export function GoyoSpecimen({ mode = "detail" }: { mode?: "genesis" | "detail" }) {
  const [state, dispatch] = useReducer(focusReducer, initialFocusState);
  useEffect(() => {
    if (state.phase !== "running") return;
    const id = window.setInterval(() => dispatch({ type: "TICK", now: Date.now() }), 250);
    return () => window.clearInterval(id);
  }, [state.phase]);
  const reset = () => dispatch({ type: "RESET" });
  return (
    <ShowcaseShell name="Goyo" kind="goyo" mode={mode}>
      <p className="concept-title">Focus session</p>
      <label className="concept-label" htmlFor="goyo-intention">Today’s intention</label>
      <Input id="goyo-intention" value={state.intention} maxLength={120} onChange={(event) => dispatch({ type: "SET_INTENTION", value: event.target.value })} placeholder="One small thing" />
      <div className="weather-switches" aria-label="Focus duration">
        {[5, 15, 25].map((value) => <Button key={value} type="button" variant="ghost" aria-pressed={state.durationMs === durationFor(value)} disabled={state.phase === "running"} onClick={() => dispatch({ type: "SET_DURATION", minutes: value })}>{value} min</Button>)}
      </div>
      <output className="focus-clock" aria-live="polite">{format(state.remainingMs)}</output>
      <p className="focus-state" role="status">
        {state.phase === "running" ? "Focus is in progress." : state.phase === "paused" ? "Paused. Your remaining time is held." : state.phase === "complete" ? "Session complete. Take the next small step." : "Choose a length, then begin."}
      </p>
      {mode === "detail" && <label className="checkbox-row">
        <input type="checkbox" checked={state.quietMode} onChange={(event) => dispatch({ type: "TOGGLE_QUIET", value: event.target.checked })} />
        Quiet mode (simulated)
      </label>}
      <div className="instrument-actions">
        {state.phase === "running" ? <Button type="button" onClick={() => dispatch({ type: "PAUSE", now: Date.now() })}>Pause session</Button> : <Button type="button" onClick={() => dispatch({ type: "START", now: Date.now() })} disabled={state.phase === "complete"}>Start session</Button>}
        {mode === "detail" && <Button type="button" variant="ghost" onClick={() => dispatch({ type: "PREVIEW_COMPLETE" })}>Preview completion</Button>}
      </div>
      {mode === "detail" && <ShowcaseFoot onReset={reset} />}
    </ShowcaseShell>
  );
}
