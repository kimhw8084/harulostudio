# Harulo implementation matrix

Baseline audited revision: `9cd83277732d71fe1d8fca86970e013432ca7dba`
Verified revision: `8297e66d6e0274aed64fde9d35ac376cde57b851`
Hosted workflow: [run 35730995667](https://github.com/kimhw8084/harulostudio/actions/runs/35730995667)
Working branch: `production-audit-fixes` (pushed to `main` for hosted verification)

Statuses are evidence-based. `AUTOMATED VERIFIED` means the named command was
executed against the compiled local Worker in this pass. `MANUAL VERIFIED` is
reserved for a human/device review that actually occurred. `UNVERIFIED` records
work that still needs a human or hosted-environment check.

| Requirement | Implementation | Executed evidence | Status |
| --- | --- | --- | --- |
| Immutable High Tension geometry | `lib/brand/geometry.ts`, `lib/brand/verify.ts`, `components/brand/harulo-mark.tsx`, `public/brand/` | `npm run verify:brand`; `npm run test:unit` (3/3); `tests/brand-render.spec.ts` in `npm run test:ui` | AUTOMATED VERIFIED |
| Cobalt Ember themes and legacy migration | `lib/brand/themes.ts`, `components/experience-provider.tsx`, `app/layout.tsx` | `tests/production.spec.ts` theme assertion; `tests/a11y.spec.ts` light/dark scan | AUTOMATED VERIFIED |
| Approved copy and placement | `lib/brand/copy.ts`, `components/harulo-site.tsx`, `components/site-shell.tsx` | `tests/production.spec.ts`; visual checkpoints | AUTOMATED VERIFIED |
| Verified/showcase resolver boundary | `lib/publishing/catalog.ts`, `lib/publishing/types.ts`, `lib/publishing/showcase.ts` | `tests/showcase-safety.spec.ts`, `tests/publishing-integrity.spec.ts` | AUTOMATED VERIFIED |
| Five functional showcase applications | `components/showcase/{sori,namu,goyo,haru-weather,dami}.tsx` | `tests/showcase-contracts.spec.ts` in Chromium normal/reduced and WebKit; Axe routes | AUTOMATED VERIFIED |
| Genesis state machine and focus isolation | `components/brand/software-origin.tsx`, `app/globals.css` | `tests/genesis-motion.spec.ts` Chromium normal/WebKit; `tests/production.spec.ts`; reduced project | AUTOMATED VERIFIED |
| Genesis scroll/layout stability | `components/brand/software-origin.tsx`, inactive tab CSS | Genesis scroll assertion and `home-genesis-open` visual baseline | AUTOMATED VERIFIED |
| Shared scene scheduler/bounds | `lib/brand/scheduler.ts`, `components/brand/scene/brand-scene.tsx` | `tests/scene-regressions.spec.ts` Chromium/WebKit normal and reduced fallback | AUTOMATED VERIFIED (covered scope) |
| Flow, membrane, and Day → Next environments | `components/brand/environments/harulo-environment.tsx`, `components/harulo-site.tsx`, `components/brand/software-xray.tsx` | canvas dimensions, pointer wake, scene progress assertions; visual home/studio/X-Ray baselines | AUTOMATED VERIFIED (lifecycle/stable states) |
| X-Ray overlays | `components/brand/software-xray.tsx`, `app/scenes.css` | `tests/xray.spec.ts`; Axe X-Ray scan | AUTOMATED VERIFIED |
| Page-specific Final Return anchors | `components/brand/footer-return.tsx`, `components/site-shell.tsx` | `tests/production.spec.ts` descriptor/anchor assertions; `final-return-*` screenshots | AUTOMATED VERIFIED |
| Guarded verified-only routes and conditional navigation | `app/releases`, `app/support`, `app/archive`, `app/history`, `app/software/[slug]/*`, `app/press/[slug]`, `lib/publishing/catalog.ts` | `tests/production.spec.ts`, `tests/publishing-integrity.spec.ts`, `tests/metadata.spec.ts` | AUTOMATED VERIFIED |
| Metadata, social PNG, icons, manifest | `scripts/generate-brand-assets.mjs`, `public/og.png`, `public/brand/`, `app/layout.tsx` | `tests/metadata.spec.ts` Chromium/WebKit | AUTOMATED VERIFIED |
| Recovery and security response headers | `app/error.tsx`, `app/global-error.tsx`, `next.config.ts` | `tests/recovery.spec.ts`, `tests/metadata.spec.ts` | AUTOMATED VERIFIED (local Worker) |
| Accessibility | `tests/a11y.spec.ts` | Hosted run 35730995667: `npm run test:a11y` passed; local light/dark route scans retained | HOSTED AUTOMATED VERIFIED |
| Visual regression | `tests/visual.spec.ts`, `tests/visual.spec.ts-snapshots/` | Hosted Ubuntu Chromium run 35730995667: `npm run test:visual` passed against reviewed `*-chromium-linux.png` baselines | HOSTED AUTOMATED VERIFIED |
| Performance budget | `scripts/perf-check.mjs`, `tests/perf.spec.ts` | Hosted run 35730995667: `npm run test:perf` passed; local evidence remains 24 chunks / 189,321 gzip bytes, 3 mobile samples, worst LCP 116ms, CLS 0.0608, JS 171,959 bytes | HOSTED AUTOMATED VERIFIED (synthetic profile) |
| Cleanup | `app/scenes.css`, pruned `components/ui/`, removed Drizzle journal and unused dependencies | `npm run build`, `git diff --check`, import/build audit | AUTOMATED VERIFIED |
| CI workflow | `.github/workflows/ci.yml`, `package.json` | Hosted run 35730995667: quality, functional Chromium/Chromium-reduced/WebKit, accessibility, visual, performance, and production-gate jobs all passed | HOSTED AUTOMATED VERIFIED |

## Explicitly unverified

- Physical iPhone/Android testing, VoiceOver, Korean IME, forced-colors, and
  real low-bandwidth field Core Web Vitals were not performed here.
- Required-check branch protection, DNS, and the production hosting response
  were not verified in this pass.
- The local Worker required a machine-local Homebrew `simdutf` compatibility
  symlink before Wrangler could start; CI Ubuntu should use the normal install.
