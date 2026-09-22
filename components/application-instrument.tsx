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
export function ApplicationInstrument({ kind }: { name: string; kind: Product["icon"] }) {
  switch (kind) {
    case "sound": return <SoriSpecimen />;
    case "notes": return <NamuSpecimen />;
    case "focus": return <GoyoSpecimen />;
    case "weather": return <HaruWeatherSpecimen />;
    case "spending": return <DamiSpecimen />;
    case "planning": return <DamiSpecimen />;
  }
}
