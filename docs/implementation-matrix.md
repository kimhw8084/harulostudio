# Harulo production implementation matrix

Baseline: `eade02d96051ed25ec13aeee562e079f2e2d5a7a`  
Working branch: `production-audit-fixes`

Status is evidence-based: `VERIFIED` means the command or browser assertion named in the evidence column has run against the compiled Worker; `IMPLEMENTED` means code is present but the final evidence is still pending.

| Requirement | Implementation | Tests / evidence | Status |
| --- | --- | --- | --- |
| Permanent High Tension geometry | `lib/brand/geometry.ts`, `components/brand/harulo-mark.tsx`, generated `public/brand/*.svg` | `scripts/verify-brand.mjs`; `tests/unit/brand-geometry.test.mjs`; `tests/brand-render.spec.ts` | VERIFIED |
| Cobalt Ember light/dark themes and legacy migration | `lib/brand/themes.ts`, `components/experience-provider.tsx`, `app/layout.tsx` | `tests/production.spec.ts` theme control; Chromium/WebKit compiled Worker run | VERIFIED |
| Approved copy and placements | `lib/brand/copy.ts`, `components/harulo-site.tsx`, `components/site-shell.tsx` | `tests/production.spec.ts` exact hero/genesis/catalog assertions | VERIFIED |
| Verified/showcase resolver boundary | `lib/publishing/catalog.ts`, `lib/publishing/types.ts`, `lib/publishing/showcase.ts` | `tests/showcase-safety.spec.ts`, `tests/publishing-integrity.spec.ts` | VERIFIED |
| Exactly five local showcase applications | `components/showcase/*`, `components/application-instrument.tsx` | `tests/showcase-contracts.spec.ts` (Sori, Namu, Goyo, Haru Weather, Dami) | VERIFIED |
| Guarded verified-only routes | `app/releases`, `app/support`, `app/archive`, `app/history`, `app/software/[slug]/*`, `app/press/[slug]` | `tests/production.spec.ts` confirms unavailable routes return 404; `tests/publishing-integrity.spec.ts` verifies fixture lifecycle paths and schema | VERIFIED (fixture + empty production catalog) |
| Conditional navigation and sitemap | `lib/publishing/catalog.ts`, `components/site-shell.tsx`, `components/brand/mobile-navigation.tsx`, `app/sitemap.ts` | `tests/production.spec.ts`, `tests/showcase-safety.spec.ts`, `tests/metadata.spec.ts`, `tests/publishing-integrity.spec.ts` | VERIFIED |
| Genesis closed state, tabs, focus return, no auto-open | `components/brand/software-origin.tsx`, Genesis CSS in `app/globals.css` | `tests/production.spec.ts` Chromium/WebKit | VERIFIED |
| Shared scene scheduler and bounds lifecycle | `lib/brand/scheduler.ts`, `components/brand/scene/brand-scene.tsx` | `tests/scene-regressions.spec.ts` in compiled Chromium/WebKit suite; pure zero-bound assertions | VERIFIED (covered scope) |
| Three distinct environments | `components/brand/environments/harulo-environment.tsx` | Homepage/Studio compiled visual captures in `work/visual-*.png`; reduced-motion capture pending | IMPLEMENTED |
| X-Ray real overlays | `components/brand/software-xray.tsx` | Sori detail route rendered; interaction-specific overlay assertions pending | IMPLEMENTED |
| Explicit page footer descriptor / Final Return | `components/brand/footer-return.tsx`, `components/site-shell.tsx` | Compiled visual capture `work/visual-home-light.png` | IMPLEMENTED |
| Metadata, social PNG, icons, manifest | `scripts/generate-brand-assets.mjs`, `public/og.png`, `public/brand/`, `app/layout.tsx`, `public/manifest.webmanifest` | `tests/metadata.spec.ts` in fresh compiled Chromium/WebKit suite | VERIFIED |
| Security headers and recovery | `next.config.ts`, `app/error.tsx`, `app/global-error.tsx` | `tests/metadata.spec.ts` header responses; `tests/recovery.spec.ts` unknown route/missing asset on compiled Worker | VERIFIED (automated scope) |
| Accessibility smoke | `tests/a11y.spec.ts` | Axe Chromium: 6 passed | VERIFIED |
| Visual evidence | `tests/visual.spec.ts` | Chromium deterministic captures for light/dark/home/software/studio/privacy/Sori | VERIFIED |
| Performance budget | `scripts/perf-check.mjs` | 25 client chunks, 187,144 gzip bytes; local mobile LCP samples 112/92/88ms, CLS 0 | VERIFIED (local profile) |
| CI gate scripts | `package.json`, `.github/workflows/ci.yml` | Typecheck/lint/build/unit/UI/A11y/visual/perf scripts present; hosted CI run pending | IMPLEMENTED |
| Cleanup / no fictional 2036 universe or candidate lab | deleted old fixtures/routes/lab, retired unused ExtendedInstrument/minute CSS | `rg` audit + fresh build; 25 client chunks after cleanup | VERIFIED |

## Known unverified items

- Hosted GitHub Actions has not run in this environment; workflow action pinning/required-check protection still needs repository-owner verification.
- The scheduler regression covers cached progress after scroll plus zero bounds in this pass; pointer/nested-scroll/hidden-tab lifecycle remains a manual/CI expansion.
- Environment and footer/X-Ray interactions have stable visual/route evidence, but reduced-motion recordings and exhaustive pointer-device matrix remain unverified.
- Physical iPhone/Android, VoiceOver, Korean IME, forced-colors and throttled cold-CWV checks remain manual/CI work.
- The local Worker was started manually because this macOS image has a Homebrew `simdutf` symlink mismatch when npm child processes spawn; CI Ubuntu should use the normal `npm run start` webServer.
