# Official Harulo identity system

Development route: `/preview/identity-lab`. Production returns 404 before loading the lab. The mark is approved; the root lab is no longer a logo-selection interface.

## Authoritative sources

- `lib/brand/geometry.ts`: the immutable 100 × 100 master and asset serializer.
- `components/brand/harulo-mark.tsx`: the only master renderer and four persistent primitives. A title makes a meaningful mark an accessible image; ordinary repeated brand decoration is hidden from assistive technology.
- `lib/brand/motion.ts`: typed four-piece poses, true SVG rounded contours, finite interpolation and twelve semantic transformations.
- `components/brand/use-brand-motion.ts`: lightweight finite players; no frames while offscreen, hidden, paused or reduced.
- `app/globals.css`: paired semantic color environments, typography, proportional surfaces and matching motion/easing tokens.
- `scripts/generate-brand-assets.mjs`: reproducible favicon, five SVG assets and nine PNG sizes. Run `npm run brand:assets` with Node 22.13+.

## Inspection surfaces

Master geometry and overlay; black/white and reverse; horizontal/vertical wordmarks; exact-size favicon tests; six derived fictional application glyphs; twelve motion studies; shared catalog/product/release/support/privacy/press/lifecycle/empty/mobile/loading/page-transition views; master colors plus retained ten-palette research.

The twelve transformations are open, edition, timeline, navigation, portal, loading, stamp, family, screenshot, version, closure and mobile. Every sequence begins and ends with the exact canonical mark. Direct Master / Destination / Exact return controls remain available without dramatic motion. System reduced motion wins. The global pause remains accessible in the lab footer.

Color preference uses only `harulo-master-lab-palette`; it changes this review environment, never production. Fictional records are visibly marked and excluded from public metadata/downloads.

## Historical research

`/preview/identity-lab/archive` preserves Round 2's five candidates and Round 1's three. Their comparison, motion, memory-test and saved-review tools remain available. Existing v1/v2 review keys remain intact. None of those candidates is an alternate public Harulo logo.

The old interpolation research remains in `lib/identity` and `components/identity-lab`. Public components do not import it. The small optional BrandSlot bridge is used only by the archive to demonstrate older choices over shared publishing views.

## Change discipline

Do not adjust the resting geometry for layout, media, favicon or typography. Size the complete artboard. Transformations can expand its four pieces, but must return to the original coordinates. Application glyphs are separate product identifiers, not modifications of the Harulo master.

`tests/master-identity.spec.ts` verifies exact source and rendered attributes, assets, all twelve distinct trajectories and endpoint returns, keyboard/mobile navigation, motion controls, review persistence and the production gate. Existing catalog, mature preview, resilience and archived-research tests remain relevant.
