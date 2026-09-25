"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Product } from "@/lib/publishing/types";

type Target = { label: string; x: number; y: number };
type Group = { id: string; label: string };

const dataPaths: Record<string, [string, string, string]> = {
  sori: ["Music volume or mute", "channel.level and channel.muted", "Channel percentage and button state"],
  namu: ["Selected note edit", "Selected note title or body", "Editor content and note list"],
  goyo: ["Start or pause", "Session phase and deadline", "Clock and status"],
  "haru-weather": ["Location or period", "Selected forecast points", "Summary, table, and timeline"],
  dami: ["Allocation in US dollars", "Integer-cent allocation", "Remaining total and chart"],
};

function accessibleName(control: HTMLElement) {
  const labelledBy = control.getAttribute("aria-labelledby");
  if (labelledBy) {
    const name = labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim()).filter(Boolean).join(" ");
    if (name) return name;
  }
  const explicit = control.getAttribute("aria-label")?.trim();
  if (explicit) return explicit;
  if ("labels" in control) {
    const labels = (control as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).labels;
    const name = Array.from(labels ?? []).map((label) => label.textContent?.trim()).filter(Boolean).join(" ");
    if (name) return name;
  }
  return control.textContent?.trim() || control.tagName.toLowerCase();
}

export function SoftwareXRay({ product, children }: { product: Product; children: ReactNode }) {
  const [layer, setLayer] = useState("interface");
  const [open, setOpen] = useState(false);
  const [targets, setTargets] = useState<Target[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const specimen = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || (layer !== "keyboard" && layer !== "accessibility")) return;
    const root = specimen.current;
    const frame = stage.current;
    if (!root || !frame) return;
    let frameId = 0;
    const read = () => {
      frameId = 0;
      const outer = frame.getBoundingClientRect();
      const controls = Array.from(root.querySelectorAll<HTMLElement>("button,input,textarea,select")).filter((control) =>
        control.getClientRects().length > 0 && !control.matches(":disabled, [type=hidden]"),
      );
      setTargets(controls.map((control) => {
        const rect = control.getBoundingClientRect();
        return { label: accessibleName(control), x: Math.max(0, rect.left - outer.left), y: Math.max(0, rect.top - outer.top) };
      }));
      setGroups(Array.from(root.querySelectorAll<HTMLElement>("[data-inspection-group]")).filter((element) => element.getClientRects().length > 0).map((element) => ({
        id: element.id,
        label: element.dataset.inspectionGroup || element.getAttribute("aria-label") || "Group",
      })));
    };
    const schedule = () => { if (!frameId) frameId = requestAnimationFrame(read); };
    read();
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    const mutations = new MutationObserver(schedule);
    mutations.observe(root, { subtree: true, attributes: true, childList: true, characterData: true, attributeFilter: ["aria-label", "aria-labelledby", "aria-pressed", "disabled", "id", "value"] });
    root.addEventListener("input", schedule, true);
    root.addEventListener("change", schedule, true);
    root.addEventListener("click", schedule, true);
    root.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frameId);
      resize.disconnect();
      mutations.disconnect();
      root.removeEventListener("input", schedule, true);
      root.removeEventListener("change", schedule, true);
      root.removeEventListener("click", schedule, true);
      root.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [open, layer, product]);

  const path = dataPaths[product.slug];
  return <div className="software-xray" data-layer={open ? layer : "closed"}>
    <div className="xray-stage" ref={stage}>
      <div className="xray-specimen" ref={specimen}>{children}</div>
      {open && layer === "keyboard" && <div className="xray-badges" aria-hidden="true">{targets.map((target, index) => <span key={index} style={{ left: target.x, top: target.y }}>{index + 1}</span>)}</div>}
    </div>
    <details className="xray-inspection" open={open}>
      <summary onClick={(event) => { event.preventDefault(); setOpen((value) => !value); }}>Inspect this interface</summary>
      <div className="xray-panel">
        <Tabs value={layer} onValueChange={setLayer}>
          <TabsList aria-label="Software inspection layer">
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="data">Data boundary</TabsTrigger>
          </TabsList>
          <div className="xray-reading">
            <TabsContent value="interface"><h2>{product.name} controls</h2><p>The working concept remains available above. Inspection does not reset it.</p></TabsContent>
            <TabsContent value="keyboard"><h2>Focus order</h2><p>Tab and Shift + Tab move between these controls. Arrow keys adjust sliders.</p><ol>{targets.map((target, index) => <li key={index}><span>{index + 1}</span>{target.label}</li>)}</ol></TabsContent>
            <TabsContent value="accessibility"><h2>Semantic groups</h2><ul>{groups.map((group) => <li key={group.id}>{group.label}</li>)}</ul><p>Named controls and their current states remain available in the working interface.</p></TabsContent>
            <TabsContent value="data"><h2>Local state path</h2>{path && <p className="xray-data-path">{path[0]} <span aria-hidden="true">→</span> {path[1]} <span aria-hidden="true">→</span> {path[2]}</p>}<p>Reloading clears the sample. No account, storage service, or sync is connected.</p></TabsContent>
          </div>
        </Tabs>
      </div>
    </details>
  </div>;
}
