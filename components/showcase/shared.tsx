"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useExperience } from "@/components/experience-provider";

export function ShowcaseShell({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const { ready } = useExperience();
  return (
    <div className="concept-interface" role="group" aria-label={`${name} interactive concept`}>
      <div className="concept-chrome">
        <span className="window-register" aria-hidden="true">↗</span>
        <strong>{name}</strong>
        <span className="metadata">SIMULATED / LOCAL</span>
      </div>
      <fieldset disabled={!ready} className="concept-body showcase-fieldset">
        {children}
      </fieldset>
    </div>
  );
}

export function ShowcaseFoot({ onReset }: { onReset: () => void }) {
  return (
    <div className="concept-foot showcase-foot">
      <span>Changes stay on this page and reset on reload.</span>
      <Button type="button" variant="ghost" onClick={onReset}>Reset</Button>
    </div>
  );
}

export const clampInt = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value)));

export function formatMoney(minor: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(minor / 100);
}
