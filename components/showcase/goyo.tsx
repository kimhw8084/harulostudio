"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShowcaseFoot, ShowcaseShell } from "./shared";

type TimerState = "ready" | "running" | "paused" | "complete";
const format = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

export function GoyoSpecimen() {
  const [minutes, setMinutes] = useState(15);
  const [intention, setIntention] = useState("");
  const [state, setState] = useState<TimerState>("ready");
  const [remaining, setRemaining] = useState(minutes * 60_000);
  const [quietMode, setQuietMode] = useState(false);
  const deadline = useRef<number | null>(null);
  useEffect(() => {
    if (state !== "running") return;
    const tick = () => {
      const next = Math.max(0, (deadline.current ?? Date.now()) - Date.now());
      setRemaining(next);
      if (next <= 0) {
        deadline.current = null;
        setState("complete");
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [state]);
  const choose = (value: number) => {
    setMinutes(value);
    setRemaining(value * 60_000);
    setState("ready");
    deadline.current = null;
  };
  const start = () => {
    if (state === "paused") deadline.current = Date.now() + remaining;
    else deadline.current = Date.now() + remaining;
    setState("running");
  };
  const pause = () => {
    setRemaining(Math.max(0, (deadline.current ?? Date.now()) - Date.now()));
    deadline.current = null;
    setState("paused");
  };
  const reset = () => {
    deadline.current = null;
    setState("ready");
    setRemaining(minutes * 60_000);
    setIntention("");
    setQuietMode(false);
  };
  return (
    <ShowcaseShell name="Goyo">
      <p className="concept-title">A calmer place for attention.</p>
      <label className="concept-label" htmlFor="goyo-intention">Today’s intention</label>
      <Input id="goyo-intention" value={intention} maxLength={120} onChange={(event) => setIntention(event.target.value)} placeholder="One small thing" />
      <div className="weather-switches" aria-label="Focus duration">
        {[5, 15, 25].map((value) => <Button key={value} type="button" variant="ghost" aria-pressed={minutes === value} disabled={state === "running"} onClick={() => choose(value)}>{value} min</Button>)}
      </div>
      <output className="focus-clock" aria-live="polite">{format(remaining)}</output>
      <p className="focus-state" role="status">
        {state === "running" ? "Focus is in progress." : state === "paused" ? "Paused. Your remaining time is held." : state === "complete" ? "Session complete. Take the next small step." : "Choose a length, then begin."}
      </p>
      <label className="checkbox-row">
        <input type="checkbox" checked={quietMode} onChange={(event) => setQuietMode(event.target.checked)} />
        Quiet mode (simulated)
      </label>
      <div className="instrument-actions">
        {state === "running" ? <Button type="button" onClick={pause}>Pause session</Button> : <Button type="button" onClick={start} disabled={state === "complete"}>Start session</Button>}
        <Button type="button" variant="ghost" onClick={() => { setRemaining(0); deadline.current = null; setState("complete"); }}>Preview completion</Button>
        <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
      </div>
      <ShowcaseFoot onReset={reset} />
    </ShowcaseShell>
  );
}
