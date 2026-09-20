# Harulo Studio · 하루로

An independent software publisher. **A day, unfolded.** Harulo 2.0 is a complete visual break: signal yellow, ink, cobalt, an oversized Syne masthead and a 24-slat Dayfold that transforms into a working instrument. The homepage leads with what Harulo does: design, build, publish and maintain software for everyday life.

The public content is deliberately honest: no products have been announced. The working hero interaction is explicitly a studio experiment, not a released application. Open the Dayfold for a one-minute focus timer. It uses a wall-clock deadline, supports pause/resume/reset and sends or saves nothing.

## Develop and verify

Requires Node 22.13+. Run `npm ci`, then `npm run dev`; use the printed URL. `npm run build` creates the Cloudflare Worker output. `npm start -- --port 8791` serves that production build locally.

Install test browsers with `npx playwright install chromium webkit`. Run `npx tsc --noEmit`. With the production preview running at port 8791, run `npm run test:ui`. Development-only catalog coverage: `HARULO_TEST_URL=http://localhost:5173 HARULO_TEST_MODE=development npm run test:ui` (substitute the actual dev port). Screenshots, traces and reports are ignored under `work/`.

## Explore the future without inventing the present

While `npm run dev` is running, open `/preview/2036` for the six-product fictional edition. Its nested software, release and support pages reuse the real production views. `/preview/2036/growth/software` and `/preview/2036/growth/releases` exercise 20 products and 240 releases with pagination.

Every preview carries a fictional-content notice and noindex metadata. The entire preview route returns **404 in production**, before importing the fixtures. There are no fictional downloads or store links. This is an architecture/design test, not an announcement or launch forecast.

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
| `components/dayfold.tsx`                | Transforming 24-slat centerpiece and working minute timer                           |
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

Routes: `/software`, `/software/[slug]`, `/releases`, `/releases/[product]/[version]`, `/support`, `/support/[product]`, `/support/[product]/[article]`, `/software/[slug]/privacy`, `/studio`, `/press`, `/press/[slug]`. Missing records return 404. Native GET filters preserve URLs and work without JavaScript. Catalog and release archives show 12 records per page.

## Design and quality

Read `docs/design-synthesis.md` for the selected Harulo 2.0 direction and deliberate exclusions. `docs/ui-contract.md` maps supported tasks to the supplied Golden UI Engineering Lawbook. `docs/verification.md` distinguishes observed evidence from untested claims. `docs/assets.md` records artwork/font provenance.

Essential reading/navigation/contact is server rendered. Device reduced motion overrides decorative motion; pause and manual theme persist when storage is available. High signal and Low light share a geometric identity; text/surface colors change together to retain contrast. The same 24 SVG slats transform from folded object to timer ticks. Publication spines open through native details/summary controls, including without JavaScript. Timer rendering stops offscreen or in hidden tabs; its deadline remains accurate on return. Optional controls appear once ready. No scroll hijacking, tracking, account system, analytics, CMS or database is installed for this site.

Internal links use `components/site-link.tsx`, a native anchor wrapper. Production tests exposed a navigation/prefetch exception in the pinned Vinext client Link helper, so the site deliberately uses native document navigation. This preserves real destinations, browser history and no-JS behavior without modifying the supplied runtime or adding another router.

## Hosting

Repository: [kimhw8084/harulostudio](https://github.com/kimhw8084/harulostudio). Keep the Sites Vite integration and `.openai/hosting.json`. Deployment remains an owner-private review. `harulostudio.com` is the intended production canonical domain; DNS connection and public launch are separate steps, not completed by a source push. Never put deployment credentials in source or Git remotes.

The supplied optional UI primitives and framework scaffolding are retained; unused authentication/database examples are not active product features.
