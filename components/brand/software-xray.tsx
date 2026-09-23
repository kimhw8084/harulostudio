"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Product } from "@/lib/publishing/types";

type Target = { label: string; x: number; y: number };

export function SoftwareXRay({ product, children }: { product: Product; children: ReactNode }) {
  const [layer, setLayer] = useState("interface");
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const specimen = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || layer !== "keyboard") return;
    const root = specimen.current;
    const frame = stage.current;
    if (!root || !frame) return;
    const read = () => {
      const outer = frame.getBoundingClientRect();
      setTargets(Array.from(root.querySelectorAll<HTMLElement>("button,input,textarea,select")).filter((control) => control.getClientRects().length > 0).map((control) => {
        const label = control.getAttribute("aria-label") || control.getAttribute("name") || root.querySelector(`label[for="${control.id}"]`)?.textContent?.trim() || control.textContent?.trim() || control.tagName.toLowerCase();
        const rect = control.getBoundingClientRect();
        return { label, x: Math.max(0, rect.left - outer.left), y: Math.max(0, rect.top - outer.top) };
      }));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(root);
    window.addEventListener("resize", read);
    return () => { observer.disconnect(); window.removeEventListener("resize", read); };
  }, [open, layer, product]);

  return <div className="software-xray" data-layer={open ? layer : "closed"}>
    <div className="xray-stage" ref={stage}>
      <div className="xray-specimen" ref={specimen}>{children}</div>
      {open && layer === "keyboard" && <div className="xray-badges" aria-hidden="true">{targets.map((target, index) => <span key={`${index}-${target.label}`} style={{ left: target.x, top: target.y }}>{index + 1}</span>)}</div>}
    </div>
    <details className="xray-inspection" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>Inspect this interface</summary>
      <div className="xray-panel">
        <Tabs value={layer} onValueChange={setLayer}>
          <TabsList aria-label="Software inspection layer">
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="data">Data boundary</TabsTrigger>
          </TabsList>
          <div className="xray-reading">
            <TabsContent value="interface"><h2>{product.name} controls</h2><p>Change a value in the working concept above. State stays in this browser page.</p></TabsContent>
            <TabsContent value="keyboard"><h2>Focus order</h2><p>Tab and Shift + Tab move between these controls. Arrow keys adjust sliders.</p><ol>{targets.map((target, index) => <li key={`${index}-${target.label}`}><span>{index + 1}</span>{target.label}</li>)}</ol></TabsContent>
            <TabsContent value="accessibility"><h2>Accessible controls</h2><ul>{product.accessibility.map((item) => <li key={item}>{item}</li>)}</ul><p>Values and state are available as text and named controls.</p></TabsContent>
            <TabsContent value="data"><h2>Local state boundary</h2><p>USER ACTION → LOCAL STATE → VISIBLE RESULT</p><p>Reloading clears the sample. No product account, storage service, or sync is connected.</p></TabsContent>
          </div>
        </Tabs>
      </div>
    </details>
  </div>;
}
