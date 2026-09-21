"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/publishing/types";
import { useExperience } from "./experience-provider";
export function ExtendedInstrument({ product }: { product: Product }) {
  const { ready } = useExperience();
  const [text, setText] = useState("A small thing worth keeping."),
    [items, setItems] = useState(["A thoughtful detail", "A useful reference"]),
    [state, setState] = useState("Ready"),
    [choice, setChoice] = useState(0),
    [left, setLeft] = useState('{"theme":"light","volume":64}'),
    [right, setRight] = useState('{"theme":"dark","volume":72}');
  const kind = product.specimen;
  const compare = () => {
    try {
      const a = JSON.parse(left),
        b = JSON.parse(right);
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
      setState(
        keys
          .filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]))
          .map(
            (k) =>
              `${k}: ${JSON.stringify(a[k]) ?? "absent"} → ${JSON.stringify(b[k]) ?? "absent"}`,
          )
          .join("\n") || "No changes.",
      );
    } catch {
      setState("Invalid JSON. Check both documents before comparing.");
    }
  };
  return (
    <div
      className="concept-interface extended-instrument"
      role="group"
      aria-label={`${product.name} fictional interface concept`}
    >
      <div className="concept-chrome">
        <span className="ember-point" />
        <strong>{product.name}</strong>
        <span className="metadata">LOCAL SPECIMEN</span>
      </div>
      <fieldset disabled={!ready} className="concept-body">
        {kind === "diff" ? (
          <>
            <p className="concept-title">What changed?</p>
            <div className="diff-inputs">
              <label>
                Earlier
                <Textarea
                  aria-label="Earlier"
                  value={left}
                  onChange={(e) => setLeft(e.target.value)}
                />
              </label>
              <label>
                Later
                <Textarea
                  aria-label="Later"
                  value={right}
                  onChange={(e) => setRight(e.target.value)}
                />
              </label>
            </div>
            <Button onClick={compare}>Compare documents</Button>
          </>
        ) : kind === "transfer" ? (
          <>
            <p className="concept-title">A small handoff.</p>
            <div className="device-choices">
              {["Studio Mac", "Reading tablet"].map((name, i) => (
                <Button
                  key={name}
                  variant="outline"
                  aria-pressed={choice === i}
                  onClick={() => {
                    setChoice(i);
                    setState("Ready");
                  }}
                >
                  {name}
                </Button>
              ))}
            </div>
            <p>Field notes.md · 24 KB · example file</p>
            <Button
              onClick={() =>
                setState(
                  state === "Awaiting receiver approval"
                    ? `Example transfer received by ${choice ? "Reading tablet" : "Studio Mac"}. No file was sent.`
                    : "Awaiting receiver approval",
                )
              }
            >
              {state === "Awaiting receiver approval"
                ? "Approve example transfer"
                : "Request handoff"}
            </Button>
          </>
        ) : kind === "backup" ? (
          <>
            <p className="concept-title">A way back.</p>
            <div className="device-choices">
              {["March 12", "March 19"].map((v, i) => (
                <Button
                  variant="outline"
                  key={v}
                  aria-pressed={choice === i}
                  onClick={() => {
                    setChoice(i);
                    setState("Ready");
                  }}
                >
                  {v}
                </Button>
              ))}
            </div>
            <p>{choice ? "243" : "238"} example files · manifest available</p>
            <Button
              onClick={() =>
                setState(
                  state.startsWith("Manifest")
                    ? "Example restore completed in a new folder. No files were written."
                    : "Manifest verified. Ready to preview restoration.",
                )
              }
            >
              {state.startsWith("Manifest")
                ? "Preview restore"
                : "Verify manifest"}
            </Button>
          </>
        ) : (
          <>
            <p className="concept-title">
              {kind === "reading"
                ? "Beside the words."
                : kind === "capture"
                  ? "Catch the thought."
                  : "Keep it close."}
            </p>
            {kind === "reading" && (
              <blockquote>
                “A little better, every day.”
                <cite>Harulo Studio · brand philosophy</cite>
              </blockquote>
            )}
            <label>
              {kind === "reading" ? "Your margin note" : "A new item"}
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={200}
              />
            </label>
            <Button
              disabled={!text.trim()}
              onClick={() => {
                setItems([...items, text.trim()]);
                setText("");
                setState("Added to this session only.");
              }}
            >
              Add {kind === "reading" ? "annotation" : "to shelf"}
            </Button>
            <ul className="specimen-items">
              {items.map((item, i) => (
                <li key={`${item}-${i}`}>
                  <span>{item}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${item}`}
                    onClick={() => setItems(items.filter((_, j) => i !== j))}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
        <output className="instrument-output" aria-live="polite">
          {state}
        </output>
        <div className="concept-foot">
          FICTIONAL SOFTWARE / NOTHING SAVED OR SENT
        </div>
      </fieldset>
    </div>
  );
}
