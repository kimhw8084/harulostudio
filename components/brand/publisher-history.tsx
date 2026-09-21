"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Link from "@/components/site-link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type {
  Product,
  PublisherCatalog,
  Release,
} from "@/lib/publishing/types";
import { formatDate, releasePath } from "@/lib/publishing/catalog";
import { BrandScene } from "./scene/brand-scene";
import { HaruloEnvironment } from "./environments/harulo-environment";
import { PublicationRails, RegistrationLock } from "./scene/effects";
import { HaruloMark } from "./harulo-mark";
import { useExperience } from "@/components/experience-provider";

export function ReleaseRiver({
  releases,
  products,
  prefix = "",
}: {
  releases: Release[];
  products: Product[];
  prefix?: string;
}) {
  const { ready } = useExperience();
  const ordered = [...releases].sort((a, b) =>
    a.publishedAt.localeCompare(b.publishedAt),
  );
  const [index, setIndex] = useState(Math.max(0, ordered.length - 1));
  const current = ordered[index],
    previous = ordered
      .slice(0, index)
      .reverse()
      .find((r) => r.productId === current?.productId);
  if (!current) return null;
  const product = products.find((p) => p.id === current.productId);
  if (!product) return null;
  const progress = index / Math.max(1, ordered.length - 1);
  return (
    <BrandScene
      className="release-river"
      history={progress}
      systems="07 08 10 17 23"
    >
      <PublicationRails
        title={
          <h2>
            Nothing good
            <br />
            stands <em>still.</em>
          </h2>
        }
        metadata={`${ordered.length} PUBLICATIONS / ${ordered[0].publishedAt.slice(0, 4)}—${ordered.at(-1)!.publishedAt.slice(0, 4)}`}
      />
      <div className="river-comparison">
        <div className="palimpsest-layer">
          <p className="eyebrow">THE PREVIOUS REGISTER</p>
          <span className="river-version">{previous?.version ?? "00"}</span>
          <p>
            {previous?.title ??
              "Every publication begins with a first edition."}
          </p>
          {previous && (
            <Link href={releasePath(previous, product, prefix)}>
              Read previous edition ↗
            </Link>
          )}
        </div>
        <RegistrationLock id={current.id}>
          <article className="river-current" aria-live="polite">
            <p className="eyebrow">
              <span className="ember-point" /> {product.name} / {current.kind}
            </p>
            <h3>{current.version}</h3>
            <p>{current.title}</p>
            <time dateTime={current.publishedAt}>
              {formatDate(current.publishedAt)}
            </time>
            <ul>
              {current.improvements.slice(0, 2).map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <Link
              className="text-link"
              href={releasePath(current, product, prefix)}
            >
              Read this release ↗
            </Link>
          </article>
        </RegistrationLock>
      </div>
      <div
        className="river-track"
        style={{ "--river-progress": progress } as CSSProperties}
      >
        <span />
        <i aria-hidden="true" />
      </div>
      <div className="river-controls">
        <Button
          variant="outline"
          disabled={!ready || !index}
          onClick={() => setIndex(index - 1)}
        >
          Earlier
        </Button>
        <label className="river-slider">
          Publication {index + 1} of {ordered.length}
          <Slider
            role="group"
            min={0}
            max={Math.max(1, ordered.length - 1)}
            step={1}
            value={[index]}
            onValueChange={(v) => setIndex(v[0])}
            disabled={!ready || ordered.length < 2}
            aria-label="Publication history"
          />
        </label>
        <Button
          variant="outline"
          disabled={!ready || index === ordered.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Later
        </Button>
      </div>
      <p className="resource-note">
        Interactive overview. The complete, filterable{" "}
        <Link href={`${prefix}/releases`}>release archive</Link> is available
        without JavaScript.
      </p>
    </BrandScene>
  );
}

export function ChronoLens({
  catalog,
  prefix,
}: {
  catalog: PublisherCatalog;
  prefix: string;
}) {
  const { ready } = useExperience();
  const [year, setYear] = useState(2036),
    [remembered, setRemembered] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const value = Number(localStorage.getItem("harulo-explored-era"));
        if (value >= 2026 && value <= 2036) {
          setYear(value);
          setRemembered(true);
        }
      } catch {
        /* Optional local preference. */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const choose = (value: number) => {
    setYear(value);
    try {
      localStorage.setItem("harulo-explored-era", String(value));
      setRemembered(true);
    } catch {
      /* The timeline always works without storage. */
    }
  };
  const milestone = catalog.milestones?.find((m) => m.year === year);
  const products = catalog.products
    .filter((p) => Number(p.firstReleasedAt?.slice(0, 4)) <= year)
    .sort((a, b) =>
      (a.firstReleasedAt ?? "").localeCompare(b.firstReleasedAt ?? ""),
    );
  const active = products.filter(
    (p) =>
      !(
        ["archived", "discontinued"].includes(p.status) &&
        Number(p.latestReleasedAt?.slice(0, 4)) <= year
      ),
  );
  return (
    <BrandScene
      className="chrono-lens"
      history={(year - 2026) / 10}
      systems="09 15 16 20 22 23"
    >
      <HaruloEnvironment material="chrono" />
      <div className="chrono-top">
        <p className="eyebrow">A DAY BECOMES A DECADE.</p>
        <span className="metadata">FICTIONAL HISTORY / 2026—2036</span>
      </div>
      <div className="chrono-world">
        <div className="chrono-aperture">
          <span className="chrono-year">{year}</span>
          <span
            className="chrono-satellite"
            style={{ transform: `rotate(${(year - 2026) * 25 - 125}deg)` }}
            aria-hidden="true"
          >
            <i />
          </span>
          <div className="chrono-index metadata">
            {String(active.length).padStart(2, "0")} ACTIVE EDITIONS
            <br />
            {String(products.length - active.length).padStart(2, "0")} PRESERVED
            IN HISTORY
          </div>
        </div>
        <RegistrationLock id={String(year)}>
          <div className="chrono-story" aria-live="polite">
            <h2>{milestone?.title ?? "The next small beginning."}</h2>
            <p>{milestone?.description}</p>
            <ul>
              {products.slice(-4).map((p) => (
                <li key={p.id}>
                  <Link href={`${prefix}/software/${p.slug}`}>
                    {p.name}
                    <span>
                      {p.history
                        ?.filter((h) => Number(h.date.slice(0, 4)) <= year)
                        .at(-1)?.version ?? "First edition"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </RegistrationLock>
      </div>
      <div className="chrono-years" aria-label="Explore a year">
        {Array.from({ length: 11 }, (_, i) => 2026 + i).map((value) => (
          <button
            key={value}
            disabled={!ready}
            aria-pressed={year === value}
            onClick={() => choose(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="chrono-memory">
        <p>
          {remembered
            ? "This browser remembers your last explored year. Nothing is sent."
            : "Explore freely. This preference stays in your browser only."}
        </p>
        <Button
          disabled={!ready}
          variant="ghost"
          onClick={() => {
            try {
              localStorage.removeItem("harulo-explored-era");
            } catch {}
            setRemembered(false);
            setYear(2036);
          }}
        >
          Clear local memory
        </Button>
      </div>
      <PublicationAtlas catalog={catalog} prefix={prefix} />
    </BrandScene>
  );
}

export function PublicationAtlas({
  catalog,
  prefix,
}: {
  catalog: PublisherCatalog;
  prefix: string;
}) {
  return (
    <details className="publication-atlas" data-systems="22">
      <summary>
        Open the publication surface{" "}
        <span>12 works / one continuous field</span>
      </summary>
      <p>
        Each column is an arrival year. Scroll this region horizontally, or use
        the <Link href={`${prefix}/software`}>standard catalog</Link>.
      </p>
      <div
        className="atlas-scroll"
        tabIndex={0}
        role="region"
        aria-label="Chronological publication surface"
      >
        <div className="atlas-field">
          {Array.from({ length: 10 }, (_, i) => i + 2027).map((year) => (
            <section key={year}>
              <h3>{year}</h3>
              {catalog.products
                .filter((p) => p.firstReleasedAt?.startsWith(String(year)))
                .map((p) => (
                  <Link key={p.id} href={`${prefix}/software/${p.slug}`}>
                    <HaruloMark />
                    <strong>{p.name}</strong>
                    <span className="metadata">
                      EDITION {p.edition} / {p.status}
                    </span>
                    <p>{p.tagline}</p>
                  </Link>
                ))}
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}
