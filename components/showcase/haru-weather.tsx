"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { ShowcaseFoot, ShowcaseShell } from "./shared";

const locations = {
  Seoul: {
    Morning: [17, 12, 8, 6, 4, 3], Afternoon: [23, 25, 24, 22, 20, 18], Evening: [19, 18, 17, 16, 15, 14],
  },
  Busan: {
    Morning: [19, 18, 17, 16, 15, 15], Afternoon: [26, 27, 26, 25, 23, 22], Evening: [22, 21, 20, 19, 18, 18],
  },
  Portland: {
    Morning: [11, 12, 13, 13, 14, 14], Afternoon: [18, 19, 20, 20, 19, 18], Evening: [15, 14, 13, 12, 11, 10],
  },
} as const;
type Location = keyof typeof locations;
type Period = keyof (typeof locations)[Location];

export function HaruWeatherSpecimen() {
  const [location, setLocation] = useState<Location>("Seoul");
  const [period, setPeriod] = useState<Period>("Morning");
  const [commute, setCommute] = useState("08:10–09:00");
  const values = locations[location][period];
  const rain = values.map((value, index) => (location === "Seoul" && period === "Evening" ? 55 + index * 4 : (value + index * 3) % 38));
  const summary = useMemo(() => `${values[0]}° → ${values[values.length - 1]}° · ${Math.max(...rain)}% rain chance`, [values, rain]);
  const reset = () => { setLocation("Seoul"); setPeriod("Morning"); setCommute("08:10–09:00"); };
  return (
    <ShowcaseShell name="Haru Weather">
      <p className="concept-title">The day you are about to have.</p>
      <p className="showcase-note">Fictional sample forecasts. No live weather or location access.</p>
      <div className="weather-switches" aria-label="Saved example locations">
        {(Object.keys(locations) as Location[]).map((name) => <Button key={name} type="button" variant="ghost" aria-pressed={location === name} onClick={() => setLocation(name)}>{name}</Button>)}
      </div>
      <div className="weather-switches" aria-label="Day period">
        {(["Morning", "Afternoon", "Evening"] as Period[]).map((value) => <Button key={value} type="button" variant="ghost" aria-pressed={period === value} onClick={() => setPeriod(value)}>{value}</Button>)}
      </div>
      <label className="showcase-select-label" htmlFor="commute-window">Commute window</label>
      <select id="commute-window" value={commute} onChange={(event) => setCommute(event.target.value)}><option>08:10–09:00</option><option>12:00–12:45</option><option>18:00–18:45</option></select>
      <p className="weather-row"><strong>{summary}</strong><span>Commute {commute} · {period === "Evening" ? "Rain after 18:00." : "A clear window."}</span></p>
      <table className="showcase-table"><caption>Hourly fictional sample for {location}, {period}</caption><thead><tr><th scope="col">Hour</th>{values.map((_, i) => <th scope="col" key={i}>{i + 7}:00</th>)}</tr></thead><tbody><tr><th scope="row">Temperature</th>{values.map((value, i) => <td key={i}>{value}°</td>)}</tr><tr><th scope="row">Rain</th>{rain.map((value, i) => <td key={i}>{value}%</td>)}</tr></tbody></table>
      <div className="weather-graph" role="img" aria-label={`${summary}. Temperature bars are paired with the table below.`}>{values.map((value, i) => <span key={i} style={{ "--bar": `${Math.max(10, value * 3)}%` } as CSSProperties} />)}</div>
      <ShowcaseFoot onReset={reset} />
    </ShowcaseShell>
  );
}
