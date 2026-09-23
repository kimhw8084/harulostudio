"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicationInstrument } from "@/components/application-instrument";
import { showcaseProducts } from "@/lib/publishing/showcase";
import { brandCopy } from "@/lib/brand/copy";
import { interpolatePose, motion, REST, type BrandPose } from "@/lib/brand/motion";
import { useExperience } from "@/components/experience-provider";
import { HaruloMark } from "./harulo-mark";

export type GenesisPhase = "resting" | "opening" | "open" | "switching" | "closing";

const WORKING: BrandPose = {
  ring: { x: 5, y: 5, width: 90, height: 90, rx: 15, strokeWidth: 1.5 },
  satellite: { cx: 88, cy: 10, r: 3.2 },
  primary: { x: 13, y: 94, width: 74, height: 2.5, rx: 1.25 },
  secondary: { x: 13, y: 98, width: 40, height: 1.6, rx: .8 },
};

export function SoftwareOrigin() {
  const id = useId();
  const [selected, setSelected] = useState(showcaseProducts[0]?.slug ?? "");
  const [phase, setPhase] = useState<GenesisPhase>("resting");
  const [desiredOpen, setDesiredOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);
  const { ready, reduced } = useExperience();
  const active = phase !== "resting";
  const selectedProduct = showcaseProducts.find((product) => product.slug === selected) ?? showcaseProducts[0];
  const panelId = `${id}-panel`;

  useLayoutEffect(() => {
    if (scrollRef.current === null) return;
    const top = scrollRef.current;
    scrollRef.current = null;
    window.scrollTo({ top, behavior: "instant" });
  }, [desiredOpen, selected]);

  useEffect(() => {
    if (reduced) return;
    const start = progressRef.current;
    const end = desiredOpen ? 1 : 0;
    if (start === end) {
      const frame = requestAnimationFrame(() => setPhase(end ? "open" : "resting"));
      return () => cancelAnimationFrame(frame);
    }
    const duration = (desiredOpen ? motion.genesisOpen : motion.genesisClose) * Math.abs(end - start);
    let frame = 0;
    let began = 0;
    const step = (now: number) => {
      if (!began) began = now;
      const t = Math.min(1, (now - began) / duration);
      const next = start + (end - start) * t;
      progressRef.current = next;
      setProgress(next);
      if (t < 1) frame = requestAnimationFrame(step);
      else setPhase(end ? "open" : "resting");
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [desiredOpen, reduced]);

  useEffect(() => {
    if (!reduced) return;
    const end = desiredOpen ? 1 : 0;
    progressRef.current = end;
    const frame = requestAnimationFrame(() => { setProgress(end); setPhase(end ? "open" : "resting"); });
    return () => cancelAnimationFrame(frame);
  }, [desiredOpen, reduced]);

  useEffect(() => {
    if (phase !== "switching") return;
    const timer = window.setTimeout(() => setPhase("open"), reduced ? 0 : motion.genesisSwitch);
    return () => clearTimeout(timer);
  }, [phase, reduced, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !desiredOpen) return;
      event.preventDefault();
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function open() {
    scrollRef.current = window.scrollY;
    setPhase(reduced ? "open" : "opening");
    setDesiredOpen(true);
  }
  function close() {
    scrollRef.current = window.scrollY;
    if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    setPhase(reduced ? "resting" : "closing");
    setDesiredOpen(false);
  }
  function select(slug: string) {
    if (slug === selected) return;
    scrollRef.current = window.scrollY;
    setSelected(slug);
    if (desiredOpen) setPhase(reduced ? "open" : "switching");
  }

  return <section className="software-origin publication-genesis" aria-labelledby={`${id}-title`}>
    <div className="origin-topline"><h2 id={`${id}-title`}>{brandCopy.genesis}</h2><span className="metadata">PUBLICATION GENESIS</span></div>
    <div id="genesis-stage" className="genesis-stage" data-open={active} data-phase={phase} data-product={selectedProduct?.slug}>
      <div className="genesis-mark" aria-hidden="true"><HaruloMark pose={progress >= 1 ? WORKING : progress <= 0 ? REST : interpolatePose(REST, WORKING, progress)} /></div>
      <div id={panelId} ref={panelRef} className="genesis-interface" aria-label="Showcase publication workspace" aria-hidden={!desiredOpen} inert={!desiredOpen ? true : undefined}>
        <div className="genesis-interface-topline metadata"><span>HARULO / SHOWCASE</span></div>
        <Tabs value={selected} onValueChange={select} orientation="horizontal">
          <TabsList aria-label="Showcase publications">{showcaseProducts.map((product) => <TabsTrigger key={product.slug} value={product.slug}>{product.name}</TabsTrigger>)}</TabsList>
          {showcaseProducts.map((product) => <TabsContent key={product.slug} value={product.slug} forceMount><ApplicationInstrument name={product.name} kind={product.icon} mode="genesis" /></TabsContent>)}
        </Tabs>
      </div>
    </div>
    <div className="genesis-controls"><p className="genesis-copy">The four parts of the mark become a working software concept.</p><Button ref={triggerRef} className="genesis-toggle" type="button" variant="outline" disabled={!ready} aria-controls={panelId} aria-expanded={active} onClick={() => desiredOpen ? close() : open()}>{active ? "Close example" : "Open example"}<ArrowUpRight aria-hidden="true" /></Button></div>
    <p className="genesis-disclosure">Interactive concept — not released software.</p>
    <noscript><p>The interactive concept requires JavaScript. No showcase software is currently available.</p></noscript>
  </section>;
}
