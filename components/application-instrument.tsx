"use client";
import { useId, useState, type CSSProperties } from "react";
import { Minus, Plus, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/lib/publishing/types";
import { MinuteInstrument } from "./dayfold";
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
      aria-label={`${name} fictional interface concept`}
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
            defaultValue={
              "Good things take root.\n\nA walk. A thought. A beginning."
            }
            maxLength={1200}
          />
          <div className="concept-foot">
            <span>WRITE HERE. MAKE IT YOURS.</span>
            <span>NOT SAVED OR SENT</span>
          </div>
        </div>
      ) : kind === "focus" ? (
        <MinuteInstrument />
      ) : kind === "weather" ? (
        <div className="concept-body">
          <div className="weather-switches" aria-label="Example forecast day">
            {["Today", "Tomorrow"].map((d, i) => (
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
            <p className="weather-temperature">{day === 0 ? "24°" : "21°"}</p>
            <p>
              A little {day === 0 ? "sun" : "rain"}.<br />A whole day ahead.
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
            <span>{day === 0 ? "A CLEAR AFTERNOON" : "RAIN AFTER 16:00"}</span>
            <span>EXAMPLE FORECAST</span>
          </div>
        </div>
      ) : kind === "spending" ? (
        <div className="concept-body">
          <div
            className="weather-switches"
            aria-label="Example spending period"
          >
            {["This week", "Last week"].map((p, i) => (
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
            <span>FOOD / TRAVEL / THE REST</span>
            <span>EXAMPLE DATA</span>
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
          This is a fictional product concept. Interactive controls require
          JavaScript.
        </p>
      </noscript>
    </div>
  );
}
