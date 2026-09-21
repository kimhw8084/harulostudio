import type {
  Product,
  PublisherCatalog,
  Release,
  SupportArticle,
} from "./types";
import { buildUniverse } from "./universe";

// FICTIONAL DESIGN DATA. Imported only by the development preview and tests.
const common: Pick<
  Product,
  | "provenance"
  | "visibility"
  | "publisher"
  | "downloads"
  | "media"
  | "resources"
  | "requirements"
  | "accessibility"
  | "languages"
> = {
  provenance: "synthetic",
  visibility: "public",
  publisher: "Harulo Studio",
  downloads: [],
  media: [],
  resources: {},
  requirements: [],
  accessibility: [],
  languages: ["English", "Korean"],
};
const feature = (title: string, description: string) => ({
  title,
  description,
});
export const demoProducts: Product[] = [
  {
    ...common,
    id: "sori",
    slug: "sori",
    name: "Sori",
    koreanName: "소리",
    edition: "01",
    category: "Audio / Utility",
    status: "published",
    version: "4.8.2",
    firstReleasedAt: "2027-03-14",
    latestReleasedAt: "2036-08-29",
    platforms: ["macOS", "Windows"],
    icon: "sound",
    tone: "clay",
    channels: ["stable"],
    tagline: "A little more control. A little less noise.",
    description:
      "A small, thoughtful audio utility for controlling the sounds around your work. App-specific volume, device switching and temporary focus profiles, in one clear place.",
    features: [
      feature(
        "Every app, its own volume.",
        "Keep music, calls and browser audio at the levels that work for you.",
      ),
      feature(
        "Switch without the search.",
        "Move between speakers and headphones from one clear control.",
      ),
      feature(
        "A moment of quiet.",
        "Temporary sound profiles make room for the task in front of you.",
      ),
      feature(
        "Close at hand.",
        "Keyboard control and clearly labelled actions keep audio within reach.",
      ),
    ],
    requirements: [
      {
        platform: "macOS",
        description: "Example requirement: macOS 14 or later",
      },
      { platform: "Windows", description: "Example requirement: Windows 11" },
    ],
    accessibility: ["Keyboard control", "VoiceOver and Narrator labels"],
  },
  {
    ...common,
    id: "namu",
    slug: "namu",
    name: "Namu",
    koreanName: "나무",
    edition: "02",
    category: "Notes / Knowledge",
    status: "published",
    version: "3.4.0",
    firstReleasedAt: "2028-09-08",
    latestReleasedAt: "2036-07-11",
    platforms: ["macOS", "Windows", "iOS", "Android"],
    icon: "notes",
    tone: "olive",
    channels: ["stable"],
    tagline: "Notes that grow naturally.",
    description:
      "A calm place for thoughts, references, daily notes and connected ideas, without another complicated system to maintain.",
    features: [
      feature(
        "Catch the thought.",
        "Quick capture leaves room for an idea before it disappears.",
      ),
      feature(
        "Connections, gently.",
        "Backlinks and lightweight collections let relationships emerge.",
      ),
      feature(
        "Your notes, with you.",
        "Offline-first storage and sync support a day on the move.",
      ),
      feature(
        "A way out, always.",
        "Markdown export keeps your writing portable.",
      ),
    ],
    accessibility: ["Scalable reading text", "Keyboard navigation"],
  },
  {
    ...common,
    id: "goyo",
    slug: "goyo",
    name: "Goyo",
    koreanName: "고요",
    edition: "03",
    category: "Focus / Productivity",
    status: "maintained",
    version: "2.6.1",
    firstReleasedAt: "2030-01-21",
    latestReleasedAt: "2036-08-18",
    platforms: ["macOS", "Windows", "iOS"],
    icon: "focus",
    tone: "forest",
    channels: ["stable"],
    tagline: "A calmer place for your attention.",
    description:
      "Decide what deserves your attention, make a little space for it, and reflect when you’re finished.",
    features: [
      feature(
        "A daily intention.",
        "Begin with a small decision about what matters.",
      ),
      feature(
        "Room to focus.",
        "Focus sessions and application boundaries reduce interruptions.",
      ),
      feature(
        "A quiet finish.",
        "End with a reflection instead of a score to beat.",
      ),
      feature(
        "Simple by choice.",
        "Minimal statistics keep attention on your work.",
      ),
    ],
  },
  {
    ...common,
    id: "haru-weather",
    slug: "haru-weather",
    name: "Haru Weather",
    edition: "04",
    category: "Weather / Daily utility",
    status: "published",
    version: "5.1.0",
    firstReleasedAt: "2031-04-03",
    latestReleasedAt: "2036-08-04",
    platforms: ["iOS", "Android", "Web"],
    icon: "weather",
    tone: "sky",
    channels: ["stable"],
    tagline: "For the day you’re actually about to have.",
    description:
      "A day-first forecast, from the journey out to the way home. Weather information with everyday decisions in mind.",
    features: [
      feature(
        "Your day, in view.",
        "Commute windows and a rain timeline put the useful details first.",
      ),
      feature(
        "A little preparation.",
        "Clothing guidance and air quality help you plan the day.",
      ),
      feature(
        "Light to light.",
        "Sunrise and sunset provide a rhythm for time outside.",
      ),
      feature(
        "Places that matter.",
        "Keep the locations you return to close at hand.",
      ),
    ],
  },
  {
    ...common,
    id: "dami",
    slug: "dami",
    name: "Dami",
    edition: "05",
    category: "Personal finance / Planning",
    status: "published",
    version: "1.9.3",
    firstReleasedAt: "2033-10-19",
    latestReleasedAt: "2036-07-24",
    platforms: ["Web", "iOS", "Android"],
    icon: "spending",
    tone: "ochre",
    channels: ["stable"],
    tagline: "A clearer picture of everyday spending.",
    description:
      "Understand spending patterns, notice recurring payments and make room for a monthly reflection. No unrealistic financial promises.",
    features: [
      feature(
        "See the pattern.",
        "Spending summaries bring everyday activity together.",
      ),
      feature(
        "Notice what repeats.",
        "Recurring-payment awareness makes regular costs easier to see.",
      ),
      feature(
        "Find your rhythm.",
        "Budget rhythms offer a way to reflect on plans and reality.",
      ),
      feature(
        "Keep control.",
        "Export and privacy controls support your own way of working.",
      ),
    ],
  },
  {
    ...common,
    id: "morrow",
    slug: "morrow",
    name: "Morrow",
    edition: "06",
    category: "Planning",
    status: "preview",
    version: "0.9.0-preview.6",
    firstReleasedAt: "2036-08-30",
    latestReleasedAt: "2036-09-02",
    expectedRelease: "2037",
    platforms: ["macOS", "Web"],
    icon: "planning",
    tone: "plum",
    channels: ["preview"],
    tagline: "Think about tomorrow. Leave room for today.",
    description:
      "A lightweight place to plan what comes next without turning every moment into a task.",
    features: [
      feature(
        "A loose plan.",
        "Make space for a few intentions instead of filling every hour.",
      ),
      feature(
        "Carry things gently.",
        "Move unfinished thoughts forward without a growing backlog.",
      ),
      feature(
        "Built in the open.",
        "A public preview for learning what helps, and what gets in the way.",
      ),
    ],
  },
];

const release = (
  product: Product,
  version: string,
  date: string,
  title: string,
  kind: Release["kind"],
  improvements: string[],
  fixes: string[] = [],
  previousVersion?: string,
): Release => ({
  id: `${product.id}-${version}`,
  productId: product.id,
  version,
  publishedAt: date,
  title,
  kind,
  provenance: "synthetic",
  summary: `${title} for ${product.name}.`,
  channel: kind === "preview" ? "preview" : "stable",
  platforms: product.platforms,
  improvements,
  fixes,
  securityNotes: [],
  compatibility: [],
  knownIssues: [],
  downloads: [],
  previousVersion,
});
const sori = demoProducts[0],
  namu = demoProducts[1];
const latest: Release[] = [
  release(
    sori,
    "4.8.2",
    "2036-08-29",
    "Small refinements. A smoother listening day.",
    "maintenance",
    [
      "Improved Bluetooth device switching",
      "Added per-app remembered volume states",
      "Reduced startup time",
    ],
    [
      "Improved Windows audio-session recovery",
      "Updated VoiceOver and Narrator labels",
    ],
    "4.8.0",
  ),
  release(
    sori,
    "4.8.0",
    "2036-06-18",
    "Your sound, remembered.",
    "feature",
    ["Remembered sound profiles for familiar devices"],
    ["More consistent keyboard focus"],
    "1.0.0",
  ),
  release(
    namu,
    "3.4.0",
    "2036-07-11",
    "A new way to see how your thoughts grow.",
    "feature",
    ["New timeline view", "New export controls", "Improved Korean typography"],
    ["Improved offline conflict resolution", "Faster search indexing"],
    "1.0.0",
  ),
  ...demoProducts
    .slice(2)
    .map((p) =>
      release(
        p,
        p.version!,
        p.latestReleasedAt!,
        p.id === "morrow"
          ? "A little room for tomorrow."
          : "Everyday details, a little better.",
        p.status === "preview" ? "preview" : "maintenance",
        [p.features[0].title],
        ["Refined everyday interaction details"],
        p.status === "preview" ? undefined : "1.0.0",
      ),
    ),
];
const first = demoProducts
  .filter((p) => p.id !== "morrow")
  .map((p) =>
    release(p, "1.0.0", p.firstReleasedAt!, `Introducing ${p.name}.`, "major", [
      p.tagline,
    ]),
  );
const articles: SupportArticle[] = demoProducts.map((p) => ({
  id: `${p.id}-getting-started`,
  productId: p.id,
  slug: "getting-started",
  title: `Getting started with ${p.name}`,
  category: "getting-started",
  updatedAt: p.latestReleasedAt!,
  provenance: "synthetic",
  sections: [
    {
      heading: "Before you begin",
      paragraphs: [
        `This fictional support article demonstrates the structure for ${p.name}. There is no application to download or install.`,
        `The proposed platforms are ${p.platforms.join(", ")}. Verified installation and compatibility instructions will replace this content for a real product.`,
      ],
    },
    {
      heading: "Your first small step",
      paragraphs: [p.features[0].description],
    },
    {
      heading: "Need a hand?",
      paragraphs: [
        "A real support article would include tested steps, relevant version information and clear recovery instructions. Contact the studio with questions about this design study.",
      ],
    },
  ],
}));
export const legacyDemoCatalog: PublisherCatalog = {
  edition: "demo",
  asOf: "2036-09-20",
  products: demoProducts,
  releases: [...latest, ...first],
  supportArticles: articles,
  pressItems: [
    {
      id: "sori-48",
      slug: "sori-48",
      title: "Sori 4.8 — a quieter kind of control",
      publishedAt: "2036-08-29",
      provenance: "synthetic",
      productId: "sori",
      summary:
        "A fictional publication announcement used to exercise the press record model.",
      paragraphs: [
        "This is synthetic editorial material, not an actual announcement.",
      ],
      assets: [],
    },
  ],
};

export const demoCatalog = buildUniverse(legacyDemoCatalog);

/** Growth fixture, never imported by a production content adapter. */
export function makeGrowthCatalog(
  productCount: number,
  releaseCount = 240,
): PublisherCatalog {
  const products = Array.from({ length: productCount }, (_, i) => ({
    ...demoProducts[i % demoProducts.length],
    id: `edition-${i + 1}`,
    slug: `edition-${i + 1}`,
    name: `Edition ${i + 1}`,
    edition: String(i + 1).padStart(2, "0"),
    status: (i % 9 === 8
      ? "archived"
      : i % 7 === 6
        ? "discontinued"
        : demoProducts[i % demoProducts.length].status) as Product["status"],
  }));
  const releases = Array.from({ length: releaseCount }, (_, i) =>
    release(
      products[i % products.length],
      `1.${Math.floor(i / products.length)}.${i}`,
      `203${i % 7}-${String((i % 8) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      "A considered improvement.",
      i % 5 === 0 ? "major" : "maintenance",
      ["A synthetic growth-test release."],
    ),
  );
  return {
    edition: "demo",
    asOf: "2036-09-20",
    products,
    releases,
    supportArticles: [],
    pressItems: [],
  };
}
