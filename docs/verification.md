# Verification — Harulo 2.0 / The Dayfold

Candidate: complete visual reinvention, 2026-09-20. The application/data routes are retained; the visual system, hero, publication presentation, icon family, fonts and motion are replaced. Historical records follow this section.

- Production Worker build and TypeScript pass. Authored TS/TSX lint reports zero errors and two existing native-image recommendations (press SVG and record-driven product media).
- Chromium and WebKit: **35 production checks passed, 13 explicitly skipped; 42 development checks passed, 6 explicitly skipped.** Counts include repeated data tests across browser projects, not unique journeys. No unexpected failures or retries in these runs.
- Production skips: ten development-only mature scenarios plus WebKit clipboard permissions, forced colors and CDP throttling. Development skips: two production truth gates, two throttling cases and WebKit clipboard/forced-colors cases.
- Verified the Dayfold opens, starts, pauses, resumes, reaches zero, restores all 24 segments on reset, and closes with keyboard focus retained. Clock-controlled testing checks elapsed-time behavior without a real minute-long wait.
- All six fictional applications exercised: mixer/quiet mode, Korean note editing, focus timer, forecast period, spending period and planning checkbox. Native edition disclosures support keyboard activation. Existing catalog/archive/growth/support journeys still pass.
- Both themes, 320px through desktop, landscape, 200% root text plus spacing overrides, touch, forced colors, no-JS reading/navigation, blocked fonts, denied storage and clipboard recovery covered. Axe scans report no tagged A/AA violations on six live and six representative mature routes, plus open instruments. This is not an accessibility certification.
- The decorative fold stops offscreen, when the document is hidden, or when reduced motion/global pause applies. Functional timer rendering uses an intersection/visibility subscription; the deadline is wall-clock based. No scroll ownership, animation library, canvas, WebGL, raster hero or new package dependency.
- Production preview/product/release/support fiction returns 404; current pages and sitemap exclude the synthetic catalog.

Visual review included both engines' desktop/mobile captures, Low light, Sori/Namu product pages, all opening publication spines and the Dayfold's open state. Review caught cramped enlarged-text timer buttons beyond the geometry assertions; container-aware spacing and stacked controls resolve that case. The old sunrise component was removed and remains recoverable in Git.

Local throttled Chromium observation: 390px/DPR1, cache disabled, 150ms latency, 750 kbit/s download, 4× CPU throttling. FCP and recorded LCP: **1,600ms**. Encoded JavaScript, including module-preloads: **132,638 bytes** (200,000-byte test ceiling). Subresource transfer: **225,143 bytes**, excluding HTML. No daylight image request. These are a single local run, not field Core Web Vitals or a real-device guarantee.

Limits: physical low-power devices, native VoiceOver/Narrator speech, real Korean IME composition and field performance remain unverified. Publication remains owner-private through Sites; custom-domain DNS/public launch are separate. The 2036 laboratory remains development-only, not a launch forecast.

---

# Historical verification — Publisher system, 2026-09-20 (America/Chicago)

Candidate: Software Sunrise / independent software-publisher redesign. Tested the compiled Cloudflare Worker at port 8791 and, separately, the development-only mature edition at port 5173. Earlier failed runs are diagnostic evidence, not passing evidence. The historical initial-site record is retained below.

## Final results

- Sites production build and TypeScript: passed. Authored TS/TSX ESLint: zero errors, two `no-img-element` recommendations for the vector press mark and record-driven product media. Intentional native images have explicit dimensions; real product media is lazy loaded. The one-time browser-preference hydration effect has a documented, narrowly scoped lint exception.
- Playwright 1.58.2, Chromium 145.0.7632.6 and WebKit 26.0: production **33 passed, 11 explicitly skipped**; development **38 passed, 6 explicitly skipped**. Zero unexpected failures or retries in these final runs. Counts include data tests in each browser project; they are not counts of unique user journeys.
- Production skips: eight development-only mature browser scenarios, WebKit clipboard permission automation, WebKit forced-colors emulation and WebKit CDP throttling. Development skips: two production-route gates, two production throttling cases, and WebKit clipboard/forced-colors cases.
- Current publisher journey: role and design/build/publish/maintain message, real in-memory study, clear/reset focus, contact, navigation, theme reload and route persistence. No captured page errors in the main journey.
- Mature journey: six synthetic editions; catalog → product → release → support; combined software and release filters; empty results; query-preserving pagination; linked product/release destinations. Growth fixtures cover 1/5/20 products and 240 releases, including archived/discontinued states.
- Axe WCAG A/AA-tagged scans: zero reported violations on six current routes and six representative mature routes, each in daylight/evening and both engines. This is not accessibility certification.
- Reflow: 390×844, 320×568, 844×390 and 768×1024; 200% root text plus line/letter/word/paragraph spacing stress. Mature catalog, archive, product, release and support pages also checked at 320px.
- Keyboard: skip link/main focus, native navigation, theme activation and visible focus, study entry/submission. WebKit uses macOS Option-Tab link navigation. Touch emulation: 390px/DPR2, tapping theme, Korean study input, submit and support navigation in both engines.
- Motion: computed running/stopped animation, pause/reload/resume, offscreen stop, reduced-motion precedence. Storage denial and image failure do not block the study or in-page manual theme override. Forced-colors focus/activation checked in Chromium.
- Clipboard: actual Chromium write/readback, denied write, truthful recovery and retry. No email was sent; mailto destination is checked, not the user's mail application.
- JavaScript disabled: essential reading, native navigation and contact remain usable in both engines.
- Production honesty gate: fictional preview/product/release/support routes return 404; current pages and sitemap contain none of the fictional product names or 2036 content. Robots excludes `/preview/`.
- Negative controls: injected overflow is detected by the geometry oracle; synthetic contamination, duplicated/orphaned records and future release dates are detected by content validation.

## Performance observation

One final local Chromium run used a 390px viewport, DPR1, disabled cache, 150ms network latency, 750 kbit/s download and 4× CPU throttling. First contentful paint and the recorded largest contentful paint were 1,800ms. Encoded JavaScript across script **and module-preload** resources totaled 132,335 bytes; measured subresource transfer totaled 372,992 bytes (not including the main HTML document). The browser selected the 640px WebP. The study remained functional. The test asserts a 200,000-byte encoded-JS ceiling.

These are single-run local observations, not Lighthouse scores, field Core Web Vitals, real-phone measurements or guarantees for every connection. Native document navigation removes the broken prefetch path and loads routes independently; browser caching can reuse static resources. The original JPEG remains the image fallback; responsive WebP files avoid sending it to capable browsers.

## Findings fixed

Preview route parameter mutation broke growth links after repeat rendering. It now derives a new path without mutating router input. Select labels now have explicit IDs and associations. Growth fixture dates remain before the fixture's as-of date. The duplicate homepage closing imprint was removed. Theme text/surface pairs switch together while artwork illumination and shadows transition, avoiding temporary contrast loss.

Most importantly, the pinned compiled Vinext client Link helper threw prefetch/navigation errors in production despite passing development journeys. Direct document loads were correct. Publisher links now use a shared native anchor wrapper; both complete browser suites were rerun. No runtime upgrade or unverified framework patch was introduced.

## Visual review and limits

Inspected rendered current daylight/evening/mobile, mature homepage, Sori/Namu detail, narrow mature pages and touch-study captures. Preserved the original terracotta sun, warm paper/forest palette and editorial fonts; reviewed software clarity, edition hierarchy, spacing and cross-page consistency. This is the author's visual review, not an independent aesthetic evaluation. Evidence is generated under ignored `work/`, not shipped as product screenshots or a deployment thumbnail.

Not tested: physical low-power devices, native VoiceOver/Narrator speech, IME composition on real Korean keyboards, real mail-app handling, browser extensions, field traffic/performance or all future product media. Privacy, downloads, localized pages and product-specific technical claims need review when genuine records are added. Custom-domain DNS and public launch remain separate from this owner-private deployment.

---

# Historical verification — 2026-09-19 (America/Chicago)

Candidate: the initial Harulo Studio Daylight implementation and its production Worker build. The source revision containing this record is the release candidate; deployment identifies its full Git revision separately. Browser evidence was captured against the local production Worker, not the development hot-reload server or a static mockup.

## Results

- Production build: passed. TypeScript (`tsc --noEmit`): passed.
- ESLint on authored TS/TSX: zero errors; one `no-img-element` recommendation. The intentional, locally compressed JPEG has explicit dimensions and high fetch priority. No image optimization service is required.
- Playwright 1.58.2: **18 passed, 2 explicitly skipped**, Chromium 145.0.7632.6 and WebKit 26.0.
- Automated axe-core checks: no reported WCAG A/AA-tagged violations in either theme in either browser. This is not a conformance certification.
- Read/navigate/contact/return flows and theme persistence pass in both engines, with no captured page errors in the main journey.
- Layout: 390×844, 320×568, 844×390 and 768×1024; plus 200% root text at 390px and combined line-height/letter/word/paragraph spacing overrides. Document overflow and component bounds checked. Native contact remains reachable by scrolling when enlarged content exceeds a viewport.
- Keyboard: visible skip link, main focus, theme activation and focus outline. WebKit uses macOS Option-Tab link navigation. Native screen-reader speech and physical keyboard settings are not simulated by this test.
- Motion: computed animation names verified, pause/resume/reload verified, device reduced motion takes precedence in both engines.
- Clipboard: actual successful copy/readback, rejection, truthful recovery text and retry verified in Chromium. WebKit clipboard permission automation is explicitly skipped, not claimed.
- Forced-colors: control focus/activation and geometry verified in Chromium; WebKit emulation explicitly skipped.
- Storage denied, artwork load failure, and JavaScript-disabled reading/contact verified in both engines.
- Negative control: an intentionally 2000px-wide button caused the geometry assertion to fail; removal restored a passing result. This demonstrates the test can detect the overflow failure it claims to cover.

## Findings addressed

Combined enlarged text and custom text spacing exposed automatic minimum-width overflow. Grid/flex children now shrink, header navigation wraps, and long words wrap without a global overflow-hiding workaround. Optional client controls remain hidden until interactive. All applicable scenarios were rerun against the production candidate after these changes.

Initial development runs also had an incorrect loopback host and test configuration issues; those runs are not passing evidence. The final suite uses the production preview with explicit reduced-motion context settings and matched Playwright type dependencies.

## Visual review and limits

The author inspected full-page daylight, evening and mobile captures: consistent paper/forest/terracotta tokens, serif hierarchy, tactile artwork, spacing and section continuity. This is an author review, not an independent aesthetic evaluation. Screenshots and traces are in ignored `work/`; they are not deployment thumbnails or social-card assets.

Not yet verified: real phones, native assistive technology, browser extensions, field performance/Core Web Vitals, a user's configured email application, or arbitrary font/browser/locale combinations outside this English/Korean content. Mailto target correctness is verified; no message was sent. Custom-domain DNS and public audience configuration are not part of this private review deployment.
