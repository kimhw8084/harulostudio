"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationInstrument } from "@/components/application-instrument";
import { showcaseProducts } from "@/lib/publishing/showcase";
import { HaruloMark } from "./harulo-mark";

/** Publication Genesis: the canonical mark stays visible while a local,
 * functional showcase instrument grows from its four primitives. */
export function SoftwareOrigin() {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(true);
  const product = showcaseProducts[selected];

  return (
    <section className="software-origin publication-genesis" aria-labelledby="genesis-title">
      <div className="origin-topline metadata">
        <span id="genesis-title">PUBLICATION GENESIS / A WORKING STUDY</span>
        <span>SHOWCASE ONLY · NOTHING SAVED OR SENT</span>
      </div>
      <div className="genesis-stage" data-open={open} data-product={product.slug}>
        <div className="genesis-mark" aria-hidden="true">
          <HaruloMark />
          <span className="genesis-signal" />
        </div>
        <div className="genesis-interface">
          <div className="genesis-interface-topline metadata">
            <span>HARULO / EDITION {product.edition}</span>
            <span>INTERACTIVE CONCEPT</span>
          </div>
          <ApplicationInstrument name={product.name} kind={product.icon} />
        </div>
      </div>
      <div className="genesis-controls">
        <div>
          <p className="eyebrow">THE MARK BECOMES SOFTWARE</p>
          <p className="genesis-copy">
            Choose a showcase publication. The same four-part identity becomes
            its working interface.
          </p>
        </div>
        <div className="genesis-product-tabs" role="tablist" aria-label="Showcase publications">
          {showcaseProducts.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected === index}
              className={selected === index ? "is-active" : ""}
              onClick={() => {
                setSelected(index);
                setOpen(true);
              }}
            >
              <span className="metadata">{item.edition}</span>
              {item.name}
            </button>
          ))}
        </div>
        <Button
          className="genesis-toggle"
          type="button"
          variant="outline"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Return to the mark" : `Generate ${product.name}`}
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
      <p className="genesis-disclosure">
        Showcase publication · Interactive concept · Not currently available
      </p>
      <noscript>
        <p className="origin-noscript">
          The interactive publication studies need JavaScript. Harulo is an
          independent software publisher; no showcase product is currently
          available.
        </p>
      </noscript>
    </section>
  );
}
