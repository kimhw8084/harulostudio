import type {
  Product,
  PublisherCatalog,
  Release,
  SupportArticle,
  CompanyMilestone,
} from "./types";

// This adapter is imported only by fixtures behind the development route gate.
// Editorial seeds, not randomized records: every product has its own evolution.
interface Narrative {
  object: string;
  workspace: string;
  format: string;
  steps: string[];
  changes: string[];
  issue: string;
  recovery: string;
}
const narratives: Record<string, Narrative> = {
  sori: {
    object: "sound profile",
    workspace: "Devices",
    format: "JSON profile",
    steps: [
      "Choose an output in Devices.",
      "Set an app’s volume independently.",
      "Save the combination as a temporary profile.",
    ],
    changes: [
      "Per-app volume replaces a single system slider",
      "Profiles remember the last connected output",
      "Keyboard device switching arrives",
      "Bluetooth reconnection preserves app levels",
      "Windows sessions join the macOS mixer",
      "Quiet mode gains an explicit expiry",
      "Device names can be edited without losing history",
      "Profile export makes a second computer easier to set up",
      "Screen readers announce the selected output",
      "The mixer survives a sleeping audio service",
      "Headset controls stop taking focus from calls",
      "A new device rail replaces nested menus",
      "Audio-session recovery moves off the main thread",
      "Private output identifiers are removed from diagnostics",
      "Remembered volume states settle after reconnecting",
    ],
    issue:
      "An output can disappear while a Bluetooth headset changes profiles.",
    recovery:
      "Choose the system output, reconnect the headset, then select it again. Saved volume levels are retained.",
  },
  namu: {
    object: "notebook",
    workspace: "Library",
    format: "Markdown folder",
    steps: [
      "Create a notebook in Library.",
      "Capture a note using the quick-entry field.",
      "Link two notes by title; collections remain optional.",
    ],
    changes: [
      "Daily notes start with a blank page",
      "Backlinks connect thoughts without folders",
      "Quick capture works outside the main window",
      "Markdown import preserves original filenames",
      "Offline search indexes Korean word boundaries",
      "Windows notebooks share a portable archive",
      "Mobile capture joins the daily page",
      "Sync keeps both copies of an edited paragraph",
      "Private spaces gain separate encryption keys",
      "Export includes attachments and link maps",
      "Screen-reader headings follow the note outline",
      "A reading column replaces the three-pane default",
      "Search indexing yields while a note is being edited",
      "Deleted attachments leave sync storage after the retention window",
      "Timeline view connects daily notes across months",
    ],
    issue: "Two offline devices can edit the same paragraph.",
    recovery:
      "Open the conflict copy, compare both paragraphs, and keep or merge them. Export a backup before deleting either copy.",
  },
  goyo: {
    object: "focus session",
    workspace: "Today",
    format: "CSV session log",
    steps: [
      "Write one intention in Today.",
      "Choose a session length and optional quiet boundary.",
      "End with a short reflection; there is no score to maintain.",
    ],
    changes: [
      "A single intention anchors each session",
      "Session length becomes adjustable",
      "Pause retains the original intention",
      "Application boundaries can expire automatically",
      "Windows notification rules become explicit",
      "Session reflections work offline",
      "An iOS companion preserves active sessions",
      "Keyboard shortcuts avoid common system bindings",
      "Large text keeps the timer readable",
      "CSV export includes interrupted sessions",
      "Quiet boundaries recover after sleep",
      "A simpler daily view replaces streak counts",
      "Session state resolves across device time changes",
      "Diagnostics redact intention text",
      "Maintenance release improves boundary recovery",
    ],
    issue:
      "System notification permissions may be revoked after an operating-system upgrade.",
    recovery:
      "Review notification permissions in system settings, then re-enable only the boundaries you want. Your sessions do not need to be recreated.",
  },
  "haru-weather": {
    object: "saved place",
    workspace: "Places",
    format: "JSON places",
    steps: [
      "Add a place by name; location access is optional.",
      "Set an outward and return commute window.",
      "Read the rain timeline before enabling alerts.",
    ],
    changes: [
      "A day-first forecast replaces hourly tables",
      "Commute windows highlight relevant hours",
      "Rain timing gains uncertainty labels",
      "Saved places work without precise location",
      "Android widgets follow the selected place",
      "Air-quality sources are shown alongside readings",
      "Text summaries complement the weather chart",
      "Forecast timestamps become prominent",
      "Offline views show the age of cached data",
      "Place export avoids coordinate histories",
      "Screen readers can traverse the rain timeline",
      "Web forecasts share the mobile day view",
      "Provider failover preserves stale-data warnings",
      "Location diagnostics become coarse by default",
      "Longer commute windows arrive with clearer alerts",
    ],
    issue:
      "A forecast can be older than expected when a provider is unavailable.",
    recovery:
      "Check the updated-at label and refresh after reconnecting. Do not treat a cached forecast as a severe-weather alert service.",
  },
  dami: {
    object: "spending ledger",
    workspace: "Month",
    format: "CSV ledger",
    steps: [
      "Create a month in your ledger.",
      "Import a statement or enter a transaction manually.",
      "Review recurring payments before assigning categories.",
    ],
    changes: [
      "Manual transactions establish the first ledger",
      "CSV import previews rows before saving",
      "Recurring payments gain separate review",
      "Categories can be renamed without rewriting history",
      "Mobile entry supports decimal keyboards",
      "Refunds remain linked to original transactions",
      "Month boundaries respect local dates",
      "Import detects duplicate statement rows",
      "Screen-reader summaries explain chart totals",
      "Exports retain original currency and amount",
      "Archived months remain editable",
      "A review-led layout replaces budget scoring",
      "Large statements parse without blocking input",
      "Diagnostics exclude transaction descriptions",
      "Recurring-payment matching becomes more predictable",
    ],
    issue: "A bank may change its exported column names between statements.",
    recovery:
      "Map date, description and amount in the import preview. Check the first and last rows before committing; cancel leaves the ledger unchanged.",
  },
  morrow: {
    object: "tomorrow list",
    workspace: "Next",
    format: "Markdown plan",
    steps: [
      "Write a possibility in Next.",
      "Move only what matters into Tomorrow.",
      "Leave the remainder unassigned instead of scheduling every hour.",
    ],
    changes: [
      "Private builds test a small tomorrow list",
      "Keyboard capture joins the preview",
      "Unscheduled ideas gain a separate place",
      "Notes stay beside the intention",
      "A web preview shares the planning model",
      "Moving an item preserves its original date",
      "Undo protects accidental completion",
      "Export includes unassigned ideas",
      "Screen-reader announcements identify moved items",
      "Offline drafts survive a reload",
      "Daily reset becomes an explicit action",
      "The preview removes automatic scoring",
      "Large lists stop blocking quick capture",
      "Preview diagnostics become opt-in",
      "Preview six refines the handoff into tomorrow",
    ],
    issue:
      "Preview storage formats may change before the first stable release.",
    recovery:
      "Export your plan before updating. Keep the previous export until you have checked the new build. Do not use a preview as your only copy.",
  },
};
const additions: Array<
  Partial<Product> &
    Pick<Product, "id" | "name" | "tagline" | "description" | "specimen"> & {
      narrative: Narrative;
    }
> = [
  {
    id: "jari",
    name: "Jari",
    koreanName: "자리",
    tagline: "A place for the things you copy.",
    description:
      "A local clipboard shelf for small pieces of work, with explicit expiry and sensitive-app exclusions.",
    category: "Desktop / Utility",
    firstReleasedAt: "2029-02-12",
    latestReleasedAt: "2036-05-15",
    version: "3.2.1",
    status: "maintenance",
    icon: "notes",
    tone: "olive",
    platforms: ["macOS", "Windows"],
    specimen: "clipboard",
    narrative: {
      object: "clipboard shelf",
      workspace: "Shelf",
      format: "plain-text archive",
      steps: [
        "Copy a short piece of text.",
        "Pin it to a shelf or leave it to expire.",
        "Exclude password managers before enabling history.",
      ],
      changes: [
        "A local shelf retains copied text",
        "Pinned items outlive temporary history",
        "Sensitive applications can be excluded",
        "Keyboard paste opens a compact chooser",
        "Windows clipboard support arrives",
        "Expiry becomes visible on each item",
        "Search handles multiline snippets",
        "Plain-text export preserves pinned items",
        "Narrator labels identify item age",
        "Sleep recovery clears expired entries",
        "Image previews become optional",
        "The shelf moves to a single-column layout",
        "Large clipboard payloads are rejected safely",
        "Diagnostic reports omit clipboard contents",
        "Security-only maintenance begins",
      ],
      issue: "Clipboard permissions can be reset by system upgrades.",
      recovery:
        "Review clipboard access, then copy a new non-sensitive item to test. Expired history cannot be recovered.",
    },
  },
  {
    id: "yeon",
    name: "Yeon",
    koreanName: "연",
    tagline: "A small bridge between your devices.",
    description:
      "A local-network file handoff with explicit receiving approval and verifiable transfer receipts.",
    category: "Files / Transfer",
    firstReleasedAt: "2032-04-18",
    latestReleasedAt: "2036-06-02",
    version: "2.3.0",
    status: "published",
    icon: "planning",
    tone: "sky",
    platforms: ["macOS", "Windows", "Android"],
    specimen: "transfer",
    narrative: {
      object: "transfer",
      workspace: "Nearby",
      format: "JSON receipt",
      steps: [
        "Connect both devices to a trusted network.",
        "Choose a receiving device and review its pairing code.",
        "Approve the file list on the receiving device.",
      ],
      changes: [
        "Explicit pairing starts a local transfer",
        "Receivers approve filenames before sending",
        "Interrupted transfers can resume",
        "Folder structure survives the handoff",
        "Android joins nearby discovery",
        "Transfer receipts include checksums",
        "Receiving folders become configurable",
        "Receipts can be exported for verification",
        "Keyboard pairing avoids timed dialogs",
        "Network changes preserve pending transfers",
        "Duplicate filenames require a decision",
        "A shared progress rail replaces two dialogs",
        "Large transfers yield bandwidth to active calls",
        "Pairing codes expire after one use",
        "Compatibility update improves discovery",
      ],
      issue:
        "Guest networks often prevent devices from discovering each other.",
      recovery:
        "Use a trusted network that permits local connections. Do not disable a firewall globally; review the application’s specific local-network permission.",
    },
  },
  {
    id: "gyeol",
    name: "Gyeol",
    koreanName: "결",
    tagline: "See what changed. Keep what matters.",
    description:
      "A local structured-data comparison tool for JSON and configuration files, with readable changes and deterministic exports.",
    category: "Developer / Local tools",
    firstReleasedAt: "2034-03-06",
    latestReleasedAt: "2036-08-12",
    version: "2.1.0",
    status: "published",
    icon: "spending",
    tone: "forest",
    platforms: ["macOS", "Windows", "Web"],
    specimen: "diff",
    narrative: {
      object: "comparison",
      workspace: "Compare",
      format: "JSON patch",
      steps: [
        "Paste or open the earlier document.",
        "Load the newer document in the second pane.",
        "Review changes before exporting a patch.",
      ],
      changes: [
        "Structured comparison ignores object-key order",
        "Arrays gain explicit comparison rules",
        "Invalid JSON shows a source location",
        "Keyboard navigation visits changed values",
        "A local web edition joins desktop",
        "Ignored paths become named presets",
        "Large integers retain original precision",
        "Patch export follows deterministic ordering",
        "Screen readers announce added and removed values",
        "File watching waits for atomic saves",
        "Redaction hides selected secrets before copying",
        "The comparison gains a shared outline",
        "Large documents parse outside the UI thread",
        "Clipboard export omits redacted values",
        "Compatibility release refines nested arrays",
      ],
      issue:
        "Array order may be meaningful in one file and irrelevant in another.",
      recovery:
        "Choose positional or key-based matching before comparing. Review the rule label before applying an exported patch.",
    },
  },
  {
    id: "moa",
    name: "Moa",
    koreanName: "모아",
    tagline: "The first place for a passing thought.",
    description:
      "Harulo’s early quick-capture utility, preserved with its final export guide after its ideas moved into Namu.",
    category: "Archive / Capture",
    firstReleasedAt: "2027-11-02",
    latestReleasedAt: "2032-09-08",
    version: "2.4.0",
    status: "archived",
    icon: "notes",
    tone: "clay",
    platforms: ["macOS"],
    specimen: "capture",
    successorId: "namu",
    archiveReason:
      "Quick capture became part of Namu. Moa remains documented so its notes can always leave.",
    narrative: {
      object: "capture inbox",
      workspace: "Inbox",
      format: "Markdown folder",
      steps: [
        "Open the existing capture inbox.",
        "Review unfiled thoughts.",
        "Export the inbox before migrating to Namu.",
      ],
      changes: [
        "A menu-bar inbox catches short thoughts",
        "Capture receives a global shortcut",
        "Inbox entries retain timestamps",
        "Multiline notes replace single-line capture",
        "Attachments join the local inbox",
        "Search finds older fragments",
        "Export preserves capture order",
        "Markdown export keeps original dates",
        "VoiceOver reads the newest capture first",
        "Crash recovery restores unsaved entries",
        "A migration preview identifies duplicate notes",
        "Namu import understands Moa archives",
        "Final export handles large attachments",
        "Local diagnostics are removed from the archive build",
        "Final edition preserves a permanent way out",
      ],
      issue:
        "The archived application may not launch on newer operating systems.",
      recovery:
        "Keep the original inbox folder. The documented export format can be imported by Namu without launching Moa; work from a copy.",
    },
  },
  {
    id: "duru",
    name: "Duru",
    koreanName: "두루",
    tagline: "A backup you can understand.",
    description:
      "A retired folder-backup utility with a permanent restore reference and a final open archive format.",
    category: "Archive / Backup",
    firstReleasedAt: "2029-06-20",
    latestReleasedAt: "2034-02-28",
    version: "2.5.2",
    status: "discontinued",
    icon: "planning",
    tone: "plum",
    platforms: ["macOS", "Windows"],
    specimen: "backup",
    archiveReason:
      "Maintaining reliable filesystem support exceeded the scope of this small utility. New backups ended; restoration documentation remains.",
    narrative: {
      object: "backup set",
      workspace: "Restore",
      format: "ZIP with manifest",
      steps: [
        "Locate a backup set and its manifest.",
        "Verify it before selecting a destination.",
        "Restore into an empty folder, never over the only remaining copy.",
      ],
      changes: [
        "Folder snapshots begin with a readable manifest",
        "Exclusions become explicit before backup",
        "Interrupted copies resume safely",
        "Verification checks the archive manifest",
        "Windows paths preserve Unicode names",
        "Restore previews show overwritten files",
        "Retention keeps a minimum last-good copy",
        "Open ZIP export reduces format dependence",
        "Keyboard restore gains a confirmation step",
        "External disks recover after sleep",
        "Long paths receive clear warnings",
        "A restore-first interface replaces scheduling",
        "Final verification handles large manifests",
        "Bundled archive parser receives its final patch",
        "Backup creation retires; restore guidance remains",
      ],
      issue: "A missing manifest prevents automatic integrity verification.",
      recovery:
        "Keep the original archive unchanged. Extract a copy with a standard ZIP tool and compare critical files against an independent source.",
    },
  },
  {
    id: "gyeote",
    name: "Gyeote",
    koreanName: "곁에",
    tagline: "A reading margin that leaves room for you.",
    description:
      "An experimental reading companion that keeps excerpts and personal annotations separate from the source text.",
    category: "Experimental / Reading",
    firstReleasedAt: "2035-04-10",
    latestReleasedAt: "2036-09-03",
    version: "0.8.0-beta.3",
    status: "preview",
    icon: "focus",
    tone: "plum",
    platforms: ["Web", "iOS"],
    channels: ["beta"],
    specimen: "reading",
    narrative: {
      object: "reading margin",
      workspace: "Margins",
      format: "Markdown annotations",
      steps: [
        "Add a source title and a short excerpt.",
        "Write a separate margin note.",
        "Export annotations with their source references.",
      ],
      changes: [
        "A source and its margin become separate objects",
        "Notes retain source titles",
        "Reading width can be adjusted",
        "Keyboard capture keeps the source in focus",
        "An iOS beta tests narrow reading columns",
        "Annotations gain visible timestamps",
        "Source links stay attached after edits",
        "Export separates quotations from notes",
        "Reading order follows source then annotation",
        "Offline drafts retain source references",
        "Undo restores removed margin notes",
        "A two-plane reading view enters beta",
        "Long excerpts stop blocking text entry",
        "Diagnostics exclude source and annotation content",
        "Beta three improves narrow-screen margins",
      ],
      issue: "An external source may change after an excerpt was saved.",
      recovery:
        "Keep the capture date with your note. Open the source to check its current wording; an annotation is not an archival copy of a website.",
    },
  },
];
additions.forEach((item) => {
  narratives[item.id] = item.narrative;
});

const milestoneCopy = [
  [
    "A small beginning",
    "Harulo starts with a question: what could make an ordinary day a little better?",
  ],
  [
    "The first publications",
    "Sori and Moa establish two habits: quiet control and quick capture.",
  ],
  [
    "Thoughts find a home",
    "Namu brings daily notes and connected ideas into one local-first library.",
  ],
  [
    "Across the desktop",
    "Windows support grows alongside Jari and the first Duru backup editions.",
  ],
  [
    "Attention, considered",
    "Goyo makes room for intention without scores or streaks.",
  ],
  [
    "Into the day",
    "Haru Weather carries the publishing practice onto mobile screens.",
  ],
  [
    "Connections and continuity",
    "Yeon connects nearby devices. Moa’s ideas find a lasting home in Namu.",
  ],
  [
    "A new everyday question",
    "Dami approaches spending as something to understand, not a score to optimize.",
  ],
  [
    "Keeping a way out",
    "Duru retires with restore documentation. Gyeol opens a new developer-tool chapter.",
  ],
  [
    "A wider margin",
    "Gyeote tests a quieter reading companion. Shared accessibility reviews deepen across products.",
  ],
  [
    "Ten years, still beginning",
    "A mature catalog includes maintained, archived and unfinished work. Morrow asks what comes next.",
  ],
];
export const companyMilestones: CompanyMilestone[] = milestoneCopy.map(
  ([title, description], i) => ({
    id: `year-${2026 + i}`,
    year: 2026 + i,
    title,
    description,
    provenance: "synthetic",
  }),
);

function enrichProduct(p: Product): Product {
  const n = narratives[p.id],
    archived = ["archived", "discontinued"].includes(p.status);
  return {
    ...p,
    firstReleasedAt: p.id === "morrow" ? "2036-01-08" : p.firstReleasedAt,
    architecture: p.platforms.includes("macOS")
      ? ["Apple silicon", "x86-64"]
      : ["Platform-native", "Browser where listed"],
    supportState: archived
      ? "read-only"
      : p.status === "maintenance"
        ? "security-only"
        : "active",
    price: {
      model: p.status === "preview" ? "free" : "paid",
      text:
        p.status === "preview"
          ? "Fictional preview · no purchase or download"
          : "Fictional paid edition · no checkout",
    },
    requirements: p.platforms.map((platform) => ({
      platform,
      description:
        platform === "macOS"
          ? "macOS 14 or later; Apple silicon or Intel; 4 GB memory"
          : platform === "Windows"
            ? "Windows 11; x86-64; 4 GB memory"
            : platform === "iOS"
              ? "iOS 18 or later; Dynamic Type supported"
              : platform === "Android"
                ? "Android 14 or later; 2 GB memory"
                : "Current Safari, Firefox, Chrome or Edge; local storage enabled",
    })),
    accessibility: [
      ...new Set([
        ...p.accessibility,
        "All primary actions have named keyboard controls",
        "Text scales without hiding actions",
        "Reduced motion and high contrast are supported",
        "State changes use text as well as color",
      ]),
    ],
    relatedProductIds: p.successorId
      ? [p.successorId]
      : [p.id === "namu" ? "morrow" : "namu"],
    migration: p.successorId
      ? `Export a ${n.format} from ${n.workspace}. Review the archive, then import a copy into ${p.successorId === "namu" ? "Namu" : p.successorId}. Keep the original until you have checked dates and attachments.`
      : `Before a major update, export a ${n.format}. Open a copy in the new version and compare it before removing the previous installation.`,
    privacy: {
      updatedAt: p.latestReleasedAt!,
      summary: `Synthetic policy specimen for ${p.name}. This describes the fictional product model, not a released application.`,
      collected: [
        `The ${n.object} you explicitly create`,
        "Optional diagnostic reports after reviewing their contents",
      ],
      notCollected: [
        "Advertising identifiers",
        "Cross-site browsing history",
        "Content from other applications without an explicit action",
      ],
      storage: `The ${n.object} is held on the device. Any optional hosted feature must show its separate service and retention notice before activation.`,
      retention:
        "Local records remain until removed. The fictional diagnostic service retains submitted reports for 30 days.",
      deletion: `Remove the ${n.object} in ${n.workspace}, then clear the recycle area. Backups and exports are separate copies; remove those separately if required.`,
      services: [
        {
          name: "Demonstration diagnostic service",
          purpose:
            "Optional, user-reviewed fault reports; no actual endpoint exists",
        },
      ],
      history: [
        {
          date: p.firstReleasedAt!,
          change: "Initial local-storage and export notice",
        },
        {
          date: p.latestReleasedAt!,
          change:
            "Clarified diagnostic redaction, deletion and separate backup retention",
        },
      ],
    },
  };
}
function buildHistory(p: Product): Release[] {
  const n = narratives[p.id],
    start = Date.parse(p.firstReleasedAt!),
    end = Date.parse(p.latestReleasedAt!);
  const major = Math.max(1, Number(p.version?.split(".")[0]) || 1);
  const versions = n.changes.map((_, i) => {
    if (i === 14) return p.version!;
    if (p.status === "preview")
      return `0.${1 + Math.floor(i / 3)}.0-${p.channels[0] === "beta" ? "beta" : "preview"}.${(i % 3) + 1}`;
    if (major === 1)
      return i === 0 ? "1.0.0" : `1.${Math.floor((i * 9) / 13)}.${i % 2}`;
    const span = major === 2 ? 9 : major === 3 ? 5 : major === 4 ? 4 : 3;
    const era = Math.min(major, 1 + Math.floor(i / span));
    const position = i - (era - 1) * span;
    return era === major ? `${era}.0.${position}` : `${era}.${position}.0`;
  });
  return n.changes.map((title, i) => ({
    id: `${p.id}-${versions[i]}`,
    productId: p.id,
    version: versions[i],
    publishedAt: new Date(start + ((end - start) * i) / 14)
      .toISOString()
      .slice(0, 10),
    provenance: "synthetic",
    title,
    summary: `${title}. ${i < 5 ? `This edition establishes the ${n.object} workflow.` : i < 10 ? `The ${n.workspace} workflow becomes portable and more accessible.` : `This edition refines reliability and preserves a clear way to export.`}`,
    kind:
      p.status === "preview"
        ? "preview"
        : versions[i].endsWith(".0.0")
          ? "major"
          : i === 12 || i === 13 || i === 14
            ? "maintenance"
            : "feature",
    channel: p.channels[0],
    platforms: p.platforms,
    improvements: [
      title,
      i === 7
        ? `Export includes an explicit format version and a readable ${n.format}.`
        : i === 8
          ? `The selected ${n.object} is announced without moving keyboard focus.`
          : `The ${n.workspace} view explains the result before replacing existing data.`,
    ],
    fixes:
      i === 0
        ? []
        : [
            i % 3 === 0
              ? `Restored the selected ${n.object} after waking a suspended window.`
              : i % 3 === 1
                ? `Kept keyboard focus in ${n.workspace} after cancelling a dialog.`
                : `Preserved Unicode filenames and Korean text when reopening an export.`,
          ],
    securityNotes:
      i === 13
        ? [
            "Synthetic security maintenance: diagnostic output now redacts content-bearing fields. No real vulnerability or CVE is claimed.",
          ]
        : [],
    compatibility:
      i === 4
        ? [`Expanded the tested platform matrix: ${p.platforms.join(", ")}.`]
        : i === 12
          ? [
              "Previous exports remain readable. Back up before migrating a working library.",
            ]
          : [],
    knownIssues: i === 14 ? [n.issue] : [],
    downloads: [],
    previousVersion: i ? versions[i - 1] : undefined,
  }));
}
function support(p: Product): SupportArticle[] {
  const n = narratives[p.id];
  const topics: Array<[string, string, SupportArticle["category"], string[]]> =
    [
      [
        "getting-started",
        `Getting started with ${p.name}`,
        "getting-started",
        n.steps,
      ],
      [
        "installation",
        "Installation and system requirements",
        "getting-started",
        [
          `Confirm the system requirements for ${p.platforms.join(" / ")} before installing.`,
          "A real download must come from the publisher or a listed store. This synthetic preview provides neither installers nor payment links.",
          `On first launch, create a test ${n.object} before importing existing work. Permission prompts should explain the specific feature they enable.`,
        ],
      ],
      [
        "keyboard-shortcuts",
        "Keyboard and reading order",
        "accessibility",
        [
          `Tab moves through ${n.workspace} in reading order. Shift+Tab moves back.`,
          "Enter activates a focused action. Space changes a focused checkbox. Escape cancels a dialog without applying changes.",
          `A selected ${n.object} has a textual state label. Do not rely on color or a pointer to find it.`,
        ],
      ],
      [
        "export",
        "Export, backup and recovery",
        "reference",
        [
          `Open ${n.workspace} and select the records to preserve.`,
          `Choose Export and the ${n.format} format. Inspect the destination and confirm the count before writing.`,
          `Open the exported copy independently. Keep the original ${n.object} until dates, text and attachments have been checked.`,
        ],
      ],
      [
        "migration",
        "Moving between major editions",
        "reference",
        [
          p.migration!,
          "Do not overwrite your only backup. Keep both the source archive and the migration report until you have used the new edition successfully.",
          "If the result differs, cancel the migration and return to the old data copy. Contact support with the version numbers, not private content.",
        ],
      ],
      [
        "known-issues",
        "Known issues and troubleshooting",
        "troubleshooting",
        [
          n.issue,
          n.recovery,
          `If the problem repeats, record the ${p.name} version, operating system and the last action. Remove personal content from any diagnostic attachment.`,
        ],
      ],
      [
        "privacy",
        "Data handling and deletion",
        "reference",
        [
          `Your ${n.object} and exported backups are separate records. Deleting one does not delete the other.`,
          `Review ${p.name}’s product privacy specimen for storage, retention and external-service boundaries.`,
          "Before deletion, make any export you want to keep. Remove local records, clear the recycle area, then separately review backups and shared copies.",
        ],
      ],
      [
        "accessibility",
        "Accessibility and display preferences",
        "accessibility",
        [
          "Increase system text size before opening a long record; actions should wrap rather than disappear.",
          "With reduced motion enabled, every transition resolves to a stable state without withholding information.",
          `Use a screen reader to move by headings in ${n.workspace}. Report an unlabeled control with its location and action; private ${n.object} contents are not needed.`,
        ],
      ],
    ];
  return topics.map(([slug, title, category, paragraphs]) => ({
    id: `${p.id}-${slug}`,
    productId: p.id,
    slug,
    title,
    category,
    updatedAt: p.latestReleasedAt!,
    provenance: "synthetic",
    sections: [
      {
        heading: "About this document",
        paragraphs: [
          `Fictional support specimen · ${p.name} ${p.version}. ${p.supportState === "read-only" ? "Archived documentation; no active service is implied." : "Steps describe a proposed application, not available software."}`,
        ],
      },
      { heading: title, paragraphs },
      {
        heading: "Before contacting the studio",
        paragraphs: [
          "Keep the original data unchanged. Describe the expected result, the actual result and your version. Never send passwords, recovery keys or an unredacted personal archive.",
        ],
      },
    ],
  }));
}
export function buildUniverse(seed: PublisherCatalog): PublisherCatalog {
  const base = seed.products[0];
  const extra: Product[] = additions.map(
    ({ narrative, ...p }, i) =>
      ({
        ...base,
        ...p,
        id: p.id,
        slug: p.id,
        edition: String(i + 7).padStart(2, "0"),
        channels: p.channels ?? ["stable"],
        features: narrative.steps.map((step, j) => ({
          title: ["Begin deliberately.", "Keep control.", "Always a way out."][
            j
          ],
          description: step,
        })),
        resources: {},
        downloads: [],
        media: [],
      }) as Product,
  );
  const products = [...seed.products, ...extra].map(enrichProduct);
  const releases = products.flatMap(buildHistory);
  // Preserve the hand-authored, current release descriptions and exact publication metadata.
  for (const r of seed.releases) {
    const i = releases.findIndex(
      (x) => x.productId === r.productId && x.version === r.version,
    );
    if (i >= 0)
      releases[i] = {
        ...releases[i],
        ...r,
        previousVersion: releases[i].previousVersion,
      };
    else releases.push(r);
  }
  products.forEach((p) => {
    const sequence = releases
      .filter((r) => r.productId === p.id)
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    sequence.forEach((r, i) => {
      r.previousVersion = sequence[i - 1]?.version;
    });
  });
  products.forEach((p) => {
    p.history = releases
      .filter((r) => r.productId === p.id)
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))
      .filter((_, i, all) => i % 5 === 0 || i === all.length - 1)
      .map((r) => ({
        date: r.publishedAt,
        version: r.version,
        title: r.title,
        summary: r.summary,
      }));
  });
  return {
    edition: "demo",
    asOf: seed.asOf,
    products,
    releases,
    supportArticles: products.flatMap(support),
    milestones: companyMilestones,
    pressItems: products.flatMap((p) => [
      {
        id: `${p.id}-launch`,
        slug: `${p.id}-launch`,
        title: `Introducing ${p.name}`,
        publishedAt: p.firstReleasedAt!,
        provenance: "synthetic" as const,
        productId: p.id,
        summary: p.tagline,
        paragraphs: [
          "Fictional Harulo publisher announcement. No product availability is claimed.",
          p.description,
          `The first edition begins with ${narratives[p.id].object}. ${narratives[p.id].steps.join(" ")}`,
          "Publication includes a documented export path, accessible controls and a place to report problems.",
        ],
        assets: [],
      },
      {
        id: `${p.id}-current`,
        slug: `${p.id}-current`,
        title: `${p.name} ${p.version} — ${p.archiveReason ? "a permanent place in the archive" : "the next edition"}`,
        publishedAt: p.latestReleasedAt!,
        provenance: "synthetic" as const,
        productId: p.id,
        summary: p.archiveReason ?? narratives[p.id].changes[14],
        paragraphs: [
          "Fictional Harulo publisher announcement. This is part of the 2036 design universe.",
          p.archiveReason ?? narratives[p.id].changes.slice(11).join(". "),
          p.migration!,
          `Support is ${p.supportState === "read-only" ? "preserved as read-only documentation" : p.supportState === "security-only" ? "limited to security maintenance" : "part of the continuing publication"}.`,
        ],
        assets: [],
      },
    ]),
  };
}
