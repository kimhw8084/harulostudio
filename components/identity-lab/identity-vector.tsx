"use client";

import { useId } from "react";
import {
  basePose,
  pathData,
  productPose,
  type Identity,
  type Pose,
} from "@/lib/identity/geometry";

export function IdentityVector({
  identity,
  pose,
  compact = false,
  product,
  label,
  className = "",
}: {
  identity: Identity;
  pose?: Pose;
  compact?: boolean;
  product?: number;
  label?: string;
  className?: string;
}) {
  const id = useId();
  const shape =
    pose ??
    (product === undefined
      ? basePose(identity)
      : productPose(identity, product));
  return (
    <svg
      className={`identity-vector ${className}`}
      viewBox={compact ? "253 104 294 294" : "0 0 800 500"}
      fill="none"
      role={label ? "img" : undefined}
      aria-labelledby={label ? id : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <title id={id}>{label}</title>}
      {shape.pieces.map((piece, i) => (
        <path
          data-piece={i}
          key={i}
          d={pathData(piece)}
          stroke={piece.width ? "currentColor" : "none"}
          strokeWidth={piece.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={piece.solid ? "currentColor" : "none"}
        />
      ))}
      {shape.kind === "window" && (
        <g className="identity-annotation" fill="currentColor">
          <text x="322" y="216" fontSize="27" fontWeight="700">
            Sori
          </text>
          <text x="322" y="242" fontSize="13">
            YOUR SOUND, CONSIDERED.
          </text>
          <g
            fill={
              identity === "aperture" ? "var(--brand-stage)" : "currentColor"
            }
          >
            <text x="505" y="136" fontSize="12">
              4.8.2 / STUDY
            </text>
            <text x="184" y="205" fontSize="13">
              Audio
            </text>
            <text x="184" y="240" fontSize="13">
              Profiles
            </text>
            <text x="184" y="275" fontSize="13">
              Devices
            </text>
          </g>
        </g>
      )}
      {shape.kind === "grid" && (
        <g className="identity-annotation" fill="currentColor" fontSize="26">
          <text x="146" y="175">
            01
          </text>
          <text x="335" y="285">
            02
          </text>
          <text x="520" y="388">
            03
          </text>
        </g>
      )}
      {shape.kind === "seal" && (
        <g
          className="identity-annotation"
          fill="currentColor"
          textAnchor="middle"
        >
          <text x="400" y="220" fontSize="13">
            A HARULO STUDIO RELEASE
          </text>
          <text x="400" y="272" fontSize="44" fontWeight="700">
            4.8.2
          </text>
          <text x="400" y="300" fontSize="13">
            29 AUG 2036 / STUDY
          </text>
        </g>
      )}
      {shape.kind === "edition" && (
        <g className="identity-annotation" fill="currentColor">
          <text x="277" y="122" fontSize="23" fontWeight="700">
            SORI
          </text>
          <text x="463" y="122" fontSize="17">
            01
          </text>
          <text x="320" y="337" fontSize="12">
            PUBLISHED BY HARULO
          </text>
        </g>
      )}
    </svg>
  );
}

export function IdentityWordmark({
  identity,
  compact = false,
}: {
  identity: Identity;
  compact?: boolean;
}) {
  return (
    <span className={`lab-wordmark ${compact ? "is-compact" : ""}`}>
      <IdentityVector identity={identity} compact />
      <span>
        HARULO
        <span>
          {compact
            ? "STUDIO / 하루로"
            : "STUDIO · INDEPENDENT SOFTWARE PUBLISHER"}
        </span>
      </span>
    </span>
  );
}
export function IdentityImprint({
  identity,
  edition = "SOFTWARE, PUBLISHED.",
}: {
  identity: Identity;
  edition?: string;
}) {
  return (
    <span className="lab-imprint">
      <IdentityVector identity={identity} compact />
      <span>
        PUBLISHED BY HARULO STUDIO<small>{edition}</small>
      </span>
    </span>
  );
}
