# Harulo Studio UI contract

Source: [Project OS Golden UI Engineering Lawbook v2](https://app.notion.com/p/3e0c564c8d048164821cdd25d4912ae1). Applicable modules read: Universal/Craft/Layout, Accessibility/State/Forms, Component/Relationship, and Qualification clauses.

## Product and acceptance boundary

English independent software-publisher website with meaningful Korean identity. Visitors identify the publisher, explore five visibly marked interactive showcase publications, read the studio story, access press material and contact the studio. The initial live catalog is empty. Showcase products remain outside live SEO, release, support and download records. No company history, release, privacy claim or scale is invented.

Target: desktop/mobile web at 320px and above; pointer, touch and keyboard; light/dark Cobalt Ember themes, device-reduced motion and forced colors. Native assistive technology, physical devices and field performance require separate verification. No claim of universal aesthetic superiority or complete accessibility conformance.

Visual thesis: **four pieces, one world**. The approved ㅎ-derived ring, satellite and two tiers transform into useful software and publishing structures, then return exactly to the owner-supplied geometry. No scroll ownership, blocking intro or alternate master logos.

## Contracts and oracles

| Surface                                          | Lawbook mapping                                   | Expected behavior and verification                                                                                                                                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header, skip link, internal destinations, footer | CMP-02/11; TASK-02/03; ACC-04/05; LAY-07          | Native destination URLs, clear landmarks, keyboard activation/focus, reachable content at narrow widths/large text. Unknown records return 404.                                                                                                                |
| Theme                                            | CMP-01/03; VIS-02/08; JOIN-03                     | Stable action label (“Switch to dark/light mode”). Manual override persists and wins over later system changes, including within a tab when storage fails. Paired text/surface colors switch together in art-directed light/dark Cobalt Ember environments. |
| Software Origin and motion                               | CMP-29; VIS-10; ACC-09                            | Decorative SVG is hidden from assistive technology; reserved stage geometry and static equivalents. Device reduced motion and global pause win. Animation and scroll work stop when hidden/offscreen. No pointer-only meaning.                                 |
| Publication Genesis                                  | CMP-01; STATE-02/03; ACC-04/06/10                 | Explicitly not released software. Named disclosure button; the canonical mark opens a real local showcase application through tabs and a shared aperture. Closed content is inert; Escape/focus return work; no persistence/network side effect; no-JS links remain usable. |
| Publication applications                         | CMP-01/11; ACC-04/06; JOIN-03                     | Native summary activation opens each edition. Concept controls update real local state, with clear fictional labels and no claimed downloads/system integrations.                                                                                              |
| Showcase filtering                          | CMP-11; TASK-02/03; STATE-01; ACC-06              | Native labeled GET search/platform filters; URL is the filter state. The showcase-only view omits meaningless one-option status filtering. Empty results explain recovery. |
| Product/release/resource links                   | CMP-02; JOIN-03; TASK-03                          | Same stable product IDs drive detail, release, support and discovery. Absent media/download/resource claims are omitted. Release chronology and lifecycle states are explicit. Archive pagination bounded to 12 rows.                                          |
| Contact and copy                                 | CMP-01/02/18; JOIN-04; STATE-02/03/04/07; ACC-10  | Visible selectable address plus correct mailto. Copy success only after promise resolves; rejection recovery; no overlapping writes; unmount discards acknowledgement. Does not claim an email was sent.                                                       |
| Typography/layout                                | VIS-01–06/10; LAY-02–04/07/08/10; ACC-02/03/07/13 | Reflow at 320px and 200% text plus spacing stress; no global overflow hiding. Contrast, semantic order, visible focus and practical touch targets.                                                                                                             |
| Content boundary                                 | JOIN-03/04; TASK-03                               | Live public queries exclude showcase/internal records from release/support/download/schema systems. Showcase detail pages are noindex and clearly marked. Sitemap and organization metadata contain only verified records. |

Static/server components own content and relationships; client islands own theme/pause, clipboard and the Software Origin and fictional concept controls. Native scrolling, forms and browser history remain native. The mobile navigation uses the existing accessible dialog primitive: named trigger, focus containment, Escape dismissal and focus restoration. A native no-JS navigation fallback remains available. No hover-only action, transaction, authentication or destructive workflow is introduced. Theme/motion preferences are device-local and non-sensitive.

## Verification plan

Run type checking and the production Worker build. Exercise the empty verified catalog and the five local showcase applications separately. Cover real destinations, showcase filters, touch, keyboard, 320px/landscape, large/text-spaced content, both themes, reduced/pause/offscreen motion, forced colors, clipboard/storage/font failures, no-JS essentials and throttled network/CPU. Capture and inspect rendered pages, not only source.

Negative controls deliberately inject overflow and invalid catalog records, then verify the corresponding oracles detect those failures. Automated checks do not substitute for native screen-reader or physical-device review. Record actual outcomes and explicit skips in `verification.md`.

## Permanent identity invariants

The default SVG has exactly four primitives and the approved coordinates. Generator output and page marks are checked against those values. Transformations keep their four owners throughout every sampled pose and return exactly to the master. Previous candidates are not part of the production tree.

Native cross-document view transitions are progressive enhancement. They never intercept, delay or fetch navigation. On compatible browsers, the selected publication surface links catalog and detail; other pages use a finite ring-position reveal. Reduced motion and global pause skip these transitions. [Platform reference](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document).
