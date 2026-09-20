# Permanent Identity Lab

Review surface: `/preview/identity-lab`, development only. No identity or palette has been approved or promoted.

## What is implemented

Round 2 is the default: **Hangul × Geometry**. The first workspace is a monochrome comparison of five marks, including 16/24/32/48/96px and large specimens. The seven-question review rubric records the owner's observations, not computed ratings or a winner. A hide-and-recall control conceals the marks for a memory check. Thirty product-family studies follow the static board.

| Round 2 identity | Resting primitives | Five implemented transformations                                                                          |
| ---------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| Syllable Block   | 4                  | mark → 하 → 하루 → 하루로; syllabic cells → grid; application/control; edition frame; directional route   |
| ㅎ Core          | 3                  | Hangul anatomy; application/control; core follows a navigation route; publishing seal; six-product family |
| Ro Gate          | 3                  | closed threshold → opening; directional route; application; clipped page reveal; publication cover        |
| Hangul Loop      | 1 continuous path  | ㄹ / 루 construction; directional arrow; application frame; release timeline; publishing grid             |
| Hangul Aperture  | 4 vowel modules    | Hangul anatomy; application; registration grid; six-product family; full-stage reveal                     |

There are exactly **25 Round 2 transformations**, plus one connected reel per candidate. Round 1 remains separately selectable under **Round 1 / Archive**:

| Identity       | Six implemented transformations                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Hangul Flow    | 하루 → 하루로; language → ligature; directional path; application; registration grid; product edition |
| Horizon Core   | threshold/rise; full-day timeline; publishing grid; interface control; eclipse; split viewport        |
| Solar Aperture | opening/reveal; application; edition seal; six-product family; catalog grid; page threshold           |

Each Round 1 candidate retains its 19-second connected reel and original topology (19 pieces for Hangul Flow, 8 for Horizon Core and Solar Aperture). Round 2 uses its actual 1–4 primary strokes. When a language or interface transformation requires branching, touching sections of an existing stroke separate using SVG pen lifts; they are not hidden replacement marks. Corner-preserving sampling retains authored vertices and retraced branches, with 128 samples per contour. The owner index remains stable throughout every study. Rings remain circular when becoming controls, and portals reveal content through a geometrically interpolated clip. Every Round 2 study returns to its resting mark.

Supporting labels identify the resolved state; they do not substitute for a geometric transformation. The player offers finite playback, pause/replay, 1×/0.5×/0.25× speeds, timeline scrubbing and direct static states. It cancels animation frames when offscreen or the document is hidden. System reduced motion wins over the manual control.

The loading and route-transition contexts are interactive, framed usage studies—not blocking intros or production navigation overrides. No native page navigation is delayed. Product interfaces are usable local demonstrations, not actual released apps.

## Boundaries

- `lib/identity/geometry.ts`: identity topology, product-family geometry, transformation sequences and interpolation.
- `lib/identity/round-two.ts`: the five new constructions, their 30 product marks, 25 transformations, connected reels and corner-preserving contour correspondence. Its geometry imports are type-only.
- `components/identity-lab/round-two-board.tsx`: monochrome comparison, size specimens, memory test and unscored review rubric.
- `lib/identity/palettes.ts`: ten palette records, semantic token generation and contrast calculations. No dependency on identity.
- `components/identity-lab/`: review controls, player, vector renderer, context application and scoped styles.
- `components/brand-slot.tsx`: tiny optional context bridge. Production renders its original children; it imports no lab code or data.
- `lib/identity/fixtures.ts`: enriched synthetic records layered over the existing typed catalog. Not a production adapter.
- The development route checks `NODE_ENV` **before** dynamically importing the lab document. No sitemap entries or public canonical claims are added.

Static marks, wordmarks and publisher imprints are server-rendered SVG. No animation library, canvas, external service, font or runtime dependency was added. All alternative geometry is isolated from the production entry point. Palette changes remain inside the representative website/stage; neutral review controls remain stable.

Storage key: `harulo-identity-lab-v2`. It contains only identity, per-identity transformation, palette, and up to four review pins. The first Round 2 visit imports the palette, variants and pins from `harulo-identity-lab-v1`, while opening on the first Round 2 candidate. The legacy key is preserved. The separate `harulo-identity-lab-round2-review` key holds optional rubric observations and notes. Invalid or unavailable storage falls back to usable defaults. None is a production preference or affects `harulo-theme` or `harulo-motion`.

## After the owner chooses

1. Record the explicitly approved identity, palette and retained motion variants. A pin is not approval.
2. Move only the selected geometry, compact renderer and deliberate transformations into a production identity module. Replace the fallback mark and product-icon family through the existing bridge, or remove the bridge once there is one permanent renderer.
3. Promote the chosen semantic tokens to the production stylesheet. Keep the review chrome and candidate palettes out of production.
4. Apply the approved mark to the real favicon and verified press assets. The lab currently only simulates those uses.
5. Archive/remove losing candidates only when requested. Do not move synthetic products into the live catalog.
6. Repeat production, responsive, keyboard, reduced-motion, forced-color and contrast checks. Keep the truthfulness gate intact.

## Verification scope

`tests/identity-lab.spec.ts` exercises all 43 inspectable transformations, Round 2's primitive limits and return states, 30 distinct product siblings, playback, memory-review persistence, legacy preference migration, all five candidates across all ten palettes, comparison, semantic contrast, keyboard scrubbing, 320px reflow, representative publishing contexts, JavaScript-free rendering, and the production 404 boundary. It runs in Chromium and WebKit alongside the existing publishing suite. Automated contrast is evidence for the tested rendered states, not a claim that every possible future composition is certified.
