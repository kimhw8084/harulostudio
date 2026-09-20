# Harulo Studio UI contract

Source: [Project OS Golden UI Engineering Lawbook v2](https://app.notion.com/p/3e0c564c8d048164821cdd25d4912ae1). Applicable modules read: Universal/Craft/Layout, Accessibility/State/Forms, Component/Relationship, and Qualification clauses.

## Product and acceptance boundary

English independent software-publisher website with meaningful Korean identity. Visitors identify the publisher, explore available software/releases, find support, read the studio story, access press material and contact the studio. The initial live catalog is empty. Synthetic future products exist only in a visibly marked, noindex, development-only route. No released product, download, privacy claim or company scale is invented.

Target: desktop/mobile web at 320px and above; pointer, touch and keyboard; daylight/evening, device-reduced motion and forced colors. Native assistive technology, physical devices and field performance require separate verification. No claim of universal aesthetic superiority or complete accessibility conformance.

Visual thesis: **software, brought into daylight**. One solar/material composition gives way to a genuinely working software study. Product editions use paper-like layouts and precise digital metadata. Circle, horizon and directional arrow connect the identity. No scroll ownership, blocking intro or competing centerpiece.

## Contracts and oracles

| Surface                                          | Lawbook mapping                                   | Expected behavior and verification                                                                                                                                                                                                                             |
| ------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header, skip link, internal destinations, footer | CMP-02/11; TASK-02/03; ACC-04/05; LAY-07          | Native destination URLs, clear landmarks, keyboard activation/focus, reachable content at narrow widths/large text. Unknown records return 404.                                                                                                                |
| Theme                                            | CMP-01/03; VIS-02/08; JOIN-03                     | Stable button name and pressed state. Manual override persists and wins over later system changes, including within a tab when storage fails. Paired text/surface colors switch together; environmental art/shadows transition.                                |
| Artwork and motion                               | CMP-29; VIS-10; ACC-09                            | Decorative empty alt, reserved image geometry, static equivalent. Device reduced motion and global pause win. Animation and scroll work stop when hidden/offscreen. No pointer-only meaning.                                                                   |
| Working study                                    | CMP-01; STATE-02/03; ACC-04/06/10                 | Explicitly not a released app. Labeled, bounded input; native form submission; no empty submission. Keep displays the actual entered text, never HTML. Clear returns focus to the input. No persistence/network side effect; no-JS explanation.                |
| Catalog/archive filters                          | CMP-11; TASK-02/03; STATE-01; ACC-06              | Native labeled GET inputs/selects; URL is the filter state. Product/platform/status or product/year/type/platform/version search combine predictably. Empty results explain recovery; reset and pagination preserve useful destinations. No async-search race. |
| Product/release/resource links                   | CMP-02; JOIN-03; TASK-03                          | Same stable product IDs drive detail, release, support and discovery. Absent media/download/resource claims are omitted. Release chronology and lifecycle states are explicit. Archive pagination bounded to 12 rows.                                          |
| Contact and copy                                 | CMP-01/02/18; JOIN-04; STATE-02/03/04/07; ACC-10  | Visible selectable address plus correct mailto. Copy success only after promise resolves; rejection recovery; no overlapping writes; unmount discards acknowledgement. Does not claim an email was sent.                                                       |
| Typography/layout                                | VIS-01–06/10; LAY-02–04/07/08/10; ACC-02/03/07/13 | Reflow at 320px and 200% text plus spacing stress; no global overflow hiding. Contrast, semantic order, visible focus and practical touch targets.                                                                                                             |
| Content boundary                                 | JOIN-03/04; TASK-03                               | Live public queries exclude synthetic and internal records. Dev previews cannot be visited in production; sitemap and metadata contain only verified records. No fixture downloads or fabricated screenshots.                                                  |

Static/server components own content and relationships; client islands own theme/pause, clipboard and the in-memory study. Native scrolling, forms and browser history remain native. No modal, drawer, hover-only action, transaction, authentication or destructive workflow is introduced. Theme/motion preferences are device-local and non-sensitive.

## Verification plan

Run type checking and the production Worker build. Exercise the current production state and mature development state separately. Cover real destinations, filters, pagination, 1/5/20 products, 240 releases, touch, keyboard, 320px/landscape, large/text-spaced content, both themes, reduced/pause/offscreen motion, forced colors, clipboard/storage/image failures, no-JS essentials and throttled network/CPU. Capture and inspect rendered pages, not only source.

Negative controls deliberately inject overflow and invalid catalog records, then verify the corresponding oracles detect those failures. Automated checks do not substitute for native screen-reader or physical-device review. Record actual outcomes and explicit skips in `verification.md`.
