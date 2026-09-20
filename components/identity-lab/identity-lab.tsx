"use client";
import Link from "@/components/site-link";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, Bookmark, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { BrandContext } from "@/components/brand-slot";
import {
  identities,
  transformations,
  identityReel,
  type Identity,
} from "@/lib/identity/geometry";
import {
  palettes,
  paletteStyle,
  contrastChecks,
  type Palette,
} from "@/lib/identity/palettes";
import {
  IdentityImprint,
  IdentityVector,
  IdentityWordmark,
} from "./identity-vector";
import { TransformationPlayer } from "./transformation-player";
import { LabContext, LabSiteFooter, LabSiteHeader } from "./lab-context";
import "./identity-lab.css";

type Selection = {
  identity: Identity;
  palette: string;
  variants: Record<Identity, string>;
};
type Pin = { identity: Identity; palette: string; variant: string };
const defaults: Selection = {
  identity: "hangul",
  palette: "01",
  variants: { hangul: "HF-01", horizon: "HC-01", aperture: "SA-01" },
};
const storageKey = "harulo-identity-lab-v1";
const contexts = [
  ["home", "Complete homepage"],
  ["hero", "Hero"],
  ["software", "Product catalog"],
  ["edition", "Product edition"],
  ...["sori", "namu", "goyo", "haru-weather", "dami", "morrow"].map(
    (slug, i) => [
      `software/${slug}`,
      `Product · ${["Sori", "Namu", "Goyo", "Haru Weather", "Dami", "Morrow"][i]}`,
    ],
  ),
  ["releases", "Release archive"],
  ["releases/sori/4.8.2", "Release · Sori 4.8.2"],
  ["support", "Support center"],
  ["support/namu", "Support · Namu"],
  ["privacy/sori", "Privacy example"],
  ["press", "Press & imprints"],
  ["archive", "Lifecycle states"],
  ["social", "Social cards"],
  ["empty", "No products yet"],
  ["mobile", "Mobile header"],
  ["favicon", "Favicon simulation"],
  ["loading", "Loading state"],
  ["transition", "Page transition"],
];
function validSelection(value: unknown): Selection {
  if (!value || typeof value !== "object") return defaults;
  const saved = value as Partial<Selection>;
  const identity = identities.some((i) => i.id === saved.identity)
    ? saved.identity!
    : defaults.identity;
  const palette = palettes.some((p) => p.id === saved.palette)
    ? saved.palette!
    : "01";
  const variants = { ...defaults.variants };
  for (const candidate of identities) {
    const id = saved.variants?.[candidate.id];
    if (
      id &&
      (id === "REEL" || transformations(candidate.id).some((t) => t.id === id))
    )
      variants[candidate.id] = id;
  }
  return { identity, palette, variants };
}
function PaletteSwatches({ palette }: { palette: Palette }) {
  return (
    <span className="palette-swatches" aria-hidden="true">
      {palette.colors.map((c) => (
        <i key={c} style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

export function IdentityLab({
  children,
  context = "home",
  initialWebsite = false,
}: {
  children: ReactNode;
  context?: string;
  initialWebsite?: boolean;
}) {
  const [selection, setSelection] = useState<Selection>(defaults),
    [ready, setReady] = useState(false),
    [tab, setTab] = useState(initialWebsite ? "website" : "motion");
  const [pins, setPins] = useState<Pin[]>([]),
    [storageAvailable, setStorageAvailable] = useState(true),
    [message, setMessage] = useState("");
  useEffect(() => {
    // Hydrate browser-only review preferences after the server composition is attached.
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
        setSelection(validSelection(saved?.selection));
        if (Array.isArray(saved?.pins))
          setPins(
            saved.pins
              .filter(
                (p: Pin) =>
                  identities.some((i) => i.id === p.identity) &&
                  palettes.some((v) => v.id === p.palette) &&
                  (p.variant === "REEL" ||
                    transformations(p.identity).some(
                      (v) => v.id === p.variant,
                    )),
              )
              .slice(0, 4),
          );
      } catch {
        setStorageAvailable(false);
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ selection, pins }));
    } catch {
      frame = requestAnimationFrame(() => setStorageAvailable(false));
    }
    return () => cancelAnimationFrame(frame);
  }, [selection, pins, ready]);
  const { identity } = selection,
    currentIdentity = identities.find((i) => i.id === identity)!;
  const palette = palettes.find((p) => p.id === selection.palette)!;
  const variants = useMemo(() => transformations(identity), [identity]);
  const transformation =
    selection.variants[identity] === "REEL"
      ? identityReel(identity)
      : variants.find((t) => t.id === selection.variants[identity])!;
  const chooseTransformation = (id: string) =>
    setSelection((s) => ({
      ...s,
      variants: { ...s.variants, [identity]: id },
    }));
  const renderBrand = useMemo(
    () =>
      function ReviewBrand(product?: string) {
        return (
          <IdentityVector
            identity={identity}
            compact
            product={
              product
                ? [
                    "sound",
                    "notes",
                    "focus",
                    "weather",
                    "spending",
                    "planning",
                  ].indexOf(product)
                : undefined
            }
            className="fold-mark"
          />
        );
      },
    [identity],
  );
  const pin = () => {
    const p = { identity, palette: palette.id, variant: transformation.id };
    setPins((all) =>
      [p, ...all.filter((v) => JSON.stringify(v) !== JSON.stringify(p))].slice(
        0,
        4,
      ),
    );
    setMessage(
      "Combination pinned for review. No production identity changed.",
    );
  };
  return (
    <div className="identity-lab" data-ready={ready}>
      <Link className="lab-skip" href="#lab-workspace">
        Skip review controls
      </Link>
      <header className="lab-toolbar">
        <div className="lab-title">
          <span className="lab-index">H / INTERNAL RESEARCH</span>
          <h1>
            Permanent Identity Lab<span>Harulo Studio / 하루로</span>
          </h1>
          <p>Three living identities. Ten color worlds. Your decision.</p>
        </div>
        <div className="lab-environment">
          <span>
            <i />
            DEVELOPMENT ONLY
          </span>
          <Link href="/">
            Current Harulo <ArrowUpRight />
          </Link>
          <small>
            Fictional publisher content
            <br />
            No identity has been finalized.
          </small>
        </div>
      </header>
      <div className="lab-controls">
        <fieldset className="identity-picker">
          <legend>01 / Identity</legend>
          <RadioGroup
            value={identity}
            onValueChange={(id) =>
              setSelection((s) => ({ ...s, identity: id as Identity }))
            }
            className="identity-options"
            disabled={!ready}
            aria-label="Identity system"
          >
            {identities.map((candidate) => (
              <label
                key={candidate.id}
                className={`identity-option ${candidate.id === identity ? "selected" : ""}`}
              >
                <RadioGroupItem value={candidate.id} />
                <IdentityVector identity={candidate.id} compact />
                <span>
                  <b>
                    {candidate.code} / {candidate.name}
                  </b>
                  <small>{candidate.premise}</small>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
        <div className="lab-quick-selectors">
          <label>
            <span>02 / Color world</span>
            <NativeSelect
              value={palette.id}
              onChange={(e) =>
                setSelection((s) => ({ ...s, palette: e.target.value }))
              }
              disabled={!ready}
              aria-label="Color system"
            >
              {palettes.map((p) => (
                <NativeSelectOption value={p.id} key={p.id}>
                  {p.id} — {p.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <PaletteSwatches palette={palette} />
          </label>
          <label>
            <span>03 / Website context</span>
            <NativeSelect
              value={context}
              onChange={(e) => {
                window.location.href = `/preview/identity-lab/${e.target.value}`;
              }}
              aria-label="Website context"
              disabled={!ready}
            >
              {contexts.map(([path, name]) => (
                <NativeSelectOption key={path} value={path}>
                  {name}
                </NativeSelectOption>
              ))}
              {!contexts.some(([path]) => path === context) && (
                <NativeSelectOption value={context}>
                  Current document / {context}
                </NativeSelectOption>
              )}
            </NativeSelect>
            <small>Real routes. Shared publishing architecture.</small>
          </label>
        </div>
      </div>
      <div className="lab-review-strip">
        <div>
          <span>CURRENT REVIEW COMBINATION</span>
          <strong>
            {currentIdentity.name} <i>/</i> {transformation.id} <i>/</i>{" "}
            {palette.name}
          </strong>
        </div>
        <Button variant="outline" onClick={pin} disabled={!ready}>
          <Bookmark />
          Pin combination
        </Button>
      </div>
      {pins.length > 0 && (
        <div className="lab-pins" aria-label="Pinned combinations">
          {pins.map((p, i) => (
            <div key={`${p.identity}-${p.palette}-${p.variant}`}>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelection((s) => ({
                    ...s,
                    identity: p.identity,
                    palette: p.palette,
                    variants: { ...s.variants, [p.identity]: p.variant },
                  }));
                  setMessage("Pinned combination restored.");
                }}
              >
                {i + 1}. {identities.find((v) => v.id === p.identity)!.name} /{" "}
                {p.variant} / {palettes.find((v) => v.id === p.palette)!.name}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Remove pinned combination ${i + 1}`}
                onClick={() => setPins((all) => all.filter((_, n) => n !== i))}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      <p className="lab-status" role="status">
        {message ||
          (!storageAvailable
            ? "Browser storage is unavailable. Your choices work for this visit but may not persist."
            : "Selections are saved only in this browser’s identity lab. Production is unchanged.")}
      </p>
      <noscript>
        <p className="lab-noscript">
          JavaScript is off. The initial Hangul Flow mark and publishing layout
          remain readable. Enable JavaScript to compare identities, inspect
          transformations and save review choices.
        </p>
      </noscript>
      <LabContext.Provider value={{ identity, palette, transformation }}>
        <BrandContext.Provider value={renderBrand}>
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="lab-workspace"
            id="lab-workspace"
            tabIndex={-1}
          >
            <TabsList aria-label="Review workspace">
              <TabsTrigger value="motion" disabled={!ready}>
                Motion studio <span>18</span>
              </TabsTrigger>
              <TabsTrigger value="website" disabled={!ready}>
                In the website
              </TabsTrigger>
              <TabsTrigger value="compare" disabled={!ready}>
                Compare
              </TabsTrigger>
              <TabsTrigger value="specimens" disabled={!ready}>
                Static & scale
              </TabsTrigger>
              <TabsTrigger value="colors" disabled={!ready}>
                Color systems <span>10</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="motion">
              <div className="motion-workspace">
                <aside className="transformation-index">
                  <div>
                    <span className="lab-index">
                      {currentIdentity.code} / MOTION GRAMMAR
                    </span>
                    <h2>{currentIdentity.name}</h2>
                    <p>{currentIdentity.anatomy}</p>
                  </div>
                  <label className="mobile-transformation-select">
                    Transformation
                    <NativeSelect
                      aria-label="Mobile transformation"
                      value={transformation.id}
                      onChange={(e) => chooseTransformation(e.target.value)}
                    >
                      {variants.map((t) => (
                        <NativeSelectOption value={t.id} key={t.id}>
                          {t.id} / {t.name}
                        </NativeSelectOption>
                      ))}
                      <NativeSelectOption value="REEL">
                        Connected identity reel / 19s
                      </NativeSelectOption>
                    </NativeSelect>
                  </label>
                  <RadioGroup
                    aria-label="Transformation"
                    value={transformation.id}
                    onValueChange={chooseTransformation}
                  >
                    {variants.map((t) => (
                      <label
                        className={`transformation-option ${t.id === transformation.id ? "selected" : ""}`}
                        key={t.id}
                      >
                        <RadioGroupItem value={t.id} />
                        <span>
                          <b>{t.id}</b>
                          <strong>{t.name}</strong>
                          <small>{t.purpose}</small>
                        </span>
                      </label>
                    ))}
                    <label
                      className={`transformation-option reel-option ${transformation.id === "REEL" ? "selected" : ""}`}
                    >
                      <RadioGroupItem value="REEL" />
                      <span>
                        <b>CONNECTED REEL / 19s</b>
                        <strong>The living identity</strong>
                        <small>
                          Identity → software → publication → identity
                        </small>
                      </span>
                    </label>
                  </RadioGroup>
                </aside>
                <div className="motion-main">
                  <div
                    className="lab-color-world"
                    style={paletteStyle(palette)}
                    data-palette={palette.id}
                  >
                    <TransformationPlayer
                      identity={identity}
                      transformation={transformation}
                    />
                  </div>
                  <div className="transformation-explanation">
                    <span>{transformation.id} / CONTINUITY</span>
                    <h3>{transformation.name}</h3>
                    <p>{transformation.continuity}</p>
                    <p className="lab-small">
                      Every path retains its piece index. Scrub slowly to follow
                      the construction. Static states are available even when
                      motion is disabled.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="website">
              <div className="lab-site-caption">
                <span>REPRESENTATIVE WEBSITE / {context.toUpperCase()}</span>
                <span>
                  All products and releases below are fictional design data.
                </span>
              </div>
              <div
                className="lab-site lab-color-world"
                style={paletteStyle(palette)}
                data-palette={palette.id}
                data-identity={identity}
              >
                <LabSiteHeader />
                {children}
                <LabSiteFooter />
              </div>
            </TabsContent>
            <TabsContent value="compare">
              <Comparison identity={identity} palette={palette} />
            </TabsContent>
            <TabsContent value="specimens">
              <Specimens identity={identity} palette={palette} />
            </TabsContent>
            <TabsContent value="colors">
              <section className="palette-workspace">
                <div className="lab-section-intro">
                  <span>10 SYSTEMS / INDEPENDENT OF IDENTITY</span>
                  <h2>
                    Choose a world.
                    <br />
                    Not just an accent.
                  </h2>
                  <p>
                    Each palette controls surfaces, type, actions, metadata,
                    focus, states and the publisher environment.
                  </p>
                </div>
                <RadioGroup
                  value={palette.id}
                  onValueChange={(id) =>
                    setSelection((s) => ({ ...s, palette: id }))
                  }
                  className="palette-options"
                  aria-label="Palette gallery"
                >
                  {palettes.map((p) => (
                    <label
                      key={p.id}
                      className={`palette-option ${p.id === palette.id ? "selected" : ""}`}
                    >
                      <RadioGroupItem value={p.id} />
                      <span className="palette-option-copy">
                        <b>
                          {p.id} / {p.name}
                        </b>
                        <small>{p.character}</small>
                      </span>
                      <PaletteSwatches palette={p} />
                    </label>
                  ))}
                </RadioGroup>
                <ColorProof identity={identity} palette={palette} />
              </section>
            </TabsContent>
          </Tabs>
        </BrandContext.Provider>
      </LabContext.Provider>
      <footer className="lab-footer">
        <span>HARULO / PERMANENT IDENTITY RESEARCH</span>
        <span>3 systems · 18 transformations · 10 color worlds</span>
        <p>
          Review only. A pinned combination is not approval or a production
          setting.
        </p>
        <Button
          variant="ghost"
          onClick={() => {
            setSelection(defaults);
            setMessage("Review controls reset. Pinned combinations retained.");
          }}
        >
          <RotateCcw />
          Reset review controls
        </Button>
      </footer>
    </div>
  );
}

function Comparison({
  identity,
  palette,
}: {
  identity: Identity;
  palette: Palette;
}) {
  const [mode, setMode] = useState("identities"),
    [second, setSecond] = useState("02"),
    [third, setThird] = useState("03");
  const [active, setActive] = useState<number | null>(null);
  const worlds =
    mode === "identities"
      ? identities.map((i) => ({ identity: i.id, palette }))
      : [
          palette,
          palettes.find((p) => p.id === second)!,
          palettes.find((p) => p.id === third)!,
        ].map((p) => ({ identity, palette: p }));
  return (
    <section className="comparison-workspace">
      <div className="lab-section-intro">
        <span>THREE AT A TIME / THE USEFUL COMPARISON</span>
        <h2>Hold one thing steady.</h2>
        <p>
          Compare construction in the same light, or the same identity in three
          different worlds.
        </p>
      </div>
      <div className="comparison-controls">
        <label>
          Comparison
          <NativeSelect
            aria-label="Comparison mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <NativeSelectOption value="identities">
              Same palette / three identities
            </NativeSelectOption>
            <NativeSelectOption value="palettes">
              Same identity / three palettes
            </NativeSelectOption>
          </NativeSelect>
        </label>
        {mode === "palettes" && (
          <>
            {[
              [second, setSecond, "Second"],
              [third, setThird, "Third"],
            ].map(([value, setter, label]) => (
              <label key={label as string}>
                {label as string} palette
                <NativeSelect
                  aria-label={`${label} comparison palette`}
                  value={value as string}
                  onChange={(e) =>
                    (setter as (v: string) => void)(e.target.value)
                  }
                >
                  {palettes.map((p) => (
                    <NativeSelectOption value={p.id} key={p.id}>
                      {p.id} / {p.name}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </label>
            ))}
          </>
        )}
      </div>
      <div className="comparison-grid">
        {worlds.map((world, i) => (
          <article
            className="comparison-world lab-color-world"
            key={i}
            style={paletteStyle(world.palette)}
          >
            <div className="comparison-label">
              <b>{identities.find((v) => v.id === world.identity)!.name}</b>
              <span>
                {world.palette.id} / {world.palette.name}
              </span>
            </div>
            <div className="comparison-mark">
              <IdentityVector identity={world.identity} />
            </div>
            <div className="comparison-body">
              <IdentityWordmark identity={world.identity} compact />
              <h3>
                A little better,
                <br />
                every day.
              </h3>
              <p>
                Independent software publishing. Thoughtful tools for ordinary
                life.
              </p>
              <div className="comparison-edition">
                <IdentityVector identity={world.identity} product={0} compact />
                <div>
                  <strong>Sori</strong>
                  <span>01 / AUDIO / v4.8.2</span>
                </div>
                <Link
                  href="/preview/identity-lab/software/sori"
                  aria-label="Explore fictional Sori"
                >
                  ↗
                </Link>
              </div>
              <Button
                aria-pressed={active === i}
                onClick={() => setActive(active === i ? null : i)}
              >
                {active === i
                  ? "Selected for inspection ✓"
                  : "Inspect active state"}
              </Button>
              <IdentityImprint
                identity={world.identity}
                edition="DESIGN EDITION / 2036"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Specimens({
  identity,
  palette,
}: {
  identity: Identity;
  palette: Palette;
}) {
  return (
    <section className="specimen-workspace">
      <div className="lab-section-intro">
        <span>STATIC STRENGTH / LIVING POTENTIAL</span>
        <h2>
          Before it moves,
          <br />
          does it belong?
        </h2>
        <p>{identities.find((i) => i.id === identity)!.anatomy}</p>
      </div>
      <div
        className="lab-color-world specimen-world"
        style={paletteStyle(palette)}
      >
        <div className="specimen-wordmark">
          <IdentityWordmark identity={identity} />
          <span lang="ko">하루로</span>
        </div>
        <div className="scale-ruler">
          {[16, 24, 32, 48, 96, 256].map((size) => (
            <figure key={size}>
              <div style={{ width: size, height: size }}>
                <IdentityVector
                  identity={identity}
                  compact
                  label={`${size} pixel ${identity} logo`}
                />
              </div>
              <figcaption>{size}px</figcaption>
            </figure>
          ))}
        </div>
        <div className="specimen-monochrome">
          <figure>
            <IdentityVector identity={identity} />
            <figcaption>ONE INK / PRINT FORM</figcaption>
          </figure>
          <figure>
            <IdentityVector identity={identity} />
            <figcaption>REVERSED / SCREEN FORM</figcaption>
          </figure>
        </div>
        <div className="specimen-lockups">
          <div>
            <span>COMPACT NAVIGATION</span>
            <IdentityWordmark identity={identity} compact />
          </div>
          <div>
            <span>PUBLISHER IMPRINT</span>
            <IdentityImprint
              identity={identity}
              edition="SORI / SOFTWARE EDITION 01"
            />
          </div>
          <div>
            <span>RELEASE SIGNATURE</span>
            <IdentityImprint
              identity={identity}
              edition="4.8.2 / 29 AUG 2036 / FICTIONAL"
            />
          </div>
        </div>
        <div className="specimen-family">
          <header>
            <span>ONE PUBLISHER / SIX VOICES</span>
            <h3>The product family.</h3>
          </header>
          {["Sori", "Namu", "Goyo", "Haru Weather", "Dami", "Morrow"].map(
            (name, i) => (
              <figure key={name}>
                <IdentityVector identity={identity} product={i} compact />
                <figcaption>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  {name}
                </figcaption>
              </figure>
            ),
          )}
        </div>
        <figure className="specimen-huge">
          <IdentityVector identity={identity} compact />
          <figcaption>ENVIRONMENTAL SCALE / THE SYMBOL AS A PLACE</figcaption>
        </figure>
      </div>
    </section>
  );
}
function ColorProof({
  identity,
  palette,
}: {
  identity: Identity;
  palette: Palette;
}) {
  const [active, setActive] = useState(false);
  return (
    <div className="color-proof lab-color-world" style={paletteStyle(palette)}>
      <div className="proof-hero">
        <IdentityWordmark identity={identity} compact />
        <h2>
          A little better.
          <br />
          In every light.
        </h2>
        <IdentityVector identity={identity} compact />
      </div>
      <div className="proof-body">
        <div>
          <span className="proof-metadata">SORI / 4.8.2 / 29 AUG 2036</span>
          <h3>Software, published.</h3>
          <p>
            Body text needs to work as hard as the mark. Select this sentence to
            test the selection colors, then tab through the controls below.
          </p>
          <div className="proof-actions">
            <Button onClick={() => setActive((v) => !v)} aria-pressed={active}>
              {active ? <Check /> : <ArrowUpRight />}
              {active ? "Selected" : "Test active state"}
            </Button>
            <Button variant="outline" onClick={() => setActive(false)}>
              Reset
            </Button>
          </div>
          <label className="proof-field">
            Focus and input
            <Input
              placeholder="A calmer everyday"
              aria-label="Color focus test"
            />
          </label>
          <p className="proof-success">
            Success / The sample selection is ready.
          </p>
          <p className="proof-destructive">
            Error / Example message, no action required.
          </p>
        </div>
        <div className="proof-surfaces">
          <div>
            <strong>Surface</strong>
            <p>Readable secondary content.</p>
          </div>
          <div>
            <strong>Elevated surface</strong>
            <p>Controls and contextual information.</p>
          </div>
          <div>
            <strong>Inverse surface</strong>
            <p>A purposeful change of register.</p>
          </div>
        </div>
        <div className="contrast-report">
          <h3>Text contrast / calculated</h3>
          <p>
            WCAG relative luminance, opaque token pairs. Browser checks also
            cover the rendered contexts.
          </p>
          <dl>
            {contrastChecks(palette).map((check) => (
              <div key={check.label}>
                <dt>{check.label}</dt>
                <dd>
                  {check.ratio.toFixed(2)}:1{" "}
                  <span>{check.ratio >= 4.5 ? "AA" : "REVIEW"}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <details className="token-inspector">
          <summary>
            Inspect all {Object.keys(palette.tokens).length} semantic tokens
          </summary>
          <dl>
            {Object.entries(palette.tokens).map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>
                  <i style={{ background: value }} />
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </div>
  );
}
