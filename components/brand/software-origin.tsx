"use client";

import { useEffect, useId, useLayoutEffect, useReducer, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ApplicationInstrument } from "@/components/application-instrument";
import { showcaseProducts } from "@/lib/publishing/showcase";
import { brandCopy } from "@/lib/brand/copy";
import { ease, interpolatePose, motion, REST, type BrandPose } from "@/lib/brand/motion";
import { useExperience } from "@/components/experience-provider";
import { HaruloMark } from "./harulo-mark";

export type GenesisPhase = "resting" | "opening" | "open" | "closing";
type GenesisState = { phase: GenesisPhase; selected: string; progress: number };
type GenesisAction =
  | { type: "open" | "close"; instant: boolean }
  | { type: "select"; slug: string }
  | { type: "frame"; phase: GenesisPhase; progress: number }
  | { type: "finish"; phase: GenesisPhase };

function genesisReducer(state: GenesisState, action: GenesisAction): GenesisState {
  switch (action.type) {
    case "open":
      return { ...state, phase: action.instant ? "open" : "opening", progress: action.instant ? 1 : state.progress };
    case "close":
      return { ...state, phase: action.instant ? "resting" : "closing", progress: action.instant ? 0 : state.progress };
    case "select":
      return { ...state, selected: action.slug };
    case "frame":
      return state.phase === action.phase ? { ...state, progress: action.progress } : state;
    case "finish":
      return state.phase === action.phase ? { ...state, phase: action.phase === "opening" ? "open" : "resting", progress: action.phase === "opening" ? 1 : 0 } : state;
  }
}

const WORKING: BrandPose = {
  ring: { x: 5, y: 5, width: 90, height: 90, rx: 15, strokeWidth: 1.5 },
  satellite: { cx: 88, cy: 10, r: 3.2 },
  primary: { x: 13, y: 94, width: 74, height: 2.5, rx: 1.25 },
  secondary: { x: 13, y: 98, width: 40, height: 1.6, rx: .8 },
};

function workingFrame(contentHeight: number, markWidth: number): BrandPose {
  const extent = Math.max(100, contentHeight / Math.max(1, markWidth) * 100);
  return {
    ring: { x: 5, y: 4, width: 90, height: extent - 12, rx: 15, strokeWidth: 1.5 },
    satellite: { cx: 88, cy: 10, r: 3.2 },
    primary: { x: 13, y: extent - 6, width: 74, height: 2.5, rx: 1.25 },
    secondary: { x: 13, y: extent - 2.5, width: 40, height: 1.6, rx: .8 },
  };
}

export function SoftwareOrigin() {
  const id = useId();
  const [state, dispatch] = useReducer(genesisReducer, { phase: "resting", selected: showcaseProducts[0]?.slug ?? "", progress: 0 });
  const [contentHeight, setContentHeight] = useState(0);
  const [stageWidth, setStageWidth] = useState(520);
  const [compact, setCompact] = useState(false);
  const progressRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useExperience();
  const expanded = state.phase === "opening" || state.phase === "open";
  const operable = state.phase === "open";
  const selectedProduct = showcaseProducts.find((product) => product.slug === state.selected) ?? showcaseProducts[0];
  const working = compact ? WORKING : workingFrame(contentHeight, Math.min(stageWidth, 560));
  const panelId = `${id}-panel`;

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const measure = () => setContentHeight(node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const media = matchMedia("(max-width: 720px)");
    const measure = () => {
      setCompact(media.matches);
      setStageWidth(stageRef.current?.getBoundingClientRect().width ?? 520);
    };
    measure();
    media.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => { media.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    if (state.phase !== "opening" && state.phase !== "closing") return;
    const phase = state.phase;
    const start = progressRef.current;
    const end = phase === "opening" ? 1 : 0;
    if (reduced) {
      progressRef.current = end;
      const frame = requestAnimationFrame(() => dispatch({ type: "finish", phase }));
      return () => cancelAnimationFrame(frame);
    }
    if (start === end) {
      const frame = requestAnimationFrame(() => dispatch({ type: "finish", phase }));
      return () => cancelAnimationFrame(frame);
    }
    const duration = (phase === "opening" ? motion.genesisOpen : motion.genesisClose) * Math.abs(end - start);
    let frame = 0;
    let began = 0;
    const step = (now: number) => {
      if (!began) began = now;
      const t = Math.min(1, (now - began) / duration);
      const next = start + (end - start) * ease(t);
      progressRef.current = next;
      dispatch({ type: "frame", phase, progress: next });
      if (t < 1) frame = requestAnimationFrame(step);
      else dispatch({ type: "finish", phase });
    };
    const settleWhenHidden = () => {
      if (!document.hidden) return;
      cancelAnimationFrame(frame);
      progressRef.current = end;
      dispatch({ type: "finish", phase });
    };
    frame = requestAnimationFrame(step);
    document.addEventListener("visibilitychange", settleWhenHidden);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", settleWhenHidden); };
  }, [state.phase, reduced]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !expanded) return;
      event.preventDefault();
      if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
      if (reduced) progressRef.current = 0;
      dispatch({ type: "close", instant: reduced });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, reduced]);

  function open() {
    if (reduced) progressRef.current = 1;
    dispatch({ type: "open", instant: reduced });
  }
  function close() {
    if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    if (reduced) progressRef.current = 0;
    dispatch({ type: "close", instant: reduced });
  }
  function select(slug: string) {
    if (slug !== state.selected) dispatch({ type: "select", slug });
  }

  return <section className="software-origin publication-genesis" aria-labelledby={`${id}-title`}>
    <div className="origin-topline"><h2 id={`${id}-title`}>{brandCopy.genesis}</h2><span className="metadata">PUBLICATION GENESIS</span></div>
    <div id="genesis-stage" ref={stageRef} className="genesis-stage" data-expanded={expanded} data-phase={state.phase} data-progress={state.progress.toFixed(3)} data-product={selectedProduct?.slug} style={{ "--genesis-content-height": `${contentHeight}px` } as CSSProperties}>
      <div className="genesis-mark" aria-hidden="true"><HaruloMark pose={state.progress >= 1 ? working : state.progress <= 0 ? REST : interpolatePose(REST, working, state.progress)} /></div>
      <div id={panelId} ref={panelRef} className="genesis-interface" aria-label="Showcase publication workspace" aria-hidden={!operable} inert={!operable ? true : undefined}>
        <div ref={contentRef} className="genesis-interface-content"><div className="genesis-interface-topline metadata"><span>HARULO / SHOWCASE</span></div>
          <Tabs value={state.selected} onValueChange={select} orientation="horizontal">
            <TabsList aria-label="Showcase publications">{showcaseProducts.map((product) => <TabsTrigger key={product.slug} value={product.slug}>{product.name}</TabsTrigger>)}</TabsList>
            {showcaseProducts.map((product) => <TabsContent key={product.slug} value={product.slug} forceMount><ApplicationInstrument name={product.name} kind={product.icon} mode="genesis" /></TabsContent>)}
          </Tabs>
        </div>
      </div>
    </div>
    <div className="genesis-controls"><p className="genesis-copy">The four parts of the mark become a working software concept.</p><Button ref={triggerRef} className="genesis-toggle" type="button" variant="outline" disabled={!ready} aria-controls={panelId} aria-expanded={expanded} onClick={() => expanded ? close() : open()}>{expanded ? "Close example" : "Open example"}<ArrowUpRight aria-hidden="true" /></Button></div>
    <p className="genesis-disclosure">Interactive concept — not released software.</p>
    <noscript><p>The interactive concept requires JavaScript. No showcase software is currently available.</p></noscript>
  </section>;
}
