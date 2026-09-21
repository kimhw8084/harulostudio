# Verification

Run the production gate with Node 22 or newer:

```bash
npm run typecheck
npm run lint
npm run verify:brand
npm run build
npm run test:ui
```

The checks cover the immutable mark, showcase safety, visible navigation,
keyboard-accessible concept controls, light/dark rendering and the focused
public route set. CI runs Chromium and WebKit Playwright projects.
