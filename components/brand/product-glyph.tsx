import type { Product } from "@/lib/publishing/types";

/** Application symbols, not alternate publisher marks. They inherit ring/tier logic. */
export function ProductGlyph({ kind }: { kind: Product["icon"] }) {
  const content = {
    sound: (
      <>
        <path d="M30 49h40M39.2 64h21.6" />
        <circle cx="36" cy="49" r="5" fill="currentColor" />
        <circle cx="63" cy="34" r="4.35" fill="currentColor" />
      </>
    ),
    notes: (
      <>
        <path d="M32 32h36M32 44h25M32 56h36M32 68h19.44" />
        <circle cx="75" cy="25" r="4.35" fill="currentColor" />
      </>
    ),
    focus: (
      <>
        <circle cx="47.5" cy="44" r="18.25" />
        <circle cx="47.5" cy="44" r="4.35" fill="currentColor" />
        <path d="M30 74h40" />
      </>
    ),
    weather: (
      <>
        <path d="M26 52a24 24 0 0 1 48 0M26 61h48M37.04 72h25.92" />
        <circle cx="70" cy="25" r="4.35" fill="currentColor" />
      </>
    ),
    spending: (
      <>
        <path d="M30 31h40M39.2 43h21.6M30 70h40" />
        <circle cx="47.5" cy="56" r="9" />
        <circle cx="74" cy="58" r="4.35" fill="currentColor" />
      </>
    ),
    planning: (
      <>
        <path d="M26 30h40M26 50h30M26 70h21.6M62 70V47h15" />
        <circle cx="77" cy="30" r="4.35" fill="currentColor" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-product-glyph={kind}
    >
      {content[kind]}
    </svg>
  );
}
