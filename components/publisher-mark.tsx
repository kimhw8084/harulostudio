import { ArrowUpRight } from "lucide-react";
import { BrandSlot } from "./brand-slot";
export function FoldMark({ className = "" }: { className?: string }) {
  return (
    <BrandSlot>
      <svg
        className={`fold-mark ${className}`}
        viewBox="0 0 48 48"
        fill="currentColor"
        aria-hidden="true"
      >
        <g transform="rotate(-30 24 24)">
          {[20, 32, 40, 40, 32, 20].map((width, i) => (
            <rect
              key={i}
              x={(48 - width) / 2}
              y={6 + i * 6}
              width={width}
              height="4"
            />
          ))}
        </g>
      </svg>
    </BrandSlot>
  );
}
export function PublisherMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`publisher-mark ${compact ? "compact" : ""}`}>
      <FoldMark />
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
