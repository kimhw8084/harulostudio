"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type TransitionEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicationInstrument } from "@/components/application-instrument";
import { showcaseProducts } from "@/lib/publishing/showcase";
import { brandCopy } from "@/lib/brand/copy";
import { useExperience } from "@/components/experience-provider";
import { HaruloMark } from "./harulo-mark";
import { useBrandScene } from "./scene/brand-scene";

export type GenesisPhase = "resting" | "opening" | "open" | "switching" | "closing";

/** The mark and specimen share one stage; closed panels stay inert but mounted. */
export function SoftwareOrigin() {
  const id = useId();
  const [selected, setSelected] = useState(showcaseProducts[0]?.slug ?? "");
  const [phase, setPhase] = useState<GenesisPhase>("resting");
  const requestedOpen = useRef(false);
  const preservedScroll = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { reduced } = useExperience();
  const scene = useBrandScene();
  const active = phase !== "resting";
  const acceptingInput = phase === "open" || phase === "switching";
  const selectedProduct = showcaseProducts.find((product) => product.slug === selected) ?? showcaseProducts[0];
  const panelId = `${id}-panel`;

  useLayoutEffect(() => {
    if (preservedScroll.current === null) return;
    const top = preservedScroll.current;
    preservedScroll.current = null;
    window.scrollTo({ top, behavior: "auto" });
  }, [phase, selected]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || !active) return;
      event.preventDefault();
      close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  function open() {
    if (requestedOpen.current && phase !== "closing") return;
    requestedOpen.current = true;
    preservedScroll.current = window.scrollY;
    scene?.emit({ type: "publication.open", productId: selected });
    setPhase(reduced ? "open" : "opening");
  }
  function close() {
    if (!requestedOpen.current && phase === "resting") return;
    requestedOpen.current = false;
    preservedScroll.current = window.scrollY;
    scene?.emit({ type: "publication.close" });
    if (panelRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
    setPhase(reduced ? "resting" : "closing");
  }
  function select(slug: string) {
    if (slug === selected) return;
    scene?.emit({ type: "publication.select", productId: slug });
    preservedScroll.current = window.scrollY;
    setSelected(slug);
    if (active) setPhase(reduced ? "open" : "switching");
  }
  function handleInterfaceTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "clip-path") return;
    if (phase === "opening" || phase === "switching") setPhase("open");
    if (phase === "closing") setPhase("resting");
  }
  function handleInterfaceTransitionCancel(event: TransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== "clip-path") return;
    // CSS reverses from the current interpolated clip-path. Re-assert the
    // latest intent rather than allowing an interrupted phase to strand.
    setPhase(requestedOpen.current ? (reduced ? "open" : "opening") : (reduced ? "resting" : "closing"));
  }

  return (
    <section className="software-origin publication-genesis" aria-labelledby={`${id}-title`}>
      <div className="origin-topline metadata">
        <h2 id={`${id}-title`}>{brandCopy.genesis}</h2>
        <span>SHOWCASE ONLY · NOTHING SAVED OR SENT</span>
      </div>
      <div
        id="genesis-stage"
        className="genesis-stage"
        data-open={active}
        data-phase={phase}
        data-product={selectedProduct?.slug}
      >
        <div className="genesis-mark" aria-hidden="true">
          <HaruloMark />
        </div>
        <div className="genesis-identity-rails" aria-hidden="true">
          <span className="genesis-primary-rail" />
          <span className="genesis-secondary-rail" />
        </div>
        <div
          id={panelId}
          ref={panelRef}
          className="genesis-interface"
          onTransitionEnd={handleInterfaceTransitionEnd}
          onTransitionCancel={handleInterfaceTransitionCancel}
          aria-label="Showcase publication workspace"
          aria-hidden={!acceptingInput}
          inert={!acceptingInput ? true : undefined}
        >
          <div className="genesis-interface-topline metadata">
            <span>HARULO / SHOWCASE</span>
            <span>INTERACTIVE CONCEPT</span>
          </div>
          <Tabs value={selected} onValueChange={select} orientation="horizontal">
            <TabsList aria-label="Showcase publications">
              {showcaseProducts.map((product) => (
                <TabsTrigger key={product.slug} value={product.slug}>
                  {product.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {showcaseProducts.map((product) => (
              <TabsContent key={product.slug} value={product.slug} forceMount>
                <ApplicationInstrument name={product.name} kind={product.icon} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="genesis-controls">
        <div>
          <p className="eyebrow">{active ? "THE MARK IS WORKING" : "THE MARK AT REST"}</p>
          <p className="genesis-copy">
            Select an interactive concept. The same four-part identity becomes
            its working interface.
          </p>
        </div>
        <Button
          ref={triggerRef}
          className="genesis-toggle"
          type="button"
          variant="outline"
          aria-controls={panelId}
          aria-expanded={active}
          onClick={() => (active ? close() : open())}
        >
          {active ? "Close example" : "Open example"}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
      <p className="genesis-disclosure">Interactive concept — not released software.</p>
      <noscript>
        <p className="origin-noscript">
          The publication studies need JavaScript for their working controls.
          Harulo is an independent software publisher; no showcase product is
          currently available.
        </p>
      </noscript>
    </section>
  );
}
