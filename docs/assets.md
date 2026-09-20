# Asset provenance

Hero artwork: generated with the built-in image-generation tool for this project; one request, no variants. Original 1122 × 1402 PNG converted to optimized JPEG at `public/images/daylight.jpg`.

The publisher redesign preserves this original art. `scripts/optimize-artwork.mjs` derives responsive WebP files from the existing JPEG at 640px and 1122px widths (approximately 84 KiB and 268 KiB). The browser selects via `picture`/`srcset`; the original JPEG remains a fallback. Explicit dimensions reserve space. No new raster art or fabricated product screenshot was introduced.

Prompt: Photorealistic sculptural editorial still life: imperfect terracotta sun disc above a pale stone sphere, olive branch entering lower right, creamy limewashed backdrop, rich natural morning side light, tactile mineral surfaces, subtle film grain, generous space for architectural arch cropping. Warm paper, terracotta, and forest olive palette; no text, logos, UI, or people.

Fonts: Instrument Serif and DM Sans, served locally; obtained from Google Fonts. License files accompany them under `public/fonts`. Icons use the existing lucide-react dependency. The favicon is simple vector brand geometry.

`public/brand/harulo-publisher.svg` is a repo-native vector publisher imprint derived from the existing sun geometry. It is offered as a labeled press download, not a legal trademark claim. Synthetic product icons use a restrained family of the existing Lucide geometries and mineral tones. Their concept interfaces are HTML/CSS and explicitly fictional, not screenshots of shipping software. They are reachable only in development.
