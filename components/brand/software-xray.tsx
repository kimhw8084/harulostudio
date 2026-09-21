"use client";
import { useState, type ReactNode } from "react";
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
          <div className="xray-ui">{children}</div>
          <div className="xray-reading">
            <span className="xray-lens" aria-hidden="true" />
            <TabsContent value="interface">
              <h3>Make a small change.</h3>
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
              <h3>The shortest path is yours.</h3>
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
              <h3>More than the visible surface.</h3>
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
              <h3>A deliberate boundary.</h3>
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
