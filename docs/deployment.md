# Deployment verification

The site builds with Vinext for the existing Cloudflare Worker adapter. This
branch does not deploy or modify DNS. Production deployment should be gated on
the GitHub Actions workflow in `.github/workflows/ci.yml` and performed through
the already configured hosting integration.

Local production evidence uses:

```bash
npm run build
HARULO_TEST_URL=http://127.0.0.1:8788 npm run test:ui
```

The browser suite must target the compiled Worker, not `vinext dev`. Confirm
the response headers and generated assets with `tests/metadata.spec.ts` before
publishing. The current CSP intentionally allows inline theme/RSC bootstrap
code emitted by the framework; tighten it with framework-supported nonces or
hashes before claiming a stricter policy.
