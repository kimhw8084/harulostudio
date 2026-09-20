"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MinuteInstrument } from "@/components/minute-instrument";
import { useExperience } from "@/components/experience-provider";
import { HaruloMark } from "./harulo-mark";
import { useBrandTransition } from "./use-brand-motion";
import { REST, interpolatePose, studyById } from "@/lib/brand/motion";

/** The logo is the interface frame, not an illustration behind an unrelated card. */
export function SoftwareOrigin() {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const { ready, paused, reduced } = useExperience();
  const touched = useRef(false);
  const { ref, amount } = useBrandTransition(open);
  const id = useId();
  useEffect(() => {
    if (!ready || paused || reduced || touched.current) return;
    const node = ref.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => clearTimeout(timer);
    const observer = new IntersectionObserver(
      ([entry]) => {
        cancel();
        if (entry.intersectionRatio < 0.55 || document.hidden) return;
        timer = setTimeout(() => {
          if (
            touched.current ||
            document.hidden ||
            node.contains(document.activeElement)
          )
            return;
          touched.current = true;
          setOpen(true);
        }, 2200);
      },
      { threshold: [0.55] },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", cancel);
    return () => {
      cancel();
      observer.disconnect();
      document.removeEventListener("visibilitychange", cancel);
    };
  }, [ready, paused, reduced, ref]);
  const pose =
    amount === 0
      ? REST
      : interpolatePose(REST, studyById("open").target, amount);
  // The live DOM surface follows the very same contour as the SVG ring.
  const { ring } = pose;
  const clip = `inset(${ring.y}% ${100 - ring.x - ring.width}% ${100 - ring.y - ring.height}% ${ring.x}% round ${ring.rx}%)`;
  return (
    <div
      className="software-origin"
      data-open={open}
      ref={ref}
      style={{ "--opening": amount } as CSSProperties}
    >
      <div className="origin-topline metadata">
        <span>HARULO / WORKING STUDY 001</span>
        <span>{open ? "A LITTLE SPACE" : "FOUR PIECES. A POSSIBILITY."}</span>
      </div>
      <div className="origin-canvas">
        <div
          className="origin-surface"
          style={{ clipPath: clip }}
          aria-hidden={!open}
        >
          <div id={id} className="origin-application" hidden={!open}>
            {open && <MinuteInstrument onProgress={setRemaining} />}
          </div>
        </div>
        <HaruloMark
          className="origin-mark"
          pose={pose}
          preserveAspectRatio={amount > 0 ? "none" : undefined}
        />
        {open && (
          <div className="origin-publication metadata">
            <span>
              ONE MINUTE / {String(60 - remaining).padStart(2, "0")} SEC
            </span>
            <span>DESIGNED, BUILT, SHARED.</span>
          </div>
        )}
      </div>
      <div className="origin-controls">
        <p>
          {open
            ? "A working studio experiment. Not a released product."
            : "A symbol can become something useful. Try it."}
        </p>
        <Button
          className="origin-trigger"
          disabled={!ready}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            touched.current = true;
            setOpen(!open);
          }}
        >
          {open ? "Return to the mark" : "Open a little space"}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
      <noscript>
        <p className="origin-noscript">
          The studio experiment needs JavaScript. Everything about Harulo and
          its publications is available without it.
        </p>
      </noscript>
    </div>
  );
}
