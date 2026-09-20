# Harulo Studio

The independent software studio behind 하루로. A warm, editorial introduction with original daylight artwork, day/evening themes, optional decorative motion, and direct contact at harulostudio@gmail.com.

## Develop and verify

Requires Node 22.13 or newer. Run `npm ci`, then `npm run dev` and use the printed loopback URL. `npm run build` creates the Cloudflare Worker output. `npm start -- --port 8791` serves that production build locally.

Install browser test binaries with `npx playwright install chromium webkit`. With the built preview running at port 8791, run `npm run test:ui`; `HARULO_TEST_URL` can select a different local preview. Run `npx tsc --noEmit` for type checking. Test traces, screenshots and reports stay in ignored `work/`.

## Customize

- `lib/site-content.ts`: studio identity, contact address, hero description and principles.
- `components/harulo-site.tsx`: section copy, semantic layout and small client-side interactions.
- `app/globals.css`: semantic color tokens for both themes, fonts, spacing, responsive layout and motion.
- `app/layout.tsx`: search/social metadata; `public/favicon.svg`: the studio mark.
- `public/images/` and `public/fonts/`: locally served assets; font licenses are included.

Keep future products as data with genuine names, screenshots, availability and working destinations. Replace the first-chapter section with a product collection when releases exist; do not invent release claims. Product detail/support/privacy routes can be added under `app/` as needed. No database, account system, analytics or CMS is required for this first site.

## Design and quality

`docs/ui-contract.md` maps this site's supported tasks to the supplied Golden UI Engineering Lawbook. `docs/verification.md` records actual evidence and limits. `docs/assets.md` records the original artwork prompt and fonts. Essential reading and contact links work without JavaScript; optional controls appear only once ready. Motion follows the device preference and can be paused. Clipboard feedback reflects the actual result.

## Hosting

This project uses the Sites Vite integration and `.openai/hosting.json`; retain both. Deployment is a private review by default. `harulostudio.com` is the intended domain, not a claim that DNS has been connected. Production domain connection and public launch are separate steps. Do not store credentials in source or Git remotes.

The source retains the supplied framework's optional UI and data scaffolding for later development, but this site does not use its optional authentication or database features.
