# Harulo Studio UI contract

Source: [Project OS Golden UI Engineering Lawbook v2](https://app.notion.com/p/3e0c564c8d048164821cdd25d4912ae1). Applicable modules read: Universal/Craft/Layout, Accessibility/State/Forms, Component/Relationship, and Qualification clauses.

## Product and acceptance boundary

English independent software-publisher website with meaningful Korean identity. Visitors identify the publisher, explore available software/releases, find support, read the studio story, access press material and contact the studio. The initial live catalog is empty. Synthetic future products exist only in a visibly marked, noindex, development-only route. No released product, download, privacy claim or company scale is invented.

Target: desktop/mobile web at 320px and above; pointer, touch and keyboard; Daylight/Low light, device-reduced motion and forced colors. Native assistive technology, physical devices and field performance require separate verification. No claim of universal aesthetic superiority or complete accessibility conformance.

Visual thesis: **four pieces, one world**. The approved ㅎ-derived ring, satellite and two tiers transform into useful software and publishing structures, then return exactly to the owner-supplied geometry. No scroll ownership, blocking intro or alternate master logos.

## Contracts and oracles

| Surface                                          | Lawbook mapping                                   | Expected behavior and verification                                                                                                                                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header, skip link, internal destinations, footer | CMP-02/11; TASK-02/03; ACC-04/05; LAY-07          | Native destination URLs, clear landmarks, keyboard activation/focus, reachable content at narrow widths/large text. Unknown records return 404.                                                                                                                |
| Theme                                            | CMP-01/03; VIS-02/08; JOIN-03                     | Stable button name and pressed state. Manual override persists and wins over later system changes, including within a tab when storage fails. Paired text/surface colors switch together; Daylight/Low light remain paired color environments.              |
| Software Origin and motion                               | CMP-29; VIS-10; ACC-09                            | Decorative SVG is hidden from assistive technology; reserved stage geometry and static equivalents. Device reduced motion and global pause win. Animation and scroll work stop when hidden/offscreen. No pointer-only meaning.                                 |
| Working Software Origin                                  | CMP-01; STATE-02/03; ACC-04/06/10                 | Explicitly not a released app. Named disclosure button; one-minute timer with pause/resume/reset and wall-clock accuracy. Reset restores the minute and publishing counter. Status announces state, not every tick. No persistence/network side effect; no-JS explanation.       |
| Publication applications                         | CMP-01/11; ACC-04/06; JOIN-03                     | Native summary activation opens each edition. Concept controls update real local state, with clear fictional labels and no claimed downloads/system integrations.                                                                                              |
| Catalog/archive filters                          | CMP-11; TASK-02/03; STATE-01; ACC-06              | Native labeled GET inputs/selects; URL is the filter state. Product/platform/status or product/year/type/platform/version search combine predictably. Empty results explain recovery; reset and pagination preserve useful destinations. No async-search race. |
| Product/release/resource links                   | CMP-02; JOIN-03; TASK-03                          | Same stable product IDs drive detail, release, support and discovery. Absent media/download/resource claims are omitted. Release chronology and lifecycle states are explicit. Archive pagination bounded to 12 rows.                                          |
| Contact and copy                                 | CMP-01/02/18; JOIN-04; STATE-02/03/04/07; ACC-10  | Visible selectable address plus correct mailto. Copy success only after promise resolves; rejection recovery; no overlapping writes; unmount discards acknowledgement. Does not claim an email was sent.                                                       |
| Typography/layout                                | VIS-01–06/10; LAY-02–04/07/08/10; ACC-02/03/07/13 | Reflow at 320px and 200% text plus spacing stress; no global overflow hiding. Contrast, semantic order, visible focus and practical touch targets.                                                                                                             |
| Content boundary                                 | JOIN-03/04; TASK-03                               | Live public queries exclude synthetic and internal records. Dev previews cannot be visited in production; sitemap and metadata contain only verified records. No fixture downloads or fabricated screenshots.                                                  |

Static/server components own content and relationships; client islands own theme/pause, clipboard and the Software Origin and fictional concept controls. Native scrolling, forms and browser history remain native. The mobile navigation uses the existing accessible dialog primitive: named trigger, focus containment, Escape dismissal and focus restoration. A native no-JS navigation fallback remains available. No hover-only action, transaction, authentication or destructive workflow is introduced. Theme/motion preferences are device-local and non-sensitive.

## Verification plan

Run type checking and the production Worker build. Exercise the current production state and mature development state separately. Cover real destinations, filters, pagination, 1/5/20 products, 240 releases, touch, keyboard, 320px/landscape, large/text-spaced content, both themes, reduced/pause/offscreen motion, forced colors, clipboard/storage/font failures, no-JS essentials and throttled network/CPU. Capture and inspect rendered pages, not only source.

Negative controls deliberately inject overflow and invalid catalog records, then verify the corresponding oracles detect those failures. Automated checks do not substitute for native screen-reader or physical-device review. Record actual outcomes and explicit skips in `verification.md`.

## Permanent identity invariants

The default SVG has exactly four primitives and the approved coordinates. Generator output and page marks are checked against those values. Twelve distinct transformations keep their four owners throughout every sampled pose, never substitute a fading alternate logo, and return exactly to the master. Previous candidates remain development-only archives.

Native cross-document view transitions are progressive enhancement. They never intercept, delay or fetch navigation. On compatible browsers, the selected publication surface links catalog and detail; other pages use a finite ring-position reveal. Reduced motion and global pause skip these transitions. [Platform reference](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document).
