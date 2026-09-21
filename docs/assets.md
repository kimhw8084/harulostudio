# Harulo — asset provenance

The permanent identity is code-native. No raster artwork, canvas, video or WebGL
is required for the public homepage.

- **Master mark:** owner-supplied canonical 06 · High Tension geometry, rooted in ㅎ. One ring, one satellite, two rounded tiers. `lib/brand/geometry.ts` is authoritative; `components/brand/harulo-mark.tsx` renders it everywhere.
- **Social and app assets:** `public/og.svg` and `public/manifest.webmanifest` use the same exact Cobalt Ember mark.
- **Product glyphs:** repo-native application identifiers derived from circular controls, satellite state and tier relationships. They are not alternate publisher marks.
- **Concept applications:** working HTML controls, clearly labeled as showcase concepts and not available products. No generated screenshot is represented as shipping software.
- **UI icons:** the existing lucide-react dependency.

## Fonts

Self-hosted variable WOFF2 fonts from Google Fonts, with SIL Open Font License files in `public/fonts`. No font provider receives visitor requests.

- Manrope, 400–700: large statements, reading and controls. Source: https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2
- Syne, 400–800: publisher wordmark. Source: https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9G78HEY.woff2
- Korean: platform Gothic fallbacks with meaningful `lang="ko"` annotations. Metadata: platform monospace.

## Historical material

Previous artwork and identity experiments are not part of the public experience.
Git history preserves them; production components do not request them.
