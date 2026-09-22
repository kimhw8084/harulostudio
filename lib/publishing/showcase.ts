import type { Product, PublisherCatalog, ShowcaseProduct } from "./types";

const shared = {
  provenance: "showcase" as const,
  visibility: "public" as const,
  publisher: "Harulo Studio",
  downloads: [],
  media: [],
  resources: {},
  requirements: [],
  accessibility: ["Keyboard accessible controls", "Visible focus states"],
  languages: ["English"],
  channels: [],
  status: "preview" as const,
};

function product(
  fields: Pick<
    Product,
    | "id"
    | "slug"
    | "name"
    | "koreanName"
    | "edition"
    | "category"
    | "platforms"
    | "icon"
    | "tone"
    | "tagline"
    | "description"
    | "features"
  >,
): ShowcaseProduct {
  return { ...shared, ...fields };
}

export const showcaseProducts: ShowcaseProduct[] = [
  product({
    id: "sori",
    slug: "sori",
    name: "Sori",
    koreanName: "소리",
    edition: "01",
    category: "Audio utility",
    platforms: ["macOS", "Windows"],
    icon: "sound",
    tone: "clay",
    tagline: "A little more control. A little less noise.",
    description:
      "A thoughtful per-application mixer and output switcher for the sounds around your work.",
    features: [
      { title: "Per-app volume", description: "Give each sound its own place." },
      { title: "Output, clearly", description: "Switch devices without searching." },
      { title: "Quiet mode", description: "Make room for the task in front of you." },
    ],
  }),
  product({
    id: "namu",
    slug: "namu",
    name: "Namu",
    koreanName: "나무",
    edition: "02",
    category: "Notes / knowledge",
    platforms: ["macOS", "Windows", "iOS", "Android"],
    icon: "notes",
    tone: "olive",
    tagline: "Notes that grow naturally.",
    description:
      "A calm place for daily notes, references and connected ideas without another system to maintain.",
    features: [
      { title: "Quick capture", description: "Catch the thought before it disappears." },
      { title: "Gentle connections", description: "Let relationships emerge between notes." },
      { title: "A way out", description: "Keep writing portable with simple export." },
    ],
  }),
  product({
    id: "goyo",
    slug: "goyo",
    name: "Goyo",
    koreanName: "고요",
    edition: "03",
    category: "Focus",
    platforms: ["macOS", "Windows", "iOS"],
    icon: "focus",
    tone: "forest",
    tagline: "A calmer place for your attention.",
    description:
      "An intentional focus session with room for a beginning, a pause and a quiet finish.",
    features: [
      { title: "One intention", description: "Begin with a small decision about what matters." },
      { title: "Make space", description: "Quiet the interruptions around the work." },
      { title: "Reflect gently", description: "Finish without a score to beat." },
    ],
  }),
  product({
    id: "haru-weather",
    slug: "haru-weather",
    name: "Haru Weather",
    edition: "04",
    category: "Daily utility",
    platforms: ["iOS", "Android", "Web"],
    icon: "weather",
    tone: "sky",
    tagline: "For the day you are actually about to have.",
    description:
      "A day-first forecast that puts commute windows, rain timing and saved places in view.",
    features: [
      { title: "Your day, in view", description: "Start with the hours that matter." },
      { title: "Rain, in time", description: "See when weather might change your plans." },
      { title: "Places that matter", description: "Keep familiar locations close at hand." },
    ],
  }),
  product({
    id: "dami",
    slug: "dami",
    name: "Dami",
    koreanName: "다미",
    edition: "05",
    category: "Planning / finance",
    platforms: ["Web", "iOS", "Android"],
    icon: "spending",
    tone: "ochre",
    tagline: "A clearer picture of everyday spending.",
    description:
      "A calm planning surface for recurring items, categories and monthly reflection. No promises, just a clearer view.",
    features: [
      { title: "See the pattern", description: "Bring everyday activity together." },
      { title: "Notice what repeats", description: "Make recurring items easier to see." },
      { title: "Keep control", description: "Work locally with clear boundaries." },
    ],
  }),
];

export const showcaseCatalog: PublisherCatalog = {
  edition: "showcase",
  asOf: "2026-09-21",
  products: showcaseProducts,
  releases: [],
  supportArticles: [],
  pressItems: [],
};
