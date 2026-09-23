"use client";

import type { Product } from "@/lib/publishing/types";
import {
  DamiSpecimen,
  GoyoSpecimen,
  HaruWeatherSpecimen,
  NamuSpecimen,
  SoriSpecimen,
} from "./showcase";

/** Shared entry point retained for publication shells; product behavior lives in focused files. */
export function ApplicationInstrument({ kind, mode = "detail" }: { name: string; kind: Product["icon"]; mode?: "genesis" | "detail" }) {
  switch (kind) {
    case "sound": return <SoriSpecimen mode={mode} />;
    case "notes": return <NamuSpecimen mode={mode} />;
    case "focus": return <GoyoSpecimen mode={mode} />;
    case "weather": return <HaruWeatherSpecimen mode={mode} />;
    case "spending": return <DamiSpecimen mode={mode} />;
    case "planning": return <DamiSpecimen mode={mode} />;
  }
}
