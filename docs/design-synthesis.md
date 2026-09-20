# Harulo — software, brought into daylight

## Inspection and brand

Baseline: public repository `kimhw8084/harulostudio`, revision `e60ee58b1b6be3134cc6db66297f280496349785`. The repository has one route and one studio-specific client component, with a supplied shadcn/Radix primitive library. The rendered site uses its Button primitive. The remaining catalog provides future controls; it is not a product catalog. Essential content is server rendered, although the entire original homepage is a client boundary.

Reviewed: README, content, homepage component, stylesheet, layout, UI contract, verification record, asset provenance, favicon, component exports/dependencies, runtime configuration and current artwork. Preserve the locally served Instrument Serif/DM Sans, sun mark, mineral image, paper/forest/terracotta palette, native anchors, visible focus, truthful clipboard handling, storage-denial fallback and reduced-motion precedence. Improve the publisher message, section order, type sizes, client boundaries, theme initialization, reusable content architecture and route coverage.

Harulo observes ordinary life, makes useful software, publishes it and keeps improving it. 하루 means a day. 하루로 supplies the brand's conceptual direction: toward a better day. This directional reading is a brand interpretation, not a claim that the word literally means “by today.” The identity is an independent software publisher, not an agency.

## Single creative thesis

**Software, brought into daylight.** A sunlit mineral composition becomes a window into a useful interaction. A line moves toward a destination; the interface resolves; an edition becomes something people can use. The physical and digital share one frame. This is the signature, not an intro that delays the site.

The production hero contains a genuinely working, deliberately small browser study: put one intention in view. It is explicitly a studio study, not a claimed product or simulated product screenshot. When real products exist, the same publication frame can feature verified product media. The fictional edition uses clearly identified concept interfaces.

## Curation

| Priority          | Decision                                                                                                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Essential         | Explicit software publisher identity in the first viewport; design/build/publish/maintain statement; software before philosophy; truthful catalog; reusable product/release/support/press records; real destinations; accessible static equivalents. |
| Strong supporting | Software Sunrise centerpiece; editorial edition shelf; small sun/horizon/imprint family; directional arrows; environmental theme transition; Korean name story; release metadata; server-rendered filtering and pagination.                          |
| Future            | Real product media and downloads, localized content, approved privacy records, product social cards, journal, status, accounts/API/docs where an actual product requires them. Data slots and documented routes, not fictitious services.            |
| Omit              | Dark boot intro, repeated scene transitions, scroll pinning, automatic local-time overrides, product orbits, magnetic cursor, mechanical version ticker, adaptive favicon, redundant release/activity sections and invented corporate scale.         |

## Narrative and visual system

1. Publisher identity: what Harulo is, what it does, software/daylight centerpiece.
2. Published software: current empty state is honest; mature edition shows a numbered editorial shelf with platform, edition, version and lifecycle state.
3. Latest releases when records exist: publication metadata links to a durable release record.
4. 하루 → 하루로: the question behind the software; directional Korean composition.
5. Observe / design / build / publish / improve: one continuous making cycle with concise principles.
6. Human contact, useful publisher navigation and the solar imprint.

Warm paper and forest ink remain the core. Terracotta marks direction; muted mineral tones distinguish product editions. Instrument Serif gives editorial weight; DM Sans carries reading and controls; system monospace carries versions/dates. Circle, horizontal rule and north-east arrow are the complete symbolic vocabulary. Utility pages use the same identity with denser, calmer layouts.

## Motion grammar

| Family      | Behavior                                                           | Limit                                                                                            |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Beginning   | Light arrives; an interface rises a few pixels into place          | Essential content is visible in the initial HTML.                                                |
| Direction   | Arrow or control advances 2px toward its destination               | No magnetic hit targets or moving text while reading.                                            |
| Assembly    | The small working study resolves into its saved-in-tab state       | Triggered by an actual user action; never implies a release.                                     |
| Publication | A frame settles into alignment; imprint remains still              | No looping stamps or fake progress.                                                              |
| Environment | Day/evening light recedes or arrives; slow decorative solar motion | Manual choice persists; device reduced motion and global pause win; hidden/offscreen work stops. |

Durations/easings live in theme tokens. Native scrolling remains native. Static and reduced-motion compositions show the same content, hierarchy and controls.

## Architecture and honesty boundary

Typed records live independently of views. Product, release, support article and press item identities are stable. External downloads carry explicit metadata; unpublished/internal statuses stay out of public queries. Public views use only verified records. Unknown product/release/resource routes return 404 instead of plausible placeholders.

The six synthetic products live in `lib/publishing/fixtures.ts`. `/preview/2036` and its nested routes are development-only, visibly marked fictional, noindex, and return 404 in production. They reuse production views and queries. There are no fictional downloads, store badges, fabricated screenshots or product structured-data claims in production. Growth tests cover 1/5/20 products and hundreds of release rows.

The first implementation needs no CMS or database. A later content adapter can provide the same records. No speculative account, analytics, status, payment or API system is installed.

## Acceptance

Verify production identity and fictional-data exclusion, catalog/release relationships, filters and pagination, representative product/support/release pages, keyboard and touch, 320px/large text, both themes, reduced motion, forced colors, no-JS essential navigation, storage/clipboard/image failures and slow-network behavior. Document measured evidence and remaining native-device/assistive-technology limits separately. Do not equate automated checks with universal accessibility or aesthetic certification.
