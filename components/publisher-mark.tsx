import { Sun, ArrowUpRight } from "lucide-react";
export function PublisherMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`publisher-mark ${compact ? "compact" : ""}`}>
      <Sun aria-hidden="true" />
      <span>
        HARULO STUDIO
        <br />
        <span>
          {compact ? "SOFTWARE PUBLISHER" : "INDEPENDENT SOFTWARE PUBLISHER"}
        </span>
      </span>
    </span>
  );
}
export function Direction() {
  return <ArrowUpRight aria-hidden="true" className="direction" />;
}
