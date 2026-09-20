# Harulo 2.0 — asset provenance

The current identity is code-native. No raster artwork, canvas, video or WebGL is loaded by the homepage.

- **Dayfold:** 24 SVG slats share the same geometry in the folded object and the timer. A surface gradient gives each slat a central fold; it is not a separate image or simulated product screenshot.
- **Publisher mark / favicon:** six stacked, angled rules derived from the Dayfold. Original repo-native SVG geometry. The downloadable publisher imprint includes a portable system-font label.
- **Product marks:** six repo-native SVG symbols for audio, notes, focus, weather, spending and planning. Each has a distinct accent within the house's flat-color publication system.
- **Concept applications:** real HTML controls, explicitly fictional and development-only. No generated screenshot is represented as shipping software.
- **UI icons:** the existing lucide-react dependency.

## Current fonts

Self-hosted variable WOFF2 fonts from Google Fonts. SIL Open Font License files accompany both fonts under `public/fonts`. No font provider receives visitor requests.

- Syne, 400–800: https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9G78HEY.woff2
- Manrope, 400–700: https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSvfedN4.woff2
- Licenses: Google Fonts' official `ofl/syne/OFL.txt` and `ofl/manrope/OFL.txt`.
- Korean: platform Gothic fallbacks with meaningful `lang="ko"` annotations. Metadata: platform monospace.

## Retired v1 assets

The old Instrument Serif / DM Sans font files and daylight photographs remain in the repository for provenance, but no current component or CSS requests them. The old Software Sunrise component and its visual rules have been removed; Git preserves their history.

The historical daylight art was generated for this project using the built-in image tool, then converted to JPEG and responsive WebP. Original prompt: terracotta sun disc, pale stone sphere, olive branch, cream limewash, natural morning side light; no text, logos, interfaces or people. It is not evidence of a real place or a real product.
