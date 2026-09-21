# Cobalt Ember / production identity

The owner’s permanent decision is **06 · High Tension + Cobalt Ember**. There is no public palette selector. `lib/brand/geometry.ts` remains the sole source for all four exact resting shapes, asset generation and motion origins. The full-color renderer uses Cobalt for the ring and tiers and Ember for the satellite. Monochrome is an explicit prop, not another mark.

## Rendering layers

1. `geometry.ts`: immutable coordinates and derived ratios.
2. `themes.ts`: raw brand swatches, calibrated light/dark semantic tokens and parser-time preference migration. Old `daylight` and `evening` values become `light` and `dark`.
3. `motion.ts`: finite four-piece transformations, timings, curves and exact return. Existing twelve studies remain inspectable.
4. `scene.ts`: typed material channels, normalized input and the 24-system production index.
5. `BrandScene`: local event controller; updates CSS properties and subscribers without per-frame React state. It observes native scroll, finite pointer/click energy, viewport visibility and document visibility.
6. `HaruloEnvironment`: shared event-driven Canvas 2D renderer for flow, chronology and membrane materials, with a server-rendered SVG fallback. No WebGL context, raster asset, particle stack or graphics dependency is needed.
7. Content views: edition disclosures, Release River, Chrono Lens, X-ray, publication atlas, native route continuity and Final Return.

The system index in the official lab points to actual publisher contexts. The effects are deliberately combined: they are not 24 simultaneously running animations. Some are structural rules (the tier ratio, edition planes, typographic registration); some respond to explicit actions; only selected zones have an ambient field.

## Scene usage

Wrap a bounded section in `BrandScene`, place `HaruloEnvironment` behind its content, and use the scene context’s `update()` for meaningful energy, focus or history changes. `resolveChannels()` is pure and independently testable. A subscriber may draw a canvas or inspect channel state; it must unsubscribe on cleanup. Essential content must remain server-rendered outside any animation gate.

`ring` controls center, boundary, reveal and focus. `satellite` carries position, finite energy and destination. `primaryTier` carries extension and content progress. `secondaryTier` carries the 0.54 relationship and historical echo. Scene geometry never changes the canonical SVG constants.

## Rhythm and fallback

| Experience | Default | Static / reduced / unsupported |
| --- | --- | --- |
| Hero | Ring becomes the working one-minute instrument | Explicit open button selects the composed interface |
| Edition | Native disclosure unfolds a publication plane | Same native disclosure, no motion |
| Product navigation | Cross-document named surface transition | Immediate ordinary anchor navigation |
| Release River | Ember cursor extends a chronology rail; prior edition remains registered | Manual selection and both readable records; full GET archive alongside |
| Chrono Lens | Year changes the signal and historical atmosphere | Manual year buttons and complete server-rendered milestone list |
| X-ray | Working software beside keyboard, accessibility and data contracts | Same controls and textual explanations |
| Publication atlas | Optional horizontally browsable year field | Standard catalog remains available; native scroll only |
| Final Return | Current page headings form a publication composition that withdraws into the master | Exact master and normal footer navigation |
| Ambient fields | Event-driven flow, chronology or shallow membrane tension | Static vector rails; content unchanged if Canvas is unavailable |

## Performance contract

No idle animation loop. Energy decays to zero, requests stop, and offscreen/hidden sections cancel scheduled frames. Canvas dimensions follow ResizeObserver and DPR is capped at 1.5 (1 on coarse-pointer devices). Full mode permits tiny pointer displacement; balanced mode removes it. Reduced/static modes keep the composed vector environment. Global motion pause and OS reduced motion override lab quality controls. Timers are functional state, not decorative animation.

Targets: public-route encoded JS below 200 KB; avoid blocking introductions and large bitmap hero requests. Automated local measurements are observations, not field Core Web Vitals or a physical-device guarantee. See `docs/verification.md` for run evidence.

## Content and privacy boundaries

The live catalog is still empty. The one-minute public instrument is a studio experiment. The mature preview contains **12 products, 181 releases, 96 support articles, 24 publisher announcements and 11 milestones**. All are synthetic and all preview routes remain development-only, noindex and 404 in production before fixture imports.

The universe uses hand-authored per-product narrative seeds in `lib/publishing/universe.ts`. The adapter expands those narratives into related records; it does not randomize content. Older research consumes `legacyDemoCatalog`, so archived exploration stays stable. The 20-product / 240-release stress fixture remains separate from the editorial universe.

Chrono Lens stores only the selected year in `harulo-explored-era`. A visible control clears it. No account, tracking identifier, analytics event or request is associated with it. Interface specimens hold edits in memory; reload clears them.

## Engineering reference

`/preview/identity-lab` provides canonical coordinates, nine scale tests, monochrome/reversed lockups, twelve motion studies, the production-system index, three environments, quality controls, width previews, current semantic tokens and light/dark controls. Previous candidates and ten-palette research exist only at `/preview/identity-lab/archive`.

Use the supplied complete artboard at 16 px minimum; 48 px is recommended in navigation. Preserve at least 12 px outside a 100 px artboard when placing a wordmark beside it. Never redraw to improve a particular placement. `npm run brand:assets` generates the press SVGs and favicon from the master. The retired yellow SVG is recoverable in Git history, not offered as an official asset.

## Honest limits

These are interactive publisher specimens, not twelve shipping applications. The optical materials use CSS/SVG/Canvas approximations, not physical ray tracing or a fluid solver. The publication atlas covers the finite recorded decade; it is not an unbounded world or a replacement router. Cross-document transition support is browser-dependent. Human screen-reader, physical-device and aesthetic review remain necessary.
