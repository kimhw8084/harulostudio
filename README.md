# Harulo Studio

Harulo Studio / 하루로 is an independent software publisher. The name begins
with 하루 (a day) and points toward 하루로: a little better day.

The public site is deliberately truthful. The verified catalog is empty until
Harulo announces real software. `/software` contains five clearly labelled
interactive showcase publications—Sori, Namu, Goyo, Haru Weather and Dami—so
the publishing system can be experienced without presenting concepts as
available products.

## Identity

The permanent Harulo mark is the exact four-piece geometry in
`lib/brand/geometry.ts`: one ring, one Ember satellite and two publication
tiers. Cobalt Ember is the only public palette. The ring is structure, the
satellite is movement, and the tiers are publication planes.

## Development

This is a Vinext/React site targeting Cloudflare Workers. Use Node 22.13 or
newer.

```bash
npm ci
npm run dev
```

The local Worker preview is available through the repository's existing
`start` script after a build.

## Verification

```bash
npm run typecheck
npm run lint
npm run verify:brand
npm run build
npm run test:ui
```

Playwright checks run in Chromium and WebKit. The CI workflow runs the same
production gate on pushes and pull requests.

## Publishing real software

Add only verified records to `lib/publishing/catalog.ts`. Showcase concepts
belong in `lib/publishing/showcase.ts` and must never be copied into the live
catalog, sitemap, JSON-LD, downloads, releases or support archives.

The site is intended to deploy from GitHub to a Cloudflare Worker. Keep
Spaceship as the registrar and manage production DNS/SSL at the hosting layer.
