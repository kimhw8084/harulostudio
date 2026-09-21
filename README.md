# Harulo Studio · 하루로

An independent software publisher. **A little better, every day.** The permanent Harulo identity is **Cobalt Ember** and the approved ㅎ-derived master: one ring, one satellite, two publishing tiers. Its resting geometry is immutable. The same four primitives open into working software and return to their exact original coordinates.

The public catalog remains deliberately empty: no products have been announced. The hero's one-minute instrument is explicitly a studio experiment, not a released application. It uses a wall-clock deadline, supports pause/resume/reset and sends or saves nothing.

## Develop and verify

Requires Node 22.13+. Run `npm ci`, then `npm run dev`; use the printed URL. `npm run build` creates the Cloudflare Worker output. `npm start -- --port 8791` serves that production build locally.

Install test browsers with `npx playwright install chromium webkit`. Run `npx tsc --noEmit`. With the production preview running at port 8791, run `npm run test:ui`. Development-only catalog coverage: `HARULO_TEST_URL=http://localhost:5173 HARULO_TEST_MODE=development npm run test:ui` (substitute the actual dev port). Screenshots, traces and reports are ignored under `work/`.

For eleven deterministic visual checkpoints, run `HARULO_VISUAL=1 HARULO_TEST_MODE=development HARULO_TEST_URL=http://localhost:5173 npx playwright test tests/visual.spec.ts --project=chromium`. Committed baselines use the pinned Chromium renderer on macOS; other operating systems need reviewed platform-specific baselines. Update intentionally with `--update-snapshots`, then inspect the images and rerun without that flag. Baselines are test evidence, never public product screenshots.

## Explore the future without inventing the present

While `npm run dev` is running, open `/preview/2036` for the twelve-product fictional publisher universe (181 releases, 96 support articles, 24 announcements and eleven annual milestones). Its software, release, support, product privacy, press, studio, history and archive routes reuse the production shells. All twelve products have working, explicitly fictional interface specimens. `/preview/2036/growth/software` and `/preview/2036/growth/releases` exercise 20 products and 240 releases with pagination.

Every preview carries a fictional-content notice and noindex metadata. The entire preview route returns **404 in production**, before importing the fixtures. There are no fictional downloads or store links. This is an architecture/design test, not an announcement or launch forecast.

## Official identity system — development only

Open `/preview/identity-lab` for **HARULO MASTER MARK**. The official laboratory now contains:

- The exact 100 × 100 geometry, coordinate overlay, monochrome and reversed lockups.
- Exact-artboard tests at 16, 20, 24, 32, 48, 64, 128, 256 and 512 pixels.
- **Twelve working transformations:** interface, edition, release timeline, navigation, page portal, loading, publishing stamp, product world, screenshot viewport, release number, footer closure and mobile navigation.
- Finite play/replay/pause, slow inspection, keyboard scrubbing and composed reduced-motion destinations. Motion sleeps offscreen and in hidden tabs.
- A 24-system production index, three event-driven environments, four quality tiers and breakpoint previews.
- Shared contexts with products, release history, support, privacy, press, lifecycle and the honest empty state.
- Permanent Cobalt Ember light/dark tokens. Old theme preferences migrate; no public palette switching remains.

Previous research is preserved at `/preview/identity-lab/archive`: the five Round 2 candidates, three Round 1 candidates, their 43 transformations, comparison tools and private review notes. They are historical studies, not alternate approved marks.

All preview routes return **404 outside development**, before importing the lab or synthetic records. `npm run brand:assets` regenerates the favicon, downloadable SVG lockups and nine PNG sizes directly from `lib/brand/geometry.ts`. Do not hand-edit generated assets. See `docs/identity-lab.md`.

Read [the Cobalt Ember engineering reference](docs/cobalt-ember-system.md) for scene channels, lifecycle controls, fallbacks, token ownership and content boundaries.

## Content architecture

| Source                                  | Responsibility                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `lib/site-content.ts`                   | Studio identity, contact, philosophy and principles                                 |
| `lib/publishing/types.ts`               | Products, releases, downloads, media, privacy notices, support and press records    |
| `lib/publishing/catalog.ts`             | Verified production records; public visibility, querying, pagination and validation |
| `lib/publishing/fixtures.ts`            | Isolated synthetic catalog and growth fixtures                                      |
| `lib/publishing/metadata.ts`            | Record-driven SEO, canonical URLs and structured data                               |
| `components/publishing-views.tsx`       | Reusable catalog, product, archive, release, support and privacy views              |
| `components/product-edition.tsx`        | Publisher shelf, media and release rows                                             |
| `components/harulo-site.tsx`            | Server-rendered homepage narrative and studio sections                              |
| `components/brand/`                    | Canonical mark, four-piece transformations, software origin, navigation, footer and official lab |
| `lib/brand/`                           | Immutable geometry, motion grammar and native navigation enhancement |
| `components/minute-instrument.tsx`      | Working, local one-minute instrument |
| `components/application-instrument.tsx` | Interactive, explicitly fictional product concepts                                  |
| `components/experience-provider.tsx`    | Persistent manual theme, device preferences and global motion pause                 |
| `app/globals.css`                       | Semantic color, typography, spacing, surface, product and motion tokens             |

Use static typed records until a CMS or release API is justified. A future adapter can return `PublisherCatalog` without rewriting views. Translation fields are prepared; localized routing and reviewed translations are intentionally not pretended to exist. Optional download, store, documentation, status, security and developer links render only when provided. Media records support screenshots, artwork and videos; use verified media, not concept interfaces, for real products.

## Publish a real product

1. Add a complete, verified `Product` to `liveCatalog.products`. Set a stable ID/slug, public visibility, accurate public lifecycle status, copy, platforms and edition. Internal/exploring/development/private-beta records are excluded from public queries.
2. Add genuine versioned `Release` records referencing that product ID. Record publication dates, channels, compatibility, known issues and download metadata accurately. Update the catalog's `asOf` date when publishing; `validateCatalog` checks dates against it.
3. Add actual screenshot/media files with dimensions and meaningful alt text. Supply real download/app-store destinations, requirements, accessibility notes and approved resource links. Leave absent resources absent.
4. Add support articles and, when reviewed, a product-specific privacy record. Add factual press announcements separately. Never convert demonstration provenance to verified without independently replacing/checking every claim.
5. Run catalog validation, type checking, production build and both browser suites. Check the product's actual downloads, signatures and support destinations independently. The homepage shelf, archive, detail pages, metadata and sitemap then use the records automatically.

Routes: `/software`, `/software/[slug]`, `/releases`, `/releases/[product]/[version]`, `/support`, `/support/[product]`, `/support/[product]/[article]`, `/software/[slug]/privacy`, `/studio`, `/history`, `/archive`, `/archive/[slug]`, `/software/[slug]/history`, `/press`, `/press/[slug]`. Missing records return 404. Native GET filters preserve URLs and work without JavaScript. Catalog and release archives show 12 records per page.

## Design and quality

Read `docs/design-synthesis.md` for the permanent four-part identity and deliberate exclusions. `docs/ui-contract.md` maps supported tasks to the supplied Golden UI Engineering Lawbook. `docs/verification.md` distinguishes observed evidence from untested claims. `docs/assets.md` records artwork/font provenance.

Essential reading, navigation and contact are server rendered. Device reduced motion overrides decorative motion; pause and manual theme persist when storage is available. A finite logo assembly leads into the working hero when visible; it never blocks reading. User action always takes over. The actual timer is independent of decorative-motion pause. Publishing disclosures remain native and work without JavaScript. The mobile dialog provides focus containment, Escape dismissal and focus return, with native navigation available when JavaScript is disabled.

Cross-document View Transitions progressively connect publication surfaces and reveal other routes through the ring's position. Unsupported browsers use the same native links immediately. No fetching override, synthetic router, scroll hijacking, tracking, account system, analytics, CMS or database was added.

Internal links use `components/site-link.tsx`, a native anchor wrapper. Production tests exposed a navigation/prefetch exception in the pinned Vinext client Link helper, so the site deliberately uses native document navigation. This preserves real destinations, browser history and no-JS behavior without modifying the supplied runtime or adding another router.

## Hosting

Repository: [kimhw8084/harulostudio](https://github.com/kimhw8084/harulostudio). Keep the Sites Vite integration and `.openai/hosting.json`. Deployment remains an owner-private review. `harulostudio.com` is the intended production canonical domain; DNS connection and public launch are separate steps, not completed by a source push. Never put deployment credentials in source or Git remotes.

The supplied optional UI primitives and framework scaffolding are retained; unused authentication/database examples are not active product features.
