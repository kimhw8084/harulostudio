"use client";
import { useId, useState, type CSSProperties } from "react";
import { Minus, Plus, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/lib/publishing/types";
import { useExperience } from "./experience-provider";

export function ApplicationInstrument({
  name,
  kind,
}: {
  name: string;
  kind: Product["icon"];
}) {
  const { ready } = useExperience();
  const id = useId();
  const [levels, setLevels] = useState([64, 28, 45]);
  const [muted, setMuted] = useState(false);
  const [day, setDay] = useState(0);
  const [period, setPeriod] = useState(0);
  const [plan, setPlan] = useState([false, false, false]);
  const [notes, setNotes] = useState(["A walk. A thought. A beginning."]);
  const [draft, setDraft] = useState("");
  const [focusLength, setFocusLength] = useState(15);
  const [focusState, setFocusState] = useState<"ready" | "active" | "complete">("ready");
  function volume(index: number, delta: number) {
    setLevels((values) =>
      values.map((v, i) =>
        i === index ? Math.max(0, Math.min(100, v + delta)) : v,
      ),
    );
    setMuted(false);
  }
  return (
    <div
      className="concept-interface"
      role="group"
      aria-label={`${name} showcase interface concept`}
    >
      <div className="concept-chrome">
        <span className="window-register" aria-hidden="true">
          ↗
        </span>
        <span>{name}</span>
        <span className="metadata">INTERACTIVE CONCEPT</span>
      </div>
      {kind === "sound" ? (
        <div className="concept-body">
          <p className="concept-title">
            Your sound.
            <br />
            Your say.
          </p>
          {["Music", "Browser", "System"].map((channel, i) => (
            <div className="mixer-row" key={channel}>
              <span>{channel}</span>
              <div className="mixer-control">
                <Button
                  disabled={!ready}
                  aria-label={`Decrease ${channel} volume`}
                  variant="ghost"
                  onClick={() => volume(i, -5)}
                >
                  <Minus size={14} />
                </Button>
                <div className="mixer-track" aria-hidden="true">
                  <span style={{ width: `${muted ? 0 : levels[i]}%` }} />
                </div>
                <Button
                  disabled={!ready}
                  aria-label={`Increase ${channel} volume`}
                  variant="ghost"
                  onClick={() => volume(i, 5)}
                >
                  <Plus size={14} />
                </Button>
              </div>
              <output aria-label={`${channel} volume`}>
                {muted ? 0 : levels[i]}%
              </output>
            </div>
          ))}
          <div className="concept-foot">
            <span>STUDIO SPEAKERS / STEREO</span>
            <Button
              disabled={!ready}
              variant="ghost"
              aria-pressed={muted}
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}Quiet mode
            </Button>
          </div>
        </div>
      ) : kind === "notes" ? (
        <div className="concept-body">
          <label className="concept-label" htmlFor={id}>
            TODAY / A THOUGHT IN PROGRESS
          </label>
          <Textarea
            id={id}
            className="note-editor"
            aria-label="Try a Namu note"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={1200}
          />
          <div className="instrument-actions">
            <Button disabled={!ready || !draft.trim()} onClick={() => { setNotes((items) => [...items, draft.trim()]); setDraft(""); }}>
              Add note
            </Button>
            <Button variant="ghost" disabled={!ready || notes.length === 0} onClick={() => setNotes((items) => items.slice(0, -1))}>
              Remove last
            </Button>
          </div>
          <ul className="specimen-items" aria-label="Namu notes">
            {notes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}
          </ul>
          <div className="concept-foot">
            <span>{notes.length} NOTE{notes.length === 1 ? "" : "S"} IN THIS SESSION</span>
            <span>LOCAL ONLY</span>
          </div>
        </div>
      ) : kind === "focus" ? (
        <div className="concept-body">
          <p className="concept-title">Make a little room.</p>
          <div className="weather-switches" aria-label="Focus length">
            {[5, 15, 25].map((minutes) => (
              <Button key={minutes} variant="ghost" disabled={!ready || focusState === "active"} aria-pressed={focusLength === minutes} onClick={() => setFocusLength(minutes)}>
                {minutes} min
              </Button>
            ))}
          </div>
          <p className="focus-state" role="status">
            {focusState === "active" ? `${focusLength} minute focus session in progress.` : focusState === "complete" ? "Session complete. Take the next small step." : "Choose a length, then begin."}
          </p>
          <div className="instrument-actions">
            <Button disabled={!ready} onClick={() => setFocusState(focusState === "active" ? "ready" : "active")}>
              {focusState === "active" ? "Pause session" : "Start session"}
            </Button>
            <Button variant="ghost" disabled={!ready} onClick={() => setFocusState("complete")}>Complete demo</Button>
          </div>
          <div className="concept-foot"><span>NO SCORE / NO STREAK</span><span>LOCAL ONLY</span></div>
        </div>
      ) : kind === "weather" ? (
        <div className="concept-body">
          <div className="weather-switches" aria-label="Example forecast day">
            {["Morning", "Afternoon", "Evening"].map((d, i) => (
              <Button
                variant="ghost"
                key={d}
                disabled={!ready}
                aria-pressed={day === i}
                onClick={() => setDay(i)}
              >
                {d}
              </Button>
            ))}
          </div>
          <div className="weather-row">
            <p className="weather-temperature">{day === 0 ? "17°" : day === 1 ? "24°" : "19°"}</p>
            <p>
              {day === 0 ? "Clear and cool." : day === 1 ? "A little sun." : "Rain after 18:00."}<br />A whole day ahead.
            </p>
          </div>
          <div className="weather-graph" aria-hidden="true">
            {[24, 32, 45, 58, 71, 67, 59, 43, 37, 30, 26, 19].map(
              (height, i) => (
                <span
                  key={i}
                  style={
                    {
                      "--bar": `${day ? 85 - height : height}%`,
                    } as CSSProperties
                  }
                />
              ),
            )}
          </div>
          <div className="concept-foot">
            <span>{["COMMUTE / 08:10", "RAIN / 18:00", "AIR / CLEAR"][day]}</span>
            <span>LOCAL EXAMPLE</span>
          </div>
        </div>
      ) : kind === "spending" ? (
        <div className="concept-body">
          <div
            className="weather-switches"
            aria-label="Example spending period"
          >
            {["September", "August"].map((p, i) => (
              <Button
                variant="ghost"
                key={p}
                disabled={!ready}
                aria-pressed={period === i}
                onClick={() => setPeriod(i)}
              >
                {p}
              </Button>
            ))}
          </div>
          <span className="concept-label">THE EVERYDAY, ADDED UP.</span>
          <p className="spending-amount">
            {period === 0 ? "$284" : "$312"}
            <span>.00</span>
          </p>
          <p>A clear view of the small things.</p>
          <div className="concept-foot">
            <span>{period === 0 ? "FOOD / TRAVEL / HOME" : "FOOD / HOME / OTHER"}</span>
            <span>LOCAL EXAMPLE</span>
          </div>
        </div>
      ) : (
        <div className="concept-body">
          <p className="concept-title">
            Tomorrow,
            <br />
            with room to move.
          </p>
          {[
            "Make something useful",
            "Step outside",
            "Leave a little unplanned",
          ].map((task, i) => (
            <label className="plan-row" key={task}>
              <Checkbox
                disabled={!ready}
                checked={plan[i]}
                onCheckedChange={(checked) =>
                  setPlan((p) =>
                    p.map((v, j) => (i === j ? checked === true : v)),
                  )
                }
              />
              <span>{task}</span>
            </label>
          ))}
          <div className="concept-foot">
            <span>{plan.filter(Boolean).length} / 3 IN VIEW</span>
            <span>THIS TAB ONLY</span>
          </div>
        </div>
      )}
      <noscript>
        <p className="concept-noscript">
          This is a showcase publication concept. Interactive controls require
          JavaScript.
        </p>
      </noscript>
    </div>
  );
}
