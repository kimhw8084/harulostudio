"use client";

import { useEffect, useState } from "react";
import { roundTwoIdentities, type Identity } from "@/lib/identity/geometry";
import { IdentityVector } from "./identity-vector";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const rubric = [
  ["silhouette", "Silhouette", "Can I recognize the outline immediately?"],
  ["reconstruction", "Reconstruction", "Could I roughly draw it from memory?"],
  ["small", "Small size", "Does it stay clear at 16px?"],
  ["distinctive", "Distinctiveness", "Does it feel specific enough to own?"],
  [
    "hangul",
    "Hangul connection",
    "Is the Korean origin meaningful without overload?",
  ],
  ["motion", "Motion potential", "Can these few parts become useful forms?"],
  ["containment", "Containment", "Does it feel balanced inside a square?"],
];
const reviewKey = "harulo-identity-lab-round2-review";
export function RoundTwoBoard({
  selected,
  onInspect,
}: {
  selected: Identity;
  onInspect: (id: Identity) => void;
}) {
  const [review, setReview] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(reviewKey) || "{}");
        if (saved && typeof saved === "object" && !Array.isArray(saved)) {
          setReview(
            Object.fromEntries(
              Object.entries(saved).filter(
                ([key, value]) =>
                  typeof value === "string" &&
                  roundTwoIdentities.some((i) => key.startsWith(`${i.id}:`)),
              ),
            ) as Record<string, string>,
          );
        }
      } catch {
        setStorageAvailable(false);
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(reviewKey, JSON.stringify(review));
    } catch {
      /* Visit-only evaluation remains usable. */
    }
  }, [review, ready]);
  const update = (key: string, value: string) =>
    setReview((r) => ({ ...r, [key]: value }));
  return (
    <section className="round-two-board" aria-labelledby="round-two-title">
      <header className="round-two-intro">
        <div>
          <span className="lab-index">ROUND 2 — HANGUL × GEOMETRY</span>
          <h2 id="round-two-title">What stays in your mind?</h2>
          <p>Five marks. One ink. No movement. Start with the silhouette.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setCovered((v) => !v)}
          aria-pressed={covered}
          disabled={!ready}
        >
          {covered ? "Show the marks" : "Hide for memory test"}
        </Button>
      </header>
      <div className="static-candidates" data-covered={covered}>
        {roundTwoIdentities.map((candidate) => (
          <article
            className="static-candidate"
            key={candidate.id}
            data-candidate={candidate.id}
            data-selected={candidate.id === selected}
          >
            <header>
              <span>
                {candidate.code} /{" "}
                {candidate.primitives === 1
                  ? "ONE CONTINUOUS PATH"
                  : `${candidate.primitives} PRIMARY ELEMENTS`}
              </span>
              <h3>{candidate.name}</h3>
            </header>
            <div className="static-candidate-display">
              <IdentityVector
                identity={candidate.id}
                compact
                label={`${candidate.name} monochrome static mark`}
              />
              {covered && (
                <span className="memory-cover">
                  What would you draw?<small>{candidate.name}</small>
                </span>
              )}
            </div>
            <div
              className="candidate-size-ruler"
              aria-label={`${candidate.name} size tests`}
            >
              {[16, 24, 32, 48, 96].map((size) => (
                <figure key={size}>
                  <div style={{ width: size, height: size }}>
                    <IdentityVector
                      identity={candidate.id}
                      compact
                      label={`${candidate.name} at ${size} pixels`}
                    />
                  </div>
                  <figcaption>{size}px</figcaption>
                </figure>
              ))}
            </div>
            <figure className="candidate-reverse">
              <IdentityVector identity={candidate.id} compact />
              <figcaption>REVERSED / ONE INK</figcaption>
            </figure>
            <p>{candidate.anatomy}</p>
            <Button
              variant="outline"
              onClick={() => onInspect(candidate.id)}
              disabled={!ready}
            >
              Explore {candidate.name} ↗
            </Button>
            <details className="candidate-rubric">
              <summary>Memory & meaning / your review</summary>
              <p>
                No automatic scores. Judge each question after seeing the static
                and moving forms.
              </p>
              {rubric.map(([key, title, question]) => (
                <label key={key}>
                  <strong>{title}</strong>
                  <span>{question}</span>
                  <NativeSelect
                    aria-label={`${candidate.name}: ${title}`}
                    value={review[`${candidate.id}:${key}`] || ""}
                    disabled={!ready}
                    onChange={(e) =>
                      update(`${candidate.id}:${key}`, e.target.value)
                    }
                  >
                    <NativeSelectOption value="">
                      Not reviewed
                    </NativeSelectOption>
                    <NativeSelectOption value="strong">
                      Strong
                    </NativeSelectOption>
                    <NativeSelectOption value="revisit">
                      Revisit
                    </NativeSelectOption>
                    <NativeSelectOption value="unsure">
                      Unsure
                    </NativeSelectOption>
                  </NativeSelect>
                </label>
              ))}
              <label>
                <strong>What stayed with you?</strong>
                <textarea
                  rows={3}
                  aria-label={`${candidate.name}: review notes`}
                  value={review[`${candidate.id}:notes`] || ""}
                  disabled={!ready}
                  onChange={(e) =>
                    update(`${candidate.id}:notes`, e.target.value)
                  }
                />
              </label>
            </details>
          </article>
        ))}
      </div>
      <p className="round-review-note">
        {storageAvailable
          ? "Your observations stay in this browser. They do not approve or rank a candidate."
          : "Browser storage is unavailable. Your observations are available for this visit."}
      </p>
      <section
        className="round-family-board"
        aria-labelledby="round-family-title"
      >
        <header>
          <span className="lab-index">
            SIX PRODUCTS / FIVE CONSTRUCTION LANGUAGES
          </span>
          <h2 id="round-family-title">Can one mark become a family?</h2>
          <p>Fictional product studies, all in the same ink.</p>
        </header>
        {roundTwoIdentities.map((candidate) => (
          <div className="round-family-row" key={candidate.id}>
            <h3>
              {candidate.code}
              <span>{candidate.name}</span>
            </h3>
            {["Sori", "Namu", "Goyo", "Haru Weather", "Dami", "Morrow"].map(
              (name, i) => (
                <figure key={name}>
                  <IdentityVector
                    identity={candidate.id}
                    product={i}
                    compact
                    label={`${candidate.name}: ${name} product mark`}
                  />
                  <figcaption>{name}</figcaption>
                </figure>
              ),
            )}
          </div>
        ))}
      </section>
    </section>
  );
}
