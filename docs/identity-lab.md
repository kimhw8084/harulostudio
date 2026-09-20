# Permanent Identity Lab

Review surface: `/preview/identity-lab`, development only. No identity or palette has been approved or promoted.

## What is implemented

| Identity       | Six implemented transformations                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Hangul Flow    | 하루 → 하루로; language → ligature; directional path; application; registration grid; product edition |
| Horizon Core   | threshold/rise; full-day timeline; publishing grid; interface control; eclipse; split viewport        |
| Solar Aperture | opening/reveal; application; edition seal; six-product family; catalog grid; page threshold           |

Each also has a 19-second connected reel. Geometry is persistent: 19 stroke pieces for Hangul Flow, 8 pieces for the other identities, 40 sampled coordinates per piece. Path correspondence is retained while shapes interpolate. Closed shutters are matched by winding and minimum-distance cyclic phase before playback, so their corners do not arbitrarily twist through a destination. Supporting labels identify the resolved state; they do not substitute for a geometric transformation. The player offers finite playback, pause/replay, 1×/0.5×/0.25× speeds, timeline scrubbing and direct static states. It cancels animation frames when offscreen or the document is hidden. System reduced motion wins over the manual control.

The loading and route-transition contexts are interactive, framed usage studies—not blocking intros or production navigation overrides. No native page navigation is delayed. Product interfaces are usable local demonstrations, not actual released apps.

## Boundaries

- `lib/identity/geometry.ts`: identity topology, product-family geometry, transformation sequences and interpolation.
- `lib/identity/palettes.ts`: ten palette records, semantic token generation and contrast calculations. No dependency on identity.
- `components/identity-lab/`: review controls, player, vector renderer, context application and scoped styles.
- `components/brand-slot.tsx`: tiny optional context bridge. Production renders its original children; it imports no lab code or data.
- `lib/identity/fixtures.ts`: enriched synthetic records layered over the existing typed catalog. Not a production adapter.
- The development route checks `NODE_ENV` **before** dynamically importing the lab document. No sitemap entries or public canonical claims are added.

Static marks, wordmarks and publisher imprints are server-rendered SVG. No animation library, canvas, external service, font or runtime dependency was added. All alternative geometry is isolated from the production entry point. Palette changes remain inside the representative website/stage; neutral review controls remain stable.

Storage key: `harulo-identity-lab-v1`. It contains only identity, per-identity transformation, palette, and up to four review pins. Invalid or unavailable storage falls back to usable defaults. It is not a production preference and does not affect `harulo-theme` or `harulo-motion`.

## After the owner chooses

1. Record the explicitly approved identity, palette and retained motion variants. A pin is not approval.
2. Move only the selected geometry, compact renderer and deliberate transformations into a production identity module. Replace the fallback mark and product-icon family through the existing bridge, or remove the bridge once there is one permanent renderer.
3. Promote the chosen semantic tokens to the production stylesheet. Keep the review chrome and candidate palettes out of production.
4. Apply the approved mark to the real favicon and verified press assets. The lab currently only simulates those uses.
5. Archive/remove losing candidates only when requested. Do not move synthetic products into the live catalog.
6. Repeat production, responsive, keyboard, reduced-motion, forced-color and contrast checks. Keep the truthfulness gate intact.

## Verification scope

`tests/identity-lab.spec.ts` exercises topology, all 18 inspectable transformations, playback, persistence, comparison, semantic contrast, keyboard scrubbing, 320px reflow, representative publishing contexts, and the production 404 boundary. It runs in Chromium and WebKit alongside the existing publishing suite. Automated contrast is evidence for the tested rendered states, not a claim that every possible future composition is certified.
