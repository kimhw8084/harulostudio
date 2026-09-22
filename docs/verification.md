# Verification

Run the production gate with Node 22 or newer:

```bash
npm ci
npm run typecheck
npm run lint
npm run verify:brand
npm run test:unit
npm run build
npm run test:ui
npm run test:a11y
npm run test:visual
npm run test:perf
```

The checks cover the immutable mark, showcase safety, visible navigation,
keyboard-accessible concept controls, light/dark rendering and the focused
public route set. `test:ui` runs Chromium and WebKit Playwright projects in the
compiled Worker; `test:a11y` runs Axe smoke checks; visual tests write stable
review captures under `work/`. CI installs the browsers and uploads traces and
results on failure.

On macOS, this repository's Homebrew Node image may need the simdutf library
path used by the local Worker command. Do not report a development-server run
as production evidence; use the compiled Worker and `HARULO_TEST_URL`.
