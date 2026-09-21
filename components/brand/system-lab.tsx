"use client";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Slider } from "@/components/ui/slider";
import { HaruloMark, HaruloLockup } from "./harulo-mark";
import { ProductGlyph } from "./product-glyph";
import {
  MotionControl,
  ThemeControl,
  useExperience,
} from "@/components/experience-provider";
import { useBrandMotion } from "./use-brand-motion";
import { HARULO, proportions } from "@/lib/brand/geometry";
import Link from "@/components/site-link";
import {
  studies,
  studyById,
  studyPose,
  motion,
  type StudyId,
} from "@/lib/brand/motion";
import { themes, swatches } from "@/lib/brand/themes";
import {
  productionSystems,
  type SceneMaterial,
  type SceneQuality,
} from "@/lib/brand/scene";
import { BrandScene } from "./scene/brand-scene";
import { HaruloEnvironment } from "./environments/harulo-environment";
import "./system-lab.css";

const sizes = [16, 20, 24, 32, 48, 64, 128, 256, 512];
const products = [
  ["Sori", "sound"],
  ["Namu", "notes"],
  ["Goyo", "focus"],
  ["Haru Weather", "weather"],
  ["Dami", "spending"],
  ["Morrow", "planning"],
] as const;

function StudyContents({ id, opacity }: { id: StudyId; opacity: number }) {
  const text = (
    x: number,
    y: number,
    value: string,
    size = 3,
    anchor: "start" | "middle" = "start",
  ) => (
    <text x={x} y={y} fontSize={size} textAnchor={anchor}>
      {value}
    </text>
  );
  const content: Record<StudyId, ReactNode> = {
    open: (
      <>
        {text(17, 23, "A LITTLE SPACE", 3)}
        {text(50, 49, "01:00", 15, "middle")}
        {text(50, 61, "ONE MINUTE. ENTIRELY YOURS.", 2.4, "middle")}
        {text(9, 77, "HARULO / WORKING STUDY", 2.7)}
        {text(9, 94, "DESIGNED. BUILT. SHARED.", 2.5)}
      </>
    ),
    edition: (
      <>
        {text(26, 20, "SOFTWARE EDITION / 01", 2.7)}
        {text(26, 42, "Sori", 14)}
        {text(26, 58, "A LITTLE MORE QUIET.", 2.6)}
        {text(20, 77, "SORI / AUDIO UTILITY", 2.8)}
        {text(20, 95, "v4.8.2 · DEMONSTRATION", 2.4)}
      </>
    ),
    timeline: (
      <>
        {text(9, 45, "2027", 3)}
        {text(50, 37, "4.0", 5, "middle")}
        {text(78, 43, "NOW", 3)}
        {text(8, 62, "FIRST EDITION", 2.5)}
        {text(43, 62, "A CONTINUING PRACTICE", 2.5)}
        {text(43, 76, "RELEASE → IMPROVE → RELEASE", 2.4)}
      </>
    ),
    navigation: (
      <>
        {text(36, 36, "SOFTWARE", 2.7)}
        {text(36, 56, "RELEASES / STUDIO / SUPPORT", 2.5)}
        {text(50, 77, "ONE PUBLISHER. MANY DESTINATIONS.", 2.7, "middle")}
      </>
    ),
    portal: (
      <>
        {text(12, 31, "Into a", 11)}
        {text(12, 47, "better day.", 11)}
        {text(12, 66, "HARULO / SOFTWARE, PUBLISHED.", 2.8)}
        {text(12, 94, "THE NEXT PAGE IS ALREADY HERE.", 2.6)}
      </>
    ),
    loading: (
      <>
        {text(50, 41, "64%", 6, "middle")}
        {text(20, 64, "OPENING A LITTLE SPACE", 2.7)}
        {text(20, 88, "ONE ORBIT, THEN QUIET.", 2.7)}
      </>
    ),
    stamp: (
      <>
        {text(26, 31, "PUBLISHED", 6)}
        {text(26, 43, "BY HARULO STUDIO", 3)}
        {text(26, 54, "DESIGN → BUILD → RELEASE", 2.4)}
        {text(50, 94, "REGISTER. ALIGN. SETTLE.", 2.6, "middle")}
      </>
    ),
    family: (
      <>
        <path
          d="M32 33V49M42 28V54M52 36V46M62 31V51"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {text(47, 61, "SORI", 3, "middle")}
        {text(22, 75, "A HARULO STUDIO EDITION", 2.6)}
        {text(50, 95, "DIFFERENT WORK. ONE ORIGIN.", 2.4, "middle")}
      </>
    ),
    screenshot: (
      <>
        {text(12, 29, "SORI / AUDIO", 3)}
        {["Music", "Browser", "System"].map((label, i) => (
          <g key={label}>
            {text(12, 42 + i * 10, label, 3)}
            <path
              d={`M39 ${40 + i * 10}h42`}
              stroke="currentColor"
              strokeWidth="1"
              opacity=".35"
            />
            <circle cx={67 - i * 8} cy={40 + i * 10} r="2" />
          </g>
        ))}
        {text(9, 78, "SOFTWARE, SEEN CLEARLY.", 2.7)}
        {text(9, 96, "FICTIONAL INTERFACE STUDY", 2.6)}
      </>
    ),
    version: (
      <>
        {text(19.5, 38, "01", 5, "middle")}
        {text(37, 42, "4.8.2", 11)}
        {text(37, 59, "29 AUG / 2036", 3.3)}
        {text(37, 78, "A LITTLE BETTER THAN BEFORE.", 2.5)}
      </>
    ),
    closure: (
      <>
        {text(62, 49, "하루로", 6)}
        {text(18, 67, "A DAY, COMPLETE.", 3)}
        {text(42, 85, "ANOTHER, AHEAD.", 2.7)}
      </>
    ),
    mobile: (
      <>
        {text(50, 16, "HARULO", 4, "middle")}
        {text(44, 27, "SOFTWARE", 2.7)}
        {text(34, 43, "RELEASES", 3)}
        {text(34, 65, "STUDIO", 3)}
        {text(34, 84, "SUPPORT", 3)}
      </>
    ),
  };
  return (
    <g
      opacity={opacity}
      fill="currentColor"
      className="study-content"
      aria-hidden="true"
    >
      {content[id]}
    </g>
  );
}

export function MasterMotionPlayer({
  initial = "open",
}: {
  initial?: StudyId;
}) {
  const [selected, setSelected] = useState<StudyId>(initial);
  return (
    <section className="master-motion">
      <div className="study-index">
        <p className="eyebrow">12 TRANSFORMATIONS / ONE ORIGIN</p>
        {studies.map((study, i) => (
          <button
            key={study.id}
            onClick={() => setSelected(study.id)}
            aria-pressed={selected === study.id}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span>
              {study.name}
              <small>{study.family}</small>
            </span>
          </button>
        ))}
      </div>
      <MotionPlayer key={selected} selected={selected} />
    </section>
  );
}

function MotionPlayer({ selected }: { selected: StudyId }) {
  const {
    ref: stageRef,
    progress: position,
    playing,
    paused,
    reduced,
    slow,
    setSlow,
    play,
    replay,
    seek,
    pause,
  } = useBrandMotion();
  const [reducedPreview, setReducedPreview] = useState(false);
  const study = studyById(selected);
  const quiet = reducedPreview || reduced || paused;
  const progress = quiet && position > 0 && position < 1 ? 0.54 : position;
  const amount =
    progress <= 0.26 || progress >= 0.88
      ? 0
      : Math.min(1, (progress - 0.26) / 0.14, (0.88 - progress) / 0.16);
  return (
    <div
      className="study-workbench"
      ref={stageRef}
      data-study={selected}
      data-progress={progress.toFixed(3)}
      data-playing={playing}
    >
      <div className="study-stage" data-quiet={quiet}>
        <HaruloMark
          pose={studyPose(selected, progress)}
          title={`${study.name}, transformation study`}
        >
          <StudyContents id={selected} opacity={amount} />
        </HaruloMark>
        <span className="metadata stage-caption">
          {progress === 0 || progress >= 1
            ? "CANONICAL RESTING GEOMETRY"
            : quiet
              ? "REDUCED MOTION / COMPOSED DESTINATION"
              : "FOUR PERSISTENT PRIMITIVES"}
        </span>
      </div>
      <div className="study-caption">
        <div>
          <p className="eyebrow">{study.family}</p>
          <h2>{study.name}</h2>
        </div>
        <p>{study.purpose}</p>
      </div>
      <div className="study-controls">
        <Button
          onClick={() => (quiet ? seek(0.54) : play())}
          disabled={playing}
        >
          {quiet ? "Show destination" : "Play"}
        </Button>
        <Button
          variant="outline"
          onClick={() => (quiet ? seek(0.54) : replay())}
        >
          {quiet ? "Destination" : "Replay"}
        </Button>
        <Button variant="outline" onClick={pause} disabled={!playing}>
          Pause
        </Button>
        <Button
          variant="outline"
          aria-pressed={slow}
          onClick={() => setSlow(!slow)}
          disabled={quiet}
        >
          ⅓ speed
        </Button>
        <Button
          variant="outline"
          aria-pressed={reducedPreview || reduced}
          onClick={() => {
            pause();
            setReducedPreview(!reducedPreview);
          }}
          disabled={reduced}
        >
          Reduced-motion preview
        </Button>
      </div>
      <label className="study-scrub">
        Transformation position
        <Slider
          aria-label="Transformation position"
          min={0}
          max={100}
          step={1}
          value={[Math.round(progress * 100)]}
          onValueChange={([v]) => seek(v / 100)}
        />
      </label>
      <div className="study-states">
        <button onClick={() => seek(0)}>01 / Master</button>
        <button onClick={() => seek(0.54)}>02 / Destination</button>
        <button onClick={() => seek(1)}>03 / Exact return</button>
      </div>
      {quiet && (
        <p className="study-note">
          Motion is reduced or paused. The same master and destination are
          available as intentional still compositions.
        </p>
      )}
    </div>
  );
}

function MasterSpecimen() {
  const [overlay, setOverlay] = useState(false);
  return (
    <>
      <div className="master-specimen">
        <div className="master-drawing">
          <HaruloMark title="Harulo master mark — exact canonical geometry">
            {overlay && (
              <g
                className="geometry-overlay"
                fill="none"
                stroke="currentColor"
                strokeWidth=".15"
              >
                <path d="M0 41.5H100M47.5 0V100M0 58.5H100M0 67.6H100" />
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
                  <path key={v} d={`M${v} 0V100M0 ${v}H100`} opacity=".35" />
                ))}
                <rect x=".1" y=".1" width="99.8" height="99.8" />
                <circle
                  cx={HARULO.ring.cx}
                  cy={HARULO.ring.cy}
                  r=".8"
                  fill="currentColor"
                />
              </g>
            )}
          </HaruloMark>
          <Button
            variant="outline"
            aria-pressed={overlay}
            onClick={() => setOverlay(!overlay)}
          >
            Geometry overlay
          </Button>
        </div>
        <div className="master-specification">
          <p className="eyebrow">06 · HIGH TENSION / APPROVED MASTER</p>
          <h2>
            One day.
            <br />
            Something beyond.
            <br />A place to publish.
          </h2>
          <p>
            One ring. One satellite. Two tiers. An abstraction rooted in{" "}
            <span lang="ko">ㅎ</span>, built to unfold into useful software.
          </p>
          <dl>
            {Object.entries(HARULO)
              .filter(([key]) => key !== "viewBox")
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>
                    {Object.entries(value)
                      .map(([k, v]) => `${k} ${v}`)
                      .join(" · ")}
                  </dd>
                </div>
              ))}
          </dl>
          <p className="metadata">
            VIEWBOX 0 0 100 100 · TIER RATIO {proportions.tierRatio}
            <br />
            NO OPTICAL REDRAW. NO ALTERNATE MASTER.
          </p>
        </div>
      </div>
      <section className="master-sizes">
        <h2>From favicon to field.</h2>
        <p>
          The exact same artboard at every size. No hidden small-size variant.
        </p>
        <div>
          {sizes.map((size) => (
            <figure key={size}>
              <div>
                <HaruloMark
                  size={size}
                  style={{ width: size, maxWidth: "100%" }}
                  title={`Harulo at ${size} pixels`}
                />
              </div>
              <figcaption className="metadata">
                {size} × {size} PX
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <div className="master-lockups">
        <section>
          <p className="eyebrow">MONOCHROME / HORIZONTAL</p>
          <HaruloLockup monochrome />
        </section>
        <section className="inverse">
          <p className="eyebrow">REVERSED / VERTICAL</p>
          <HaruloLockup vertical monochrome />
        </section>
      </div>
      <section className="master-family">
        <h2>Different work. One origin.</h2>
        <p>
          Fictional product studies. These are application symbols, not
          alternative Harulo logos.
        </p>
        <div>
          {products.map(([name, kind]) => (
            <figure key={kind}>
              <ProductGlyph kind={kind} />
              <figcaption>{name}</figcaption>
              <span className="metadata">
                PUBLISHED BY <HaruloMark />
              </span>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

export function OfficialLab({
  children,
  context,
  initialWebsite = false,
}: {
  children: ReactNode;
  context: string;
  initialWebsite?: boolean;
}) {
  const { ready, theme } = useExperience();
  const [tab, setTab] = useState(initialWebsite ? "applications" : "master");
  const [material, setMaterial] = useState<SceneMaterial>("flow");
  const [quality, setQuality] = useState<SceneQuality>("balanced");
  const [width, setWidth] = useState("100%");
  return (
    <div className="official-lab" data-palette="cobalt-ember">
      <header className="master-lab-header">
        <Link
          href="/preview/identity-lab"
          aria-label="Harulo identity system home"
        >
          <HaruloLockup />
        </Link>
        <p className="metadata">
          OFFICIAL BRAND ENGINEERING / DEVELOPMENT ONLY
        </p>
        <ThemeControl />
        <Link href="/" className="text-link">
          Public site ↗
        </Link>
      </header>
      <section className="master-lab-intro">
        <div>
          <p className="eyebrow">COBALT IS STRUCTURE. EMBER IS SIGNAL.</p>
          <h1>HARULO MASTER MARK</h1>
          <p>
            One immutable symbol. Four material channels. One permanent
            identity.
          </p>
        </div>
        <span className="metadata">{theme.toUpperCase()} / COBALT EMBER</span>
      </section>
      <Tabs value={tab} onValueChange={setTab} className="master-tabs">
        <TabsList aria-label="Identity system views">
          <TabsTrigger disabled={!ready} value="master">
            Master & geometry
          </TabsTrigger>
          <TabsTrigger disabled={!ready} value="motion">
            Motion / 12 studies
          </TabsTrigger>
          <TabsTrigger disabled={!ready} value="systems">
            24 production systems
          </TabsTrigger>
          <TabsTrigger disabled={!ready} value="environments">
            Living environments
          </TabsTrigger>
          <TabsTrigger disabled={!ready} value="applications">
            In the website
          </TabsTrigger>
          <TabsTrigger disabled={!ready} value="color">
            Color & tokens
          </TabsTrigger>
        </TabsList>
        <TabsContent value="master">
          <main id="main" tabIndex={-1}>
            <MasterSpecimen />
            <section className="master-colors">
              <h2>Space is part of the mark.</h2>
              <p>
                Keep the complete 100 × 100 artboard. Minimum icon artboard: 16
                px; recommended navigation artboard: 48 px. Use 12 px of clear
                space outside the artboard beside a lockup. Never crop to the
                visible ring or stretch the symbol.
              </p>
            </section>
          </main>
        </TabsContent>
        <TabsContent value="motion">
          <main id="main" tabIndex={-1}>
            <MasterMotionPlayer />
          </main>
        </TabsContent>
        <TabsContent value="systems">
          <main id="main" tabIndex={-1}>
            <div className="system-registry">
              {productionSystems.map(([id, name, description, place]) => (
                <article key={id}>
                  <span className="metadata">
                    SYSTEM {id} / {place.toUpperCase()}
                  </span>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <Link
                    className="text-link"
                    href={
                      place === "history"
                        ? "/preview/2036/history"
                        : place === "releases"
                          ? "/preview/2036/releases?product=sori"
                          : place === "product"
                            ? "/preview/2036/software/gyeol"
                            : place === "catalog"
                              ? "/preview/2036/software"
                              : "/preview/2036"
                    }
                  >
                    Open in the publisher ↗
                  </Link>
                </article>
              ))}
            </div>
          </main>
        </TabsContent>
        <TabsContent value="environments">
          <main id="main" tabIndex={-1}>
            <div className="engineering-controls">
              <label>
                Environment
                <NativeSelect
                  aria-label="Environment"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as SceneMaterial)}
                >
                  {(["flow", "chrono", "membrane"] as const).map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </label>
              <label>
                Rendering tier
                <NativeSelect
                  aria-label="Rendering tier"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as SceneQuality)}
                >
                  {(["full", "balanced", "reduced", "static"] as const).map(
                    (v) => (
                      <NativeSelectOption key={v} value={v}>
                        {v}
                      </NativeSelectOption>
                    ),
                  )}
                </NativeSelect>
              </label>
              <label>
                Review width
                <NativeSelect
                  aria-label="Review width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                >
                  {["100%", "768px", "390px", "320px"].map((v) => (
                    <NativeSelectOption key={v} value={v}>
                      {v}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </label>
              <MotionControl />
            </div>
            <div style={{ width, maxWidth: "100%", margin: "auto" }}>
              <BrandScene
                className="environment-review"
                quality={quality}
                key={material + quality}
              >
                <HaruloEnvironment material={material} />
                <HaruloMark title="Harulo master in the environment" />
              </BrandScene>
            </div>
            <p className="resource-note">
              Move a pointer or scroll to energize the field. Drawing settles at
              rest. Reduced motion, pause and hidden documents override the
              selected quality.
            </p>
          </main>
        </TabsContent>
        <TabsContent value="applications">
          <div className="master-context-nav">
            <p>
              Fictional software and future releases. No real availability is
              claimed.
            </p>
            <nav aria-label="Brand application contexts">
              {[
                ["home", "Homepage"],
                ["software", "Catalog"],
                ["software/sori", "Product"],
                ["releases", "Releases"],
                ["support", "Support"],
                ["privacy/sori", "Privacy"],
                ["press", "Press"],
                ["lifecycle", "Archive"],
                ["empty", "Empty state"],
                ["mobile", "Mobile"],
                ["loading", "Loading"],
                ["transition", "Transition"],
              ].map(([value, label]) => (
                <Link
                  href={"/preview/identity-lab/" + value}
                  key={value}
                  aria-current={context === value ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
              <Link href="/preview/2036/history">Decade history</Link>
            </nav>
          </div>
          <div className="master-website">{children}</div>
        </TabsContent>
        <TabsContent value="color">
          <main id="main" tabIndex={-1}>
            <section className="master-colors">
              <h2>Cobalt Ember. Permanent.</h2>
              <p>
                Structure stays Cobalt. The active signal is Ember. Dark mode is
                art-directed, not inverted. Previous palette research is
                archived, not a production preference.
              </p>
              <div className="master-color-strip">
                {Object.entries(swatches).map(([name, color]) => (
                  <figure key={name}>
                    <span style={{ background: color }} />
                    <figcaption>
                      {name}
                      <br />
                      <code>{color}</code>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <h3>Current semantic tokens</h3>
              <dl className="motion-token-list">
                {Object.entries(themes[theme]).map(([name, value]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <h3>Motion tokens</h3>
              <dl className="motion-token-list">
                {Object.entries(motion)
                  .filter(([, v]) => typeof v === "number")
                  .map(([name, value]) => (
                    <div key={name}>
                      <dt>{name}</dt>
                      <dd>{String(value)} ms</dd>
                    </div>
                  ))}
              </dl>
              <p>
                Normal text pairs are validated at 4.5:1 or better in the
                automated brand contract. Ember text uses a calibrated token;
                the raw Ember swatch is not a body-text color.
              </p>
            </section>
          </main>
        </TabsContent>
      </Tabs>
      <footer className="master-lab-footer">
        <HaruloMark />
        <p>
          Exact at rest. Expansive in motion.
          <br />
          <span className="metadata">
            RING · SATELLITE · PRIMARY TIER · SECONDARY TIER
          </span>
        </p>
        <MotionControl />
        <Link href="/preview/identity-lab/archive" className="text-link">
          Earlier identity research ↗
        </Link>
      </footer>
    </div>
  );
}

export function OfficialSpecialContext({ context }: { context: string }) {
  if (context === "favicon") return <MasterSpecimen />;
  if (context === "social")
    return (
      <div className="master-social">
        <HaruloMark />
        <p>
          HARULO STUDIO
          <br />
          <span className="metadata">INDEPENDENT SOFTWARE PUBLISHER</span>
        </p>
        <h2>
          A little better.
          <br />
          Every day.
        </h2>
      </div>
    );
  return (
    <MasterMotionPlayer
      initial={
        context === "loading"
          ? "loading"
          : context === "mobile"
            ? "mobile"
            : "portal"
      }
    />
  );
}
