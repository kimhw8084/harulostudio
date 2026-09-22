"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShowcaseFoot, ShowcaseShell, clampInt } from "./shared";

type Channel = {
  id: string;
  label: string;
  level: number;
  muted: boolean;
  remembered: number;
};

const initial: Channel[] = [
  { id: "music", label: "Music", level: 64, muted: false, remembered: 64 },
  { id: "browser", label: "Browser", level: 28, muted: false, remembered: 28 },
  { id: "system", label: "System", level: 45, muted: false, remembered: 45 },
];

export function SoriSpecimen() {
  const [channels, setChannels] = useState(initial.map((item) => ({ ...item })));
  const [output, setOutput] = useState("Studio speakers");
  const [quiet, setQuiet] = useState(false);
  const reset = () => {
    setChannels(initial.map((item) => ({ ...item })));
    setOutput("Studio speakers");
    setQuiet(false);
  };
  const updateChannel = (id: string, updater: (channel: Channel) => Channel) => {
    setChannels((items) => items.map((item) => (item.id === id ? updater(item) : item)));
  };
  const toggleMute = (id: string) => {
    updateChannel(id, (channel) => channel.muted
      ? { ...channel, muted: false, level: channel.remembered }
      : { ...channel, muted: true, remembered: channel.level });
  };
  return (
    <ShowcaseShell name="Sori">
      <p className="concept-title">A little more control.</p>
      <p className="showcase-note">Audio behavior is simulated; this does not control operating-system audio.</p>
      {channels.map((channel) => (
        <div className="mixer-row" key={channel.id}>
          <label htmlFor={`sori-${channel.id}`}>{channel.label}</label>
          <input
            id={`sori-${channel.id}`}
            type="range"
            min="0"
            max="100"
            value={channel.muted || quiet ? 0 : channel.level}
            aria-valuetext={`${channel.muted || quiet ? 0 : channel.level}%`}
            onChange={(event) => {
              const value = clampInt(Number(event.target.value), 0, 100);
              updateChannel(channel.id, (item) => ({ ...item, level: value, remembered: value, muted: false }));
            }}
          />
          <output htmlFor={`sori-${channel.id}`}>{channel.muted || quiet ? 0 : channel.level}%</output>
          <Button
            type="button"
            variant="ghost"
            aria-pressed={channel.muted}
            aria-label={`${channel.muted ? "Unmute" : "Mute"} ${channel.label}`}
            onClick={() => toggleMute(channel.id)}
          >
            {channel.muted ? "Unmute" : "Mute"}
          </Button>
        </div>
      ))}
      <label className="showcase-select-label" htmlFor="sori-output">Output device (example)</label>
      <select id="sori-output" value={output} onChange={(event) => setOutput(event.target.value)}>
        <option>Studio speakers</option>
        <option>Reading headphones</option>
        <option>Display audio</option>
      </select>
      <label className="check-row"><input type="checkbox" checked={quiet} onChange={(event) => setQuiet(event.target.checked)} /> Quiet mode (temporary)</label>
      <ShowcaseFoot onReset={reset} />
    </ShowcaseShell>
  );
}
