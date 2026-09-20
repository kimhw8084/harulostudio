"use client";
import Link from "@/components/site-link";

import { createContext, useContext } from "react";
import { transformations, type Identity } from "@/lib/identity/geometry";
import { palettes } from "@/lib/identity/palettes";
import {
  IdentityImprint,
  IdentityVector,
  IdentityWordmark,
} from "./identity-vector";
import { TransformationPlayer } from "./transformation-player";
import { Button } from "@/components/ui/button";

export const LabContext = createContext({
  identity: "syllable" as Identity,
  palette: palettes[0],
  transformation: transformations("syllable")[0],
});
export function LabHero() {
  const { identity, transformation } = useContext(LabContext);
  return (
    <section className="lab-hero">
      <div className="lab-hero-mast">
        <span>INDEPENDENT SOFTWARE PUBLISHER</span>
        <span lang="ko">조금 더 나은 하루로.</span>
      </div>
      <h1>
        HARULO<span>STUDIO</span>
      </h1>
      <div className="lab-hero-statement">
        <p>
          Software for a<br />
          little better day.
        </p>
        <div>
          <IdentityVector identity={identity} compact />
          <span>
            We design, build, publish and maintain thoughtful software for
            everyday life.
          </span>
        </div>
      </div>
      <TransformationPlayer
        identity={identity}
        transformation={transformation}
        compact
      />
      <div className="lab-hero-end">
        <Link href="/preview/identity-lab/software">
          Explore the editions ↗
        </Link>
        <span>FICTIONAL PUBLISHER / DESIGN EDITION 2036</span>
      </div>
    </section>
  );
}
export function LabSiteHeader() {
  const { identity } = useContext(LabContext);
  return (
    <header className="lab-site-header">
      <Link
        href="/preview/identity-lab/home"
        aria-label="Harulo demonstration homepage"
      >
        <IdentityWordmark identity={identity} compact />
      </Link>
      <nav aria-label="Demonstration publisher">
        <Link href="/preview/identity-lab/software">Software</Link>
        <Link href="/preview/identity-lab/releases">Releases</Link>
        <Link href="/preview/identity-lab/support">Support</Link>
        <Link href="/preview/identity-lab/press">Press</Link>
      </nav>
    </header>
  );
}
export function LabSiteFooter() {
  const { identity } = useContext(LabContext);
  return (
    <footer className="lab-site-footer">
      <IdentityImprint identity={identity} />
      <span>
        A little better, every day.
        <br />
        <span lang="ko">조금 더 나은 하루로.</span>
      </span>
      <p>
        Design laboratory. All products, versions and dates are fictional. No
        permanent identity selected.
      </p>
    </footer>
  );
}
export function LabSpecialContext({ context }: { context: string }) {
  const { identity, palette, transformation } = useContext(LabContext);
  if (context === "social")
    return (
      <section className="lab-social-gallery">
        <h1>Out in the world.</h1>
        <p>
          Live social-card compositions, not final launch assets. Every choice
          updates the family.
        </p>
        {["Sori 4.8.2", "Namu 3.4", "Morrow / Preview"].map((name, i) => (
          <figure key={name} className={`lab-social-card social-${i}`}>
            <div>
              <IdentityWordmark identity={identity} compact />
              <span>FICTIONAL RELEASE</span>
            </div>
            <IdentityVector
              identity={identity}
              product={i === 2 ? 5 : i}
              compact
            />
            <h2>{name}</h2>
            <figcaption>
              {i === 0
                ? "Your sound, considered."
                : i === 1
                  ? "Notes that grow naturally."
                  : "A little room for tomorrow."}
              <span>A HARULO STUDIO EDITION ↗</span>
            </figcaption>
          </figure>
        ))}
      </section>
    );
  if (context === "mobile")
    return (
      <section className="lab-mobile-context">
        <h1>A publisher in your pocket.</h1>
        <p>
          Real responsive composition, contained at 360px. Use the navigation to
          open the complete demonstration pages.
        </p>
        <div className="lab-phone">
          <LabSiteHeader />
          <div className="lab-phone-hero">
            <span>INDEPENDENT SOFTWARE PUBLISHER</span>
            <h2>
              HARULO
              <br />
              STUDIO
            </h2>
            <IdentityVector identity={identity} />
            <p>
              A little better,
              <br />
              every day.
            </p>
            <Link href="/preview/identity-lab/software">
              Explore software ↗
            </Link>
          </div>
          <div className="lab-phone-edition">
            <IdentityVector identity={identity} product={0} compact />
            <div>
              <strong>Sori</strong>
              <p>AUDIO / v4.8.2</p>
            </div>
          </div>
          <LabSiteFooter />
        </div>
      </section>
    );
  if (context === "favicon")
    return (
      <section className="lab-favicon-context">
        <h1>Small. Still Harulo.</h1>
        <p>
          Browser-tab and application-chrome simulations. This does not replace
          the production favicon.
        </p>
        <div className="lab-browser-tabs">
          {[16, 24, 32].map((size) => (
            <div key={size}>
              <span style={{ width: size, height: size }}>
                <IdentityVector identity={identity} compact />
              </span>
              <span>Harulo Studio</span>
              <span>×</span>
            </div>
          ))}
        </div>
        <div className="lab-favicon-dock">
          {[16, 24, 32, 48, 96].map((size) => (
            <figure key={size}>
              <div style={{ width: size, height: size }}>
                <IdentityVector identity={identity} compact />
              </div>
              <figcaption>{size}px</figcaption>
            </figure>
          ))}
        </div>
        <p>
          Current color world: {palette.name}. Use Specimens for 256px,
          viewport-scale and monochrome tests.
        </p>
      </section>
    );
  return (
    <section className="lab-transition-context">
      <div className="lab-context-intro">
        <span>
          {context === "loading"
            ? "LOADING / FINITE IDENTITY CYCLE"
            : "PAGE TRANSITION / THRESHOLD STUDY"}
        </span>
        <h1>
          {context === "loading"
            ? "A moment with meaning."
            : "The mark is the passage."}
        </h1>
        <p>
          {context === "loading"
            ? "A single deliberate cycle, not an endless spinner. Loading never conceals essential content or delays navigation."
            : "Play the transition in a representative page frame. The same geometry establishes the next software environment; native navigation remains immediate."}
        </p>
      </div>
      <div className="lab-route-frame">
        <div className="lab-route-chrome">
          <IdentityWordmark identity={identity} compact />
          <span>
            {context === "loading"
              ? "HARULO / OPENING AN EDITION"
              : "STUDIO → SOFTWARE"}
          </span>
        </div>
        <TransformationPlayer
          identity={identity}
          transformation={transformation}
        />
        <div className="lab-route-destination">
          <IdentityImprint
            identity={identity}
            edition="SORI / 4.8.2 / DESIGN EDITION"
          />
          <Button asChild>
            <Link href="/preview/identity-lab/software/sori">
              Open the destination ↗
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
