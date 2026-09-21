# Harulo — asset provenance

The permanent identity is code-native. No raster artwork, canvas, video or WebGL is loaded by the homepage.

- **Master mark:** owner-supplied canonical 06 · High Tension geometry, rooted in ㅎ. One ring, one satellite, two rounded tiers. `lib/brand/geometry.ts` is authoritative; `components/brand/harulo-mark.tsx` renders it everywhere.
- **Favicon / press assets:** generated, not redrawn. `npm run brand:assets` produces the exact SVG geometry, monochrome/reversed/Cobalt Ember files, horizontal and vertical lockups, and PNGs at 16/20/24/32/48/64/128/256/512. No optical small-size alternative exists. Lockup SVGs embed the existing licensed Syne WOFF2 for portable typography.
- **Product glyphs:** repo-native application identifiers derived from circular controls, satellite state and tier relationships. They are not alternate publisher marks. Fictional application families remain in preview content.
- **Software Origin:** four SVG primitives transform into an actual local one-minute instrument. It is explicitly a studio experiment, not an announced product.
- **Concept applications:** working HTML controls, clearly fictional and development-only. No generated screenshot is represented as shipping software.
- **UI icons:** the existing lucide-react dependency.

## Fonts

Self-hosted variable WOFF2 fonts from Google Fonts, with SIL Open Font License files in `public/fonts`. No font provider receives visitor requests.

- Manrope, 400–700: large statements, reading and controls. Source: https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2
- Syne, 400–800: publisher wordmark. Source: https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9G78HEY.woff2
- Korean: platform Gothic fallbacks with meaningful `lang="ko"` annotations. Metadata: platform monospace.

## Historical material

The former Dayfold component and its public visual rules have been retired; Git preserves them. The previous identity candidates remain under the development archive. Older Instrument Serif / DM Sans fonts and daylight photographs remain for provenance, but current public components do not request them.

The historical daylight artwork was generated for this project: terracotta disc, pale stone, olive branch, cream limewash and natural morning light. It is not evidence of a real place or product. No new bitmap artwork was needed for the permanent vector identity.
