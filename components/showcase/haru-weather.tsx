"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { ShowcaseFoot, ShowcaseShell } from "./shared";

export type WeatherPoint = { hour: string; temperature: number; rain: number };
const points = (hours: number[], temperatures: number[], rain: number[]): WeatherPoint[] =>
  hours.map((hour, index) => ({ hour: `${String(hour).padStart(2, "0")}:00`, temperature: temperatures[index], rain: rain[index] }));
const locations = {
  Seoul: {
    Morning: points([7, 8, 9, 10, 11, 12], [17, 18, 20, 21, 22, 23], [12, 10, 8, 6, 5, 4]),
    Afternoon: points([12, 13, 14, 15, 16, 17], [23, 25, 24, 22, 20, 18], [4, 8, 12, 17, 21, 25]),
    Evening: points([17, 18, 19, 20, 21, 22], [19, 18, 17, 16, 15, 14], [42, 55, 61, 58, 49, 44]),
  },
  Busan: {
    Morning: points([7, 8, 9, 10, 11, 12], [19, 20, 21, 22, 23, 24], [24, 22, 18, 15, 12, 10]),
    Afternoon: points([12, 13, 14, 15, 16, 17], [26, 27, 26, 25, 23, 22], [8, 10, 13, 16, 18, 20]),
    Evening: points([17, 18, 19, 20, 21, 22], [22, 21, 20, 19, 18, 18], [20, 25, 29, 32, 28, 24]),
  },
  Portland: {
    Morning: points([7, 8, 9, 10, 11, 12], [11, 12, 13, 13, 14, 14], [48, 52, 46, 40, 35, 31]),
    Afternoon: points([12, 13, 14, 15, 16, 17], [18, 19, 20, 20, 19, 18], [30, 28, 25, 22, 24, 27]),
    Evening: points([17, 18, 19, 20, 21, 22], [15, 14, 13, 12, 11, 10], [35, 39, 44, 48, 51, 54]),
  },
} as const;
type Location = keyof typeof locations;
type Period = keyof (typeof locations)[Location];

export function HaruWeatherSpecimen({ mode = "detail" }: { mode?: "genesis" | "detail" }) {
  const [location, setLocation] = useState<Location>("Seoul");
  const [period, setPeriod] = useState<Period>("Morning");
  const [commute, setCommute] = useState("08:10–09:00");
  const weather = locations[location][period];
  const summary = useMemo(() => `${weather[0].temperature}° → ${weather[weather.length - 1].temperature}° · ${Math.max(...weather.map((point) => point.rain))}% rain chance`, [weather]);
  const commuteHour = Number.parseInt(commute.slice(0, 2), 10);
  const commutePoint = weather.reduce((nearest, point) => Math.abs(Number.parseInt(point.hour, 10) - commuteHour) < Math.abs(Number.parseInt(nearest.hour, 10) - commuteHour) ? point : nearest, weather[0]);
  const commuteMessage = commutePoint.rain >= 40 ? `Rain is most likely near ${commutePoint.hour}.` : `A clearer window near ${commutePoint.hour}.`;
  const reset = () => { setLocation("Seoul"); setPeriod("Morning"); setCommute("08:10–09:00"); };
  return (
    <ShowcaseShell name="Haru Weather" kind="haru-weather" mode={mode}>
      <p className="concept-title">Forecast window</p>
      <p className="showcase-note">Fictional sample forecasts. No live weather or location access.</p>
      <div className="weather-switches" aria-label="Saved example locations">
        {(Object.keys(locations) as Location[]).map((name) => <Button key={name} type="button" variant="ghost" aria-pressed={location === name} onClick={() => setLocation(name)}>{name}</Button>)}
      </div>
      <div className="weather-switches" aria-label="Day period">
        {(["Morning", "Afternoon", "Evening"] as Period[]).map((value) => <Button key={value} type="button" variant="ghost" aria-pressed={period === value} onClick={() => setPeriod(value)}>{value}</Button>)}
      </div>
      <label className="showcase-select-label" htmlFor="commute-window">Commute window</label>
      <select id="commute-window" value={commute} onChange={(event) => setCommute(event.target.value)}><option>08:10–09:00</option><option>12:00–12:45</option><option>18:00–18:45</option></select>
      <p className="weather-row"><strong>{summary}</strong><span>Commute {commute} · {commuteMessage}</span></p>
      {mode === "detail" && <><div className="showcase-table-scroll" role="region" aria-label="Hourly weather table" tabIndex={0}><table className="showcase-table"><caption>Hourly fictional sample for {location}, {period}</caption><thead><tr><th scope="col">Hour</th>{weather.map((point) => <th scope="col" key={point.hour}>{point.hour}</th>)}</tr></thead><tbody><tr><th scope="row">Temperature</th>{weather.map((point) => <td key={point.hour}>{point.temperature}°</td>)}</tr><tr><th scope="row">Rain</th>{weather.map((point) => <td key={point.hour}>{point.rain}%</td>)}</tr></tbody></table></div>
      <div className="weather-graph" role="img" aria-label={`${summary}. Temperature bars are paired with the table above.`}>{weather.map((point) => <span key={point.hour} style={{ "--bar": `${Math.max(10, point.temperature * 3)}%` } as CSSProperties}><small>{point.hour}</small></span>)}</div>
      <ShowcaseFoot onReset={reset} /></>}
    </ShowcaseShell>
  );
}
