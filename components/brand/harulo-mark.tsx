import type { CSSProperties, ReactNode } from "react";
import { HARULO } from "@/lib/brand/geometry";
import { REST, ringPath, type BrandPose } from "@/lib/brand/motion";

export function HaruloPrimitives({ pose = REST }: { pose?: BrandPose }) {
  const resting = pose === REST;
  return (
    <g fill="currentColor" data-harulo-pieces="4" data-resting={resting}>
      {resting ? (
        <circle
          data-piece="ring"
          {...HARULO.ring}
          fill="none"
          stroke="currentColor"
        />
      ) : (
        <path
          data-piece="ring"
          d={ringPath(pose.ring)}
          strokeWidth={pose.ring.strokeWidth}
          fill="none"
          stroke="currentColor"
        />
      )}
      <circle data-piece="satellite" {...pose.satellite} />
      <rect data-piece="primary-tier" {...pose.primary} />
      <rect data-piece="secondary-tier" {...pose.secondary} />
    </g>
  );
}

/** Sole master renderer. CSS may size the artboard, never change resting proportions. */
export function HaruloMark({
  size,
  className = "",
  title,
  pose = REST,
  children,
  style,
  preserveAspectRatio,
}: {
  size?: number | string;
  className?: string;
  title?: string;
  pose?: BrandPose;
  children?: ReactNode;
  style?: CSSProperties;
  preserveAspectRatio?: string;
}) {
  return (
    <svg
      viewBox={HARULO.viewBox}
      width={size}
      height={size}
      preserveAspectRatio={preserveAspectRatio}
      className={`harulo-mark ${className}`}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {children}
      <HaruloPrimitives pose={pose} />
    </svg>
  );
}

export function HaruloLockup({ vertical = false }: { vertical?: boolean }) {
  return (
    <span className={`harulo-lockup ${vertical ? "vertical" : ""}`}>
      <HaruloMark />
      <span>
        HARULO
        <span>
          STUDIO <span lang="ko">하루로</span>
        </span>
      </span>
    </span>
  );
}
