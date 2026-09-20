import { demoCatalog } from "@/lib/publishing/fixtures";
import type {
  Product,
  PublisherCatalog,
  SupportArticle,
} from "@/lib/publishing/types";

// Imported only after the route's development gate. Nothing here describes a real release.
const topics = [
  [
    "installation",
    "Installation",
    "getting-started",
    "Choose your platform",
    "This demonstration would guide you through a signed installer and permission review. No installer exists for this fictional product.",
  ],
  [
    "troubleshooting",
    "Troubleshooting",
    "troubleshooting",
    "Begin with a reversible check",
    "Note the version, reproduce the issue and collect only the details you choose to share. This is a sample support workflow, not verified troubleshooting advice.",
  ],
  [
    "keyboard-shortcuts",
    "Keyboard shortcuts",
    "reference",
    "A place for every action",
    "Example shortcuts: Command/Control K opens quick actions; Escape closes a panel. These are proposed interface conventions for the fictional product.",
  ],
  [
    "account-sync",
    "Account & sync",
    "reference",
    "A clear synchronization state",
    "A future guide could show offline changes, synchronization conflicts and account recovery. This preview does not create accounts or transmit entered demo content.",
  ],
  [
    "export",
    "Export your work",
    "reference",
    "A usable way out",
    "A representative export guide would document formats, included fields and a recovery check. No export service or product download is provided by this study.",
  ],
  [
    "accessibility",
    "Accessibility",
    "accessibility",
    "More than one way to work",
    "The interface study supports keyboard operation and visible focus. Product-level assistive technology compatibility would need verification before publication.",
  ],
  [
    "known-issues",
    "Known issues",
    "troubleshooting",
    "Sample issue register",
    "Example: a device changing while a profile is open could require refreshing the device list. This is fictional issue content used to test the publisher layout.",
  ],
] as const;
const products: Product[] = demoCatalog.products.map((p) => ({
  ...p,
  privacy: {
    updatedAt: "2036-09-01",
    summary: `Fictional ${p.name} privacy example. This is not a policy for a released application.`,
    collected: [
      "Example: account email only if a future sync service requires an account.",
      "Example: diagnostics only when explicitly included in a support request.",
    ],
    notCollected: [
      "This design study has no product service and collects no product usage data.",
    ],
    retention:
      "A real policy must specify verified retention periods for each data category. No retention promise is made by this example.",
    deletion:
      "A real product would document a tested deletion process and any applicable exceptions.",
    services: [
      {
        name: "No live service",
        purpose: "Placeholder for a verified service inventory.",
      },
    ],
    history: [
      {
        date: "2036-09-01",
        change: "Synthetic policy structure created for identity review.",
      },
    ],
  },
}));
export const labCatalog: PublisherCatalog = {
  ...demoCatalog,
  products,
  releases: demoCatalog.releases.map((r, i) =>
    i === 0
      ? {
          ...r,
          securityNotes: [
            "Fictional security example: tightened validation of imported device profiles. No real vulnerability is being reported.",
          ],
          compatibility: [
            "Example compatibility note: refreshed the proposed Windows audio-session integration.",
          ],
          knownIssues: [
            "Design fixture: a disconnected device can remain in the sample recent-device list.",
          ],
        }
      : r,
  ),
  supportArticles: [
    ...demoCatalog.supportArticles,
    ...products.flatMap((p) =>
      topics.map(
        ([slug, title, category, heading, paragraph]): SupportArticle => ({
          id: `${p.id}-${slug}`,
          productId: p.id,
          slug,
          title: `${p.name}: ${title}`,
          category,
          updatedAt: "2036-09-01",
          provenance: "synthetic",
          sections: [
            { heading, paragraphs: [paragraph] },
            {
              heading: "About this example",
              paragraphs: [
                "Fictional documentation for the Harulo identity laboratory. Do not rely on it as product instructions.",
              ],
            },
          ],
        }),
      ),
    ),
  ],
  pressItems: [
    ...demoCatalog.pressItems,
    {
      id: "namu-3",
      slug: "namu-3",
      title: "Namu 3 — room for connected thinking",
      publishedAt: "2035-10-04",
      provenance: "synthetic",
      productId: "namu",
      summary: "A major-version announcement study.",
      paragraphs: [
        "Fictional editorial sample: the next edition of Namu introduces a calmer way to follow connected ideas.",
      ],
      assets: [],
    },
    {
      id: "decade",
      slug: "decade",
      title: "Ten years of a little better",
      publishedAt: "2036-09-20",
      provenance: "synthetic",
      summary: "A publisher milestone study, not a factual company history.",
      paragraphs: [
        "This fictional future reflection tests the publisher’s voice at maturity. The permanent identity remains undecided.",
      ],
      assets: [],
    },
    {
      id: "morrow-preview",
      slug: "morrow-preview",
      title: "Introducing Morrow in public preview",
      publishedAt: "2036-09-04",
      provenance: "synthetic",
      productId: "morrow",
      summary: "A preview-launch announcement study.",
      paragraphs: [
        "A fictional planning tool for thinking about tomorrow without overplanning today.",
      ],
      assets: [],
    },
  ],
};
export const archiveCatalog: PublisherCatalog = {
  ...labCatalog,
  products: [
    ...products,
    {
      ...products[0],
      id: "sori-classic",
      slug: "sori-classic",
      name: "Sori Classic",
      edition: "A1",
      status: "archived",
      version: "1.9.0",
      archiveReason:
        "Fictional archive example: superseded by the current Sori edition.",
    },
    {
      ...products[1],
      id: "namu-pocket",
      slug: "namu-pocket",
      name: "Namu Pocket",
      edition: "A2",
      status: "discontinued",
      version: "1.2.0",
      archiveReason:
        "Fictional discontinuation example: the standalone edition has reached the end of its support period.",
    },
  ],
};
