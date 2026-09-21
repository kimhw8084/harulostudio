import { ArrowUpRight } from "lucide-react";
import { BrandSlot } from "./brand-slot";
import { HaruloMark } from "./brand/harulo-mark";
export function PublisherSymbol({ className = "" }: { className?: string }) {
  return (
    <BrandSlot>
      <HaruloMark className={className} />
    </BrandSlot>
  );
}
// Kept as a small source-compatible alias for existing shell call sites.
export const FoldMark = PublisherSymbol;
export function PublisherMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`publisher-mark ${compact ? "compact" : ""}`}>
      <PublisherSymbol />
      <span>
        HARULO STUDIO
        <span>
          {compact ? "SOFTWARE, PUBLISHED." : "INDEPENDENT SOFTWARE PUBLISHER"}
        </span>
      </span>
    </span>
  );
}
export function Direction() {
  return <ArrowUpRight aria-hidden="true" className="direction" />;
}
