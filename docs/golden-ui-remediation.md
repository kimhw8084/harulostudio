# Golden UI remediation candidate

Starting SHA: `4512c2f80bcc6ab222055ba7d290650bb1b3e990`  
Branch: `golden-ui-remediation`  
Visual thesis: **Quiet publisher. Living mark. Software first.**

## Baseline evidence

The committed Linux snapshots in `tests/visual.spec.ts-snapshots/` were reviewed before UI edits. They describe the old implementation, not an accepted visual target.

| Baseline screenshots (`-chromium-linux.png`) | Failure class and affected route/state | Rule | Shared root / intended remediation | Verification |
| --- | --- | --- | --- | --- |
| `404`, `final-return-start`, `final-return-end` | P1: On `/404`, a large Cobalt rectangle covers the footer composition. | JOIN-06, VIS-12 | `FooterReturn` converts arbitrary `<main>` bounds into a ring pose. Remove page geometry sourcing; keep a bounded home-only return and compact static footer elsewhere. | Rendered 404 geometry regression; footer captures. |
| `home-light-desktop`, `home-dark-desktop`, `home-light-mobile`, `home-dark-mobile` | P1: Competing masthead, H1, Korean line, motif, Genesis, wordmark, CTAs, open Sori, and oversized footer create a long, dense page. | TASK-01, VIS-01, VIS-04 | Recompose hero around one H1 and action, remove duplicated wordmark and auto-open app, compact product list and footer. | Desktop, mobile, tablet, and holdout screenshots; page height comparison. |
| `home-genesis-rest`, `home-genesis-open` | P1: Empty dark box at rest; open app appears as a separate specimen inside the stage; mobile stage consumes too much height. | VIS-01, LAY-02, LAY-03 | Rebuild mark-to-interface composition with canonical pose, compact rest state, natural open height, and mobile-specific layout. | Rest/open/alternate screenshots and motion trace at desktop/mobile. |
| `software` | P1: Duplicate dominant heading and filter form for five concepts. | TASK-01, TASK-06 | One page title; direct browsing until catalog scale warrants filters. | Catalog desktop/mobile/dark screenshots and functional route test. |
| `sori`, `namu`, `goyo`, `haru-weather`, `dami` | P1: Product pages lead with the same diagnostic shell; specimens share generic window chrome, and several controls render with browser-default spacing. | VIS-01, VIS-12, CMP-04, CMP-08, CMP-20, CMP-21, CMP-24 | Make each product interface primary, separate shared behavioral shell from product-specific anatomy, and explicitly style all visible controls. | Five desktop/mobile/dark captures; keyboard and control tests. |
| `sori-xray-keyboard`, `sori-xray-accessibility` | P1: Diagnostic overlay covers the application and text. | JOIN-06, ACC-04 | Progressive inspection with a separate reading rail; no full-surface overlay. | Closed/keyboard/accessibility/data/mobile captures. |
| `studio` | P2: Meaning is explained through too many simultaneous words, large Hangul, arrow, and environment. | TASK-01, VIS-04 | One literal statement, one controlled visual resolution, one approved poetic close. | Desktop/mobile/dark screenshots. |
| `press` | P2: Fifth asset card is orphaned in two columns. | VIS-04 | Balanced three-plus-two layout. | Desktop/mobile screenshots. |
| `privacy` | P2: Restrained article is followed by footer spectacle. | VIS-01 | Preserve article, apply common type rhythm and compact footer. | Desktop/mobile screenshots. |
| Dark captures above | P1: Light product tones sit nearly unchanged on Night backgrounds. | VIS-08 | Define dark-adjusted per-product surfaces and contrast. | Home/catalog/five products/utility dark captures. |

## Proof scope

Candidate screenshots and recordings belong in `work/golden-ui-candidate/`, separate from the committed snapshots. Automated correctness and rendered geometry can establish regressions and behavior; independent visual review decides aesthetic acceptance. Physical devices, assistive technology, Korean IME, and production-host behavior require separate evidence if not exercised here.

## Candidate verification

- `npm ci`, typecheck, lint, canonical brand verification, unit tests, and production build passed with Node 22.
- Functional Playwright: 93 passed, 12 project-specific skips across Chromium, reduced-motion Chromium, and WebKit.
- Axe: 40 passed and 2 browser-specific skips across the same browser projects, including all five interactive concepts, open X-Ray, and Chromium dark surfaces.
- Motion and responsive contracts: 21 passed, 6 project-specific skips. The 404 regression measures rendered decorative geometry and route-action visibility.
- Synthetic mobile performance: 172,285 initial encoded JavaScript bytes, 189,329 total gzip chunk bytes, 84 ms worst measured LCP in three local cold contexts, and 0.0017 maximum CLS. These are local lab observations, not field Core Web Vitals.
- The previous visual snapshots differ at all 17 tested checkpoints. They remain unchanged pending independent aesthetic review.
- Responsive checks cover the requested desktop, tablet, phone, short, and holdout widths, plus 200% text and forced colors. A 320 CSS-pixel viewport exercises the reflow width corresponding to a 1280-pixel viewport at 400% zoom; that is geometry evidence rather than a claim of complete browser zoom testing.
