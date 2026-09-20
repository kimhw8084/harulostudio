# Harulo Studio UI contract

Source: [Project OS Golden UI Engineering Lawbook v2](https://app.notion.com/p/3e0c564c8d048164821cdd25d4912ae1). Applicable modules read: Universal/Craft/Layout, Accessibility/State/Forms, Component/Relationship, and Qualification clauses.

## Product and acceptance boundary

English public studio introduction with Korean name/companion copy. Visitors read the story, navigate to sections, and contact the solo founder. There are no released products, accounts, forms, payments, analytics, or server-side user data. Target desktop and mobile web, 320px and above; pointer, touch and keyboard; daylight/evening themes, reduced motion and forced colors. Native screen readers and real devices require separate human verification. Do not describe browser evidence as complete accessibility conformance or universal aesthetic superiority.

Visual thesis: a tactile window onto an ordinary day; warm paper, forest ink, terracotta, editorial serif and clear sans serif; generous but structured space. One original artwork. Motion belongs to decorative artwork and small feedback, never scroll ownership or essential content.

## Contracts and oracles

| Surface | Lawbook mapping | Expected behavior and verification |
| --- | --- | --- |
| Header, skip link, section links, footer return | CMP-02/11; TASK-02/03; ACC-04/05; LAY-07 | Native anchor URLs, keyboard activation, visible focus, content destination remains reachable at narrow widths and large text. Back follows browser anchor history. |
| Theme button | CMP-01/03; VIS-02/08; JOIN-03 | Button has stable accessible name and accurate pressed state. Applies complete token palette. Preserves theme across reload when storage works; remains functional when storage fails. Resizing must not reset it. |
| Decorative artwork | CMP-29; VIS-10; ACC-09 | Empty alt, reserved aspect ratio; image failure does not remove any meaningful content/action. Pointer movement is optional and never required. System reduced motion stops it; explicit pause stops all running decoration. |
| Motion control | CMP-01; ACC-09 | Pause and resume change real animations; device reduced-motion setting wins and is explained. Keyboard and touch equivalent. Preference is device-local and non-sensitive. |
| Contact mail link | CMP-02; TASK-03 | Correct mailto recipient; never claims an email was sent. Raw address remains visible/selectable if no email app is configured. |
| Copy email | CMP-01/18; JOIN-04; STATE-02/03/04/07; ACC-10 | Clipboard promise must resolve before success. Reject/unsupported clipboard shows recovery beside visible address. Repeated input cannot overlap writes; unmount discards UI acknowledgement. Focus stays on button. Test successful copy, blocked copy, recovery and repeat. |
| Typography/content/layout | VIS-01–06/10; LAY-02–04/07/08/10; ACC-02/03/07/13 | Reflow at 320px and 200% text; text-spacing stress; no hidden overflow repair. Measure contrast and focus; semantic reading order; minimum 44px primary control targets. |

One page owns scrolling; no fixed/sticky bars, modal, drawer, hover-only controls, or scroll hijacking. Essential content is server rendered. Theme and motion preferences have no object, workspace or identity scope. Authentication, forms, destructive effects, IME handling, database state and async search are not applicable.

## Verification plan

Run the production build and TypeScript check. Browser scenarios: desktop, mobile 390px, narrow 320px, short landscape, both themes, reduced motion, forced colors, 200% text, text-spacing overrides, keyboard traversal, anchor navigation, clipboard success/failure/retry, storage denied, missing hero image, and JavaScript disabled content availability. Negative control: deliberately inject an overly wide component into the isolated test page to prove the geometry assertion detects it, then remove it. Separate screenshots from semantic/interaction checks. Record actual browser versions and limitations in verification.md.
