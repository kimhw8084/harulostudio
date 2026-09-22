"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Product } from "@/lib/publishing/types";
import { BrandScene } from "./scene/brand-scene";
import { HaruloEnvironment } from "./environments/harulo-environment";
import { PublicationRails } from "./scene/effects";
export function SoftwareXRay({
  product,
  children,
  compact = false,
}: {
  product: Product;
  children: ReactNode;
  compact?: boolean;
}) {
  const [layer, setLayer] = useState("interface");
  const [targets, setTargets] = useState<string[]>([]);
  const uiRef = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    const root = uiRef.current;
    if (!root) return;
    const read = () => setTargets(Array.from(root.querySelectorAll<HTMLElement>("button,input,textarea,select")).map((control, index) => {
      const label = control.getAttribute("aria-label") || control.getAttribute("name") || root.querySelector(`label[for="${control.id}"]`)?.textContent?.trim() || control.textContent?.trim() || control.tagName;
      return `${index + 1}. ${label}`;
    }));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true });
    return () => observer.disconnect();
  }, [product, layer]);
  return (
    <BrandScene
      className={`software-xray ${compact ? "xray-compact" : ""}`}
      systems="01 05 19 23"
    >
      <HaruloEnvironment material="membrane" />
      {!compact && (
        <PublicationRails
          title={
            <h2>
              Care, beneath
              <br />
              the surface.
            </h2>
          }
          metadata={`${product.name.toUpperCase()} / INTERFACE SPECIMEN / NOT A RELEASED APPLICATION`}
        />
      )}
      <Tabs value={layer} onValueChange={setLayer}>
        <TabsList aria-label="Software inspection layer">
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="data">Data boundary</TabsTrigger>
        </TabsList>
        <div className="xray-world">
          <div className="xray-ui" ref={uiRef} data-layer={layer} aria-describedby={`${id}-overlay`}>
            {children}
            {layer !== "interface" && (
              <div className="xray-overlay" id={`${id}-overlay`} aria-hidden="true">
                <strong>{layer === "keyboard" ? "Actual focus targets" : layer === "accessibility" ? "Actual semantic controls" : "Local state boundary"}</strong>
                <ol>{targets.map((target) => <li key={target}>{target}</li>)}</ol>
                {layer === "data" && <span className="metadata">USER ACTION → LOCAL REDUCER → VISIBLE RESULT</span>}
              </div>
            )}
          </div>
          <div className="xray-reading">
            <span className="xray-lens" aria-hidden="true" />
            <TabsContent value="interface">
              <h2>Make a small change.</h2>
              <p>
                These controls work. Change a value, write a note, or switch a
                state. This specimen keeps your interaction in memory only.
              </p>
              <p>
                No account. No network requests. No implied product
                availability.
              </p>
            </TabsContent>
            <TabsContent value="keyboard">
              <h2>The shortest path is yours.</h2>
              <ol>
                <li>Tab moves to the next named control.</li>
                <li>Shift + Tab moves back.</li>
                <li>Enter or Space activates buttons.</li>
                <li>Arrow keys move within tab groups and sliders.</li>
              </ol>
              <p>
                Visible focus stays above the optical layer. The lens never
                intercepts input.
              </p>
            </TabsContent>
            <TabsContent value="accessibility">
              <h2>More than the visible surface.</h2>
              <ul>
                {product.accessibility.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <p>
                Values are exposed as text. Motion never carries the only
                explanation.
              </p>
            </TabsContent>
            <TabsContent value="data">
              <h2>A deliberate boundary.</h2>
              <p>
                This working specimen uses transient browser memory. Reloading
                clears its content. It does not implement the fictional
                product’s storage or sync service.
              </p>
              <p>{product.privacy?.storage}</p>
              <span className="metadata">
                INPUT → LOCAL STATE → VISIBLE RESULT
              </span>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </BrandScene>
  );
}
