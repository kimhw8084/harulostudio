# Verification — 2026-09-19 (America/Chicago)

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
