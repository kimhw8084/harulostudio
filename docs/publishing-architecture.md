# Publishing architecture

`lib/publishing/catalog.ts` is the verified production source of truth. It is
currently intentionally empty.

`lib/publishing/showcase.ts` contains exactly five interactive concept
publications. Its `provenance: "showcase"` label is a safety boundary: these
records may appear on `/software` and unindexed concept detail pages, but they
must not enter production JSON-LD, the sitemap, release history, support
archives or download links.

Future verified products can use the existing typed `Product`, `Release`,
`SupportArticle` and `PrivacyNotice` structures without redesigning the site.
