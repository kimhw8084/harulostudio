# Golden UI final convergence

Starting SHA: `a9cd81abb2cb4b2444ac5493f7d4b785432127bf`  
Branch: `golden-ui-final-convergence`  
Scope: Genesis, inspection, theme control, header authority, bounded Goyo/Weather/Dami polish, and candidate evidence. The approved Harulo identity and the five distinct specimens remain intact.

## Visual Director for affected surfaces

| Decision | Resolved direction |
| --- | --- |
| Character | Quiet, precise, useful; no design-system demo, kinetic branding experiment, or dashboard template. |
| Typography | Existing Manrope/Syne hierarchy; readable control names and units; no new display treatment. |
| Density | Genesis and inspection reveal detail only on request. Product data remains directly scannable. |
| Hierarchy | Product task first, inspection second; theme and header controls remain quiet. |
| Spacing | Natural workspace height and stable relationships between mark, tabs, and specimen; no fixed cinematic open panel. |
| Surfaces | Existing Paper/Night and product-specific surfaces; no new material. |
| Borders/radii | Existing semantic borders; mark aperture and UI frame share geometry without decorative duplicates. |
| Color | Permanent Cobalt/Ember identity; existing dark product tones; forced colors must retain labels and selected states. |
| Emphasis | Working software and its active action lead; inspection badges, test affordances, and rain encoding remain secondary. |
| Icons | Canonical Harulo mark for theme; current product glyphs; no sun/moon metaphor. |
| Motion | Genesis explains REST→WORKING, can reverse/intercept, and stops; theme registration is finite; reduced motion exposes final meaning immediately. |
| Data density | Dami shows US dollar units and integer-cent truth; Weather shows rain alongside temperature and keeps the table authoritative. |
| Content tone | Functional labels and truthful local-only disclosures; no new slogans. |
| Responsive composition | Header switches at 960px; Genesis becomes a vertical flow with all five tabs visible; product work and selection survive reflow and text enlargement. |
| Imagery | None added; the exact mark is the only identity image in this pass. |

## Affected task contract

Homepage: understand publisher → open Genesis → choose one of five concepts → act in the specimen → close or continue; interruption must preserve coherent geometry, focus, and semantics. Product detail: use the specimen first; optionally inspect focus order, real groups, and local state path; close inspection without losing work. Theme: change colors and a brief mark signal while preserving focus, scroll, all specimen state, Genesis, and X-Ray. Responsive: the same tasks remain reachable across the requested desktop, tablet, mobile, short-height, large-text, and forced-colors profiles.

## Baseline defect evidence

The hosted run `35897945684` at the starting SHA failed functional WebKit X-Ray and all old visual-baseline comparisons. The hosted functional trace and local 10-repeat WebKit run agree: one local run ended with zero exposed tabs after the native summary click (9 passed, 1 failed). In the trace the moving summary was repeatedly outside the viewport or intercepted by the workspace during Playwright's scroll and actionability attempts. The click eventually completed, but the disclosure was closed in the accessibility snapshot. The global smooth-scroll rule made that target unstable; native toggle timing plus React `onToggle` left two owners for the open state. Classification: **P1 / state lifecycle and geometry-action**. Affected relationship: summary actionability → native `<details>` state → React `open` state → Radix tab visibility. Owner: `SoftwareXRay` and the global scroll rule. The fix makes scrolling immediate and React the explicit disclosure owner while retaining the native summary and keyboard activation. The old visual snapshots remain prior-design evidence until an independent review accepts replacements.

## CSS and motion ownership

| Surface | Layout and responsive owner | Motion owner |
| --- | --- | --- |
| Header, theme control, compact navigation | `app/remediation.css`; obsolete header rules removed from `app/globals.css` | `lib/brand/motion.ts` variables and finite local theme/menu CSS |
| Genesis | `app/remediation.css`, measured content in `components/brand/software-origin.tsx` | Genesis reducer, canonical Bezier and durations in `lib/brand/motion.ts` |
| Product specimens | `components/showcase/showcase.css`; old generic concept, mixer, weather, and specimen rules removed from global styles | Local control state only; no ambient animation |
| X-Ray | `app/remediation.css`; old scene-level inspection layout removed | None beyond control micro states |
| Home Final Return | `app/remediation.css`; local SVG pose only | `components/brand/footer-return.tsx` with canonical duration/ease |

The confirmed dead `first-edition`, `unwritten-edition`, and `xray-compact` families were deleted. The `publish-settle` and `stamp-*` rules remain because `CopyEmail` uses them. Verified-product publishing infrastructure and old visual baselines remain untouched.

## Evidence boundary

Maintain separate functional, accessibility, responsive geometry, forced-colors pixel, normal/reduced motion, WebKit, performance, visual-regression, human-acceptance, physical-device, assistive-technology, IME, and production-host dispositions. A test exit code alone is not aesthetic acceptance.
