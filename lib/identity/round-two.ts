/** Round 2: few visible primitives at rest; pen lifts only when a stroke branches. */
import type { Identity, Piece, Point, Pose, Transformation } from "./geometry";

export const roundTwoIdentities = [
  {
    id: "syllable" as const,
    code: "01",
    name: "Syllable Block",
    primitives: 4,
    premise: "A whole word, held in one block.",
    anatomy:
      "A cap, a loop, a foot and a turned staff. Four substantial strokes hold one square, borrowing the hierarchy of a Hangul syllable rather than miniaturizing three letters.",
  },
  {
    id: "h-core" as const,
    code: "02",
    name: "ㅎ Core",
    primitives: 3,
    premise: "A circle with a sense of direction.",
    anatomy:
      "The circle of ㅎ, a branching axis from ㅏ, and a single ㄹ-derived step. The core stays a circle as the surrounding structure changes its purpose.",
  },
  {
    id: "ro-gate" as const,
    code: "03",
    name: "Ro Gate",
    primitives: 3,
    premise: "An opening toward the next state.",
    anatomy:
      "Two opposing square brackets and one inward turn. The stepped logic of ㄹ establishes a threshold; the opening carries the directional idea of 로.",
  },
  {
    id: "hangul-loop" as const,
    code: "04",
    name: "Hangul Loop",
    primitives: 1,
    premise: "One line. Many ways forward.",
    anatomy:
      "One open, continuous square spiral. Its few turns unfold into the stepped ㄹ construction. There is no collection of hidden independent logo strokes.",
  },
  {
    id: "hangul-aperture" as const,
    code: "05",
    name: "Hangul Aperture",
    primitives: 4,
    premise: "Four strokes make room for possibility.",
    anatomy:
      "Four branching Hangul vowel modules face a central square of space. Mirror balance replaces rotating shutters; the short stems can become rails, controls and publication edges.",
  },
];
export type RoundTwoIdentity = (typeof roundTwoIdentities)[number]["id"];
export function isRoundTwo(id: Identity): id is RoundTwoIdentity {
  return roundTwoIdentities.some((candidate) => candidate.id === id);
}
const names = ["SORI", "NAMU", "GOYO", "HARU WEATHER", "DAMI", "MORROW"];
const stroke = (points: Point[], width = 26): Piece => ({
  points,
  width,
});
const line = (a: Point, b: Point, width = 26) => stroke([a, b], width);
const ring = (
  x: number,
  y: number,
  r: number,
  width = 26,
  from = 0,
  to = Math.PI * 2,
): Piece => ({
  width,
  points: Array.from({ length: 120 }, (_, i) => {
    const a = from + ((to - from) * i) / 119;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  }),
});
// A pen lift is a division of ONE owned stroke, not another logo primitive.
function join(...pieces: Piece[]): Piece {
  let offset = 0;
  const breaks: number[] = [];
  for (const p of pieces) {
    if (offset) breaks.push(offset);
    breaks.push(...(p.breaks ?? []).map((index) => index + offset));
    offset += p.points.length;
  }
  return {
    points: pieces.flatMap((p) => p.points),
    width: pieces[0].width,
    breaks,
  };
}
function translate(p: Piece, x: number, y: number): Piece {
  return { ...p, points: p.points.map(([a, b]) => [a + x, b + y]) };
}
const pose = (
  pieces: Piece[],
  caption?: string,
  kind?: string,
  detail?: string,
): Pose => ({ pieces, caption, kind, detail });
const rieul = (x: number, y: number, w: number, h: number, width = 12) =>
  stroke(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h / 2],
      [x, y + h / 2],
      [x, y + h],
      [x + w, y + h],
    ],
    width,
  );
const vowel = (x: number, y: number, w: number, up: boolean, width = 12) =>
  stroke(
    [
      [x - w / 2, y],
      [x, y],
      [x, y + (up ? -32 : 32)],
      [x, y],
      [x + w / 2, y],
    ],
    width,
  );

export function roundTwoBase(id: RoundTwoIdentity): Pose {
  switch (id) {
    case "syllable":
      return pose([
        line([307, 148], [493, 148], 28),
        ring(385, 239, 36, 28),
        stroke(
          [
            [307, 211],
            [307, 352],
            [493, 352],
          ],
          28,
        ),
        stroke(
          [
            [493, 211],
            [493, 289],
            [451, 289],
          ],
          28,
        ),
      ]);
    case "h-core":
      return pose([
        ring(400, 258, 52, 28),
        stroke(
          [
            [334, 166],
            [400, 166],
            [400, 137],
            [400, 166],
            [466, 166],
          ],
          26,
        ),
        stroke(
          [
            [506, 174],
            [506, 355],
            [294, 355],
            [294, 310],
          ],
          26,
        ),
      ]);
    case "ro-gate":
      return pose([
        stroke(
          [
            [296, 346],
            [296, 150],
            [490, 150],
          ],
          30,
        ),
        stroke(
          [
            [346, 350],
            [494, 350],
            [494, 206],
          ],
          30,
        ),
        stroke(
          [
            [358, 282],
            [420, 282],
            [420, 220],
          ],
          30,
        ),
      ]);
    case "hangul-loop":
      return pose([
        stroke(
          [
            [310, 150],
            [490, 150],
            [490, 350],
            [310, 350],
            [310, 250],
            [412, 250],
          ],
          30,
        ),
      ]);
    case "hangul-aperture":
      return pose([
        vowel(400, 150, 140, false, 28),
        stroke(
          [
            [500, 180],
            [500, 250],
            [462, 250],
            [500, 250],
            [500, 320],
          ],
          28,
        ),
        vowel(400, 350, 140, true, 28),
        stroke(
          [
            [300, 180],
            [300, 250],
            [338, 250],
            [300, 250],
            [300, 320],
          ],
          28,
        ),
      ]);
  }
}

/** 4 owners unfold into 하, then 하루, then 하루로. Adjacent subdivisions
 * share endpoints in the source; their separation is visible during the motion.
 */
function syllables(count: 1 | 2 | 3): Pose {
  const x = count === 1 ? 330 : count === 2 ? 230 : 142;
  const core = ring(x + 42, 258, 29, 12);
  const cap = join(
    line([x + 23, 173], [x + 61, 173], 12),
    line([x + 6, 202], [x + 78, 202], 12),
  );
  const staff = stroke(
    [
      [x + 115, 175],
      [x + 115, 253],
      [x + 144, 253],
      [x + 115, 253],
      [x + 115, 323],
    ],
    12,
  );
  const root = stroke(
    [
      [x + 115, 175],
      [x + 115, 253],
    ],
    12,
  );
  const ru = count >= 2 ? rieul(x + 190, 180, 92, 80) : root;
  const ro = count === 3 ? rieul(x + 365, 180, 92, 80) : ru;
  const u = count >= 2 ? vowel(x + 236, 300, 112, false) : root;
  const o = count === 3 ? vowel(x + 411, 329, 112, true) : u;
  return pose(
    [cap, core, join(staff, u, o), join(ru, ro)],
    ["", "하", "하루", "하루로"][count],
    "language",
    "하루 / A DAY     로 / DIRECTION TOWARD",
  );
}

function application(id: RoundTwoIdentity, level = 0): Pose {
  const left = stroke(
    [
      [640, 104],
      [160, 104],
      [160, 398],
    ],
    7,
  );
  const right = stroke(
    [
      [160, 398],
      [640, 398],
      [640, 104],
    ],
    7,
  );
  const rails = join(
    line([160, 154], [640, 154], 5),
    line([288, 154], [288, 398], 5),
    line([345, 312], [590, 312], 5),
  );
  const control = ring(455 + level * 95, 312, 14, 8);
  let pieces: Piece[];
  if (id === "syllable") pieces = [left, control, right, rails];
  else if (id === "h-core")
    pieces = [
      control,
      join(left, line([345, 312], [590, 312], 7)),
      join(
        right,
        line([160, 154], [640, 154], 7),
        line([288, 154], [288, 398], 7),
      ),
    ];
  else if (id === "ro-gate") pieces = [left, right, rails];
  else if (id === "hangul-loop")
    pieces = [
      stroke(
        [
          [288, 398],
          [160, 398],
          [160, 104],
          [640, 104],
          [640, 398],
          [288, 398],
          [288, 154],
          [640, 154],
        ],
        7,
      ),
    ];
  else
    pieces = [
      stroke(
        [
          [160, 104],
          [400, 104],
          [400, 132],
          [400, 104],
          [640, 104],
        ],
        7,
      ),
      stroke(
        [
          [640, 104],
          [640, 312],
          [550, 312],
          [640, 312],
          [640, 398],
        ],
        7,
      ),
      stroke(
        [
          [640, 398],
          [288, 398],
          [288, 154],
          [288, 398],
          [160, 398],
        ],
        7,
      ),
      stroke(
        [
          [160, 398],
          [160, 154],
          [640, 154],
          [160, 154],
          [160, 104],
        ],
        7,
      ),
    ];
  return pose(
    pieces,
    "SORI / SOUND, IN YOUR HANDS.",
    "window",
    "FICTIONAL APPLICATION STUDY",
  );
}

function publication(id: RoundTwoIdentity): Pose {
  const top = stroke(
    [
      [253, 418],
      [253, 82],
      [547, 82],
    ],
    8,
  );
  const bottom = stroke(
    [
      [547, 82],
      [547, 418],
      [253, 418],
    ],
    8,
  );
  const rules = join(
    line([253, 142], [547, 142], 6),
    line([253, 354], [547, 354], 6),
  );
  const wave = stroke(
    [
      [306, 283],
      [342, 283],
      [342, 213],
      [379, 213],
      [379, 303],
      [421, 303],
      [421, 192],
      [460, 192],
      [460, 270],
      [497, 270],
    ],
    10,
  );
  const pieces =
    id === "syllable"
      ? [top, wave, bottom, rules]
      : id === "ro-gate"
        ? [top, bottom, join(rules, wave)]
        : id === "h-core"
          ? [ring(400, 249, 58, 10), top, join(bottom, rules)]
          : id === "hangul-loop"
            ? [
                stroke(
                  [
                    [253, 142],
                    [253, 82],
                    [547, 82],
                    [547, 418],
                    [253, 418],
                    [253, 354],
                    [547, 354],
                  ],
                  8,
                ),
              ]
            : [top, bottom, rules, wave];
  return pose(
    pieces,
    "SORI / SOFTWARE EDITION 01",
    "edition",
    "DESIGNED, BUILT & PUBLISHED BY HARULO",
  );
}

function publisherGrid(id: RoundTwoIdentity): Pose {
  const cells = [0, 1, 2].map((i) =>
    stroke(
      [
        [120 + i * 190, 112],
        [300 + i * 190, 112],
        [300 + i * 190, 384],
        [120 + i * 190, 384],
        [120 + i * 190, 112],
      ],
      5,
    ),
  );
  if (id === "syllable")
    return pose(
      [...cells, line([90, 424], [710, 424], 5)],
      "THREE SYLLABLES. A PUBLISHING SYSTEM.",
      "cells",
      "하 → 루 → 로 / 01 → 02 → 03",
    );
  if (id === "hangul-loop")
    return pose(
      [
        stroke(
          [
            [106, 105],
            [296, 105],
            [296, 393],
            [502, 393],
            [502, 105],
            [694, 105],
            [694, 393],
            [106, 393],
            [106, 249],
            [694, 249],
          ],
          5,
        ),
      ],
      "ONE LINE BECOMES THE PUBLISHING GRID.",
      "grid",
      "THREE COLUMNS / ONE CONTINUOUS RULE",
    );
  const p = [
    stroke(
      [
        [118, 90],
        [400, 90],
        [400, 410],
        [400, 90],
        [682, 90],
      ],
      5,
    ),
    stroke(
      [
        [682, 90],
        [682, 250],
        [118, 250],
        [682, 250],
        [682, 410],
      ],
      5,
    ),
    stroke(
      [
        [682, 410],
        [308, 410],
        [308, 90],
        [308, 410],
        [118, 410],
      ],
      5,
    ),
    stroke(
      [
        [118, 410],
        [118, 180],
        [682, 180],
        [118, 180],
        [118, 90],
      ],
      5,
    ),
  ];
  return pose(
    p,
    "REGISTER. ALIGN. PUBLISH.",
    "grid",
    "FOUR MODULES / ONE PUBLICATION SURFACE",
  );
}

function direction(id: RoundTwoIdentity): Pose {
  const route = stroke(
    [
      [164, 366],
      [276, 366],
      [276, 290],
      [406, 290],
      [406, 208],
      [564, 208],
      [636, 136],
    ],
    12,
  );
  const tip = stroke(
    [
      [560, 136],
      [636, 136],
      [636, 212],
    ],
    12,
  );
  let pieces: Piece[];
  if (id === "hangul-loop")
    pieces = [
      stroke(
        [
          [164, 366],
          [276, 366],
          [276, 290],
          [406, 290],
          [406, 208],
          [636, 136],
          [560, 136],
          [636, 136],
          [636, 212],
        ],
        14,
      ),
    ];
  else if (id === "h-core") pieces = [ring(406, 290, 19, 12), route, tip];
  else if (id === "ro-gate")
    pieces = [
      stroke(
        [
          [164, 366],
          [276, 366],
          [276, 290],
          [406, 290],
        ],
        14,
      ),
      stroke(
        [
          [406, 290],
          [406, 208],
          [564, 208],
          [636, 136],
        ],
        14,
      ),
      tip,
    ];
  else
    pieces = [
      stroke(
        [
          [164, 366],
          [276, 366],
          [276, 290],
        ],
        12,
      ),
      ring(406, 290, 17, 10),
      stroke(
        [
          [276, 290],
          [406, 290],
          [406, 208],
          [636, 136],
        ],
        12,
      ),
      tip,
    ];
  return pose(
    pieces,
    "TOWARD A LITTLE BETTER DAY.",
    "direction",
    "OBSERVE → BUILD → PUBLISH → IMPROVE",
  );
}

function seal(): Pose {
  return pose(
    [
      ring(400, 250, 144, 10),
      stroke(
        [
          [255, 96],
          [400, 96],
          [400, 72],
          [400, 96],
          [545, 96],
        ],
        7,
      ),
      stroke(
        [
          [545, 404],
          [255, 404],
          [255, 380],
        ],
        7,
      ),
    ],
    "PUBLISHED / EDITION 01",
    "seal",
    "THE CORE BECOMES THE PUBLISHER’S SEAL",
  );
}

function portal(id: "ro-gate" | "hangul-aperture", open: boolean): Pose {
  const x = open ? -20 : 315,
    y = open ? -20 : 168,
    w = open ? 840 : 170,
    h = open ? 540 : 164;
  const pieces =
    id === "ro-gate"
      ? [
          stroke(
            [
              [x, y + h],
              [x, y],
              [x + w, y],
            ],
            12,
          ),
          stroke(
            [
              [x + 36, y + h],
              [x + w, y + h],
              [x + w, y + 36],
            ],
            12,
          ),
          stroke(
            [
              [x + 62, y + h - 52],
              [x + w - 62, y + h - 52],
              [x + w - 62, y + 52],
            ],
            8,
          ),
        ]
      : [
          stroke(
            [
              [x, y],
              [400, y],
              [400, y - 30],
              [400, y],
              [x + w, y],
            ],
            12,
          ),
          stroke(
            [
              [x + w, y],
              [x + w, 250],
              [x + w + 30, 250],
              [x + w, 250],
              [x + w, y + h],
            ],
            12,
          ),
          stroke(
            [
              [x + w, y + h],
              [400, y + h],
              [400, y + h + 30],
              [400, y + h],
              [x, y + h],
            ],
            12,
          ),
          stroke(
            [
              [x, y + h],
              [x, 250],
              [x - 30, 250],
              [x, 250],
              [x, y],
            ],
            12,
          ),
        ];
  return {
    ...pose(
      pieces,
      "INTO THE NEXT EDITION.",
      "portal",
      "THE OPENING REVEALS THE DESTINATION",
    ),
    reveal: [x + 12, y + 12, w - 24, h - 24],
  };
}

/** Six different silhouettes using each parent's construction, never hue swaps. */
export function roundTwoProduct(id: RoundTwoIdentity, index: number): Pose {
  const i = ((index % 6) + 6) % 6;
  let pieces: Piece[];
  if (id === "hangul-loop") {
    const paths: Point[][] = [
      [
        [298, 250],
        [335, 250],
        [335, 185],
        [377, 185],
        [377, 319],
        [421, 319],
        [421, 158],
        [463, 158],
        [463, 250],
        [502, 250],
      ],
      [
        [300, 166],
        [390, 166],
        [390, 340],
        [490, 340],
        [490, 210],
        [433, 210],
        [433, 288],
      ],
      [
        [335, 169],
        [480, 169],
        [480, 331],
        [320, 331],
        [320, 244],
        [401, 244],
        [401, 199],
      ],
      [
        [294, 329],
        [294, 242],
        [344, 242],
        [344, 173],
        [451, 173],
        [451, 242],
        [503, 242],
        [503, 329],
        [399, 329],
      ],
      [
        [313, 157],
        [482, 157],
        [482, 229],
        [353, 229],
        [353, 289],
        [482, 289],
        [482, 348],
        [313, 348],
      ],
      [
        [294, 345],
        [355, 345],
        [355, 282],
        [420, 282],
        [420, 215],
        [496, 215],
        [496, 156],
        [438, 156],
      ],
    ];
    pieces = [stroke(paths[i], 26)];
  } else if (id === "h-core") {
    const cores = [
      [319, 250, 23],
      [400, 173, 27],
      [400, 250, 52],
      [400, 232, 54],
      [350, 198, 36],
      [476, 174, 28],
    ];
    const [x, y, r] = cores[i];
    const others: Piece[][] = [
      [
        ring(321, 250, 92, 22, -1.05, 1.05),
        ring(321, 250, 145, 22, -1.05, 1.05),
      ],
      [
        stroke(
          [
            [304, 208],
            [304, 261],
            [400, 298],
            [496, 261],
            [496, 208],
          ],
          24,
        ),
        stroke(
          [
            [400, 218],
            [400, 351],
            [461, 351],
          ],
          24,
        ),
      ],
      [
        stroke(
          [
            [350, 153],
            [302, 153],
            [302, 347],
            [350, 347],
          ],
          24,
        ),
        stroke(
          [
            [450, 153],
            [498, 153],
            [498, 347],
            [450, 347],
          ],
          24,
        ),
      ],
      [
        line([292, 309], [508, 309], 24),
        stroke(
          [
            [319, 349],
            [427, 349],
            [427, 331],
            [481, 331],
          ],
          24,
        ),
      ],
      [
        stroke(
          [
            [294, 270],
            [410, 270],
            [410, 328],
            [492, 328],
          ],
          24,
        ),
        stroke(
          [
            [404, 153],
            [492, 153],
            [492, 265],
          ],
          24,
        ),
      ],
      [
        stroke(
          [
            [297, 347],
            [358, 347],
            [358, 282],
            [421, 282],
            [421, 221],
          ],
          24,
        ),
        line([297, 380], [496, 380], 20),
      ],
    ];
    pieces = [ring(x, y, r, 24), ...others[i]];
  } else if (id === "ro-gate") {
    const cells: Piece[][] = [
      [
        stroke(
          [
            [326, 195],
            [292, 195],
            [292, 305],
            [326, 305],
          ],
          26,
        ),
        stroke(
          [
            [458, 152],
            [503, 152],
            [503, 348],
            [458, 348],
          ],
          26,
        ),
        stroke(
          [
            [373, 213],
            [414, 213],
            [414, 287],
            [373, 287],
          ],
          26,
        ),
      ],
      [
        stroke(
          [
            [299, 170],
            [390, 170],
            [390, 344],
          ],
          26,
        ),
        stroke(
          [
            [501, 170],
            [410, 170],
            [410, 344],
          ],
          26,
        ),
        stroke(
          [
            [331, 284],
            [331, 319],
            [365, 319],
          ],
          24,
        ),
      ],
      [
        stroke(
          [
            [356, 150],
            [294, 150],
            [294, 350],
            [356, 350],
          ],
          26,
        ),
        stroke(
          [
            [444, 150],
            [506, 150],
            [506, 350],
            [444, 350],
          ],
          26,
        ),
        stroke(
          [
            [380, 222],
            [420, 222],
            [420, 278],
            [380, 278],
          ],
          26,
        ),
      ],
      [
        stroke(
          [
            [296, 283],
            [296, 210],
            [353, 210],
            [353, 161],
            [447, 161],
          ],
          26,
        ),
        stroke(
          [
            [447, 161],
            [447, 210],
            [504, 210],
            [504, 283],
          ],
          26,
        ),
        stroke(
          [
            [329, 326],
            [400, 326],
            [400, 346],
            [471, 346],
          ],
          26,
        ),
      ],
      [
        stroke(
          [
            [300, 170],
            [480, 170],
            [480, 226],
          ],
          26,
        ),
        stroke(
          [
            [500, 330],
            [320, 330],
            [320, 274],
          ],
          26,
        ),
        stroke(
          [
            [377, 216],
            [420, 216],
            [420, 284],
            [377, 284],
          ],
          26,
        ),
      ],
      [
        stroke(
          [
            [295, 348],
            [354, 348],
            [354, 288],
          ],
          26,
        ),
        stroke(
          [
            [388, 256],
            [448, 256],
            [448, 194],
          ],
          26,
        ),
        stroke(
          [
            [455, 155],
            [507, 155],
            [507, 207],
          ],
          26,
        ),
      ],
    ];
    pieces = cells[i];
  } else if (id === "hangul-aperture") {
    // The same four T/branch modules become amplitudes, leaves, focus, forecast,
    // two-sided balances, and ascending planning steps.
    pieces = Array.from({ length: 4 }, (_, n) => {
      if (i === 0) {
        const x = 310 + n * 60,
          h = [42, 94, 68, 27][n];
        return stroke(
          [
            [x, 250 - h],
            [x, 250],
            [x + 23, 250],
            [x, 250],
            [x, 250 + h],
          ],
          24,
        );
      }
      if (i === 1) {
        const y = 166 + n * 58;
        return stroke(
          [
            [319 + n * 8, y - 10],
            [400, y + 28],
            [400, y + 55],
            [400, y + 28],
            [481 - n * 8, y - 10],
          ],
          23,
        );
      }
      if (i === 2) {
        const corners: Point[][] = [
          [
            [378, 166],
            [316, 166],
            [316, 228],
          ],
          [
            [422, 166],
            [484, 166],
            [484, 228],
          ],
          [
            [484, 272],
            [484, 334],
            [422, 334],
          ],
          [
            [378, 334],
            [316, 334],
            [316, 272],
          ],
        ];
        return stroke(corners[n], 24);
      }
      if (i === 3) {
        const p: Point[][] = [
          [
            [309, 213],
            [309, 278],
            [347, 278],
            [309, 278],
            [309, 313],
          ],
          [
            [364, 156],
            [400, 156],
            [400, 198],
            [400, 156],
            [436, 156],
          ],
          [
            [491, 213],
            [491, 278],
            [453, 278],
            [491, 278],
            [491, 313],
          ],
          [
            [338, 350],
            [400, 350],
            [400, 313],
            [400, 350],
            [462, 350],
          ],
        ];
        return stroke(p[n], 24);
      }
      if (i === 4) {
        const x = n % 2 ? 449 : 351,
          y = n < 2 ? 184 : 316;
        return stroke(
          [
            [x - 30, y],
            [x, y],
            [x, y + (n < 2 ? 39 : -39)],
            [x, y],
            [x + 30, y],
          ],
          24,
        );
      }
      const x = 303 + n * 62,
        y = 345 - n * 61;
      return stroke(
        [
          [x - 22, y],
          [x + 22, y],
          [x + 22, y - 36],
          [x + 22, y],
          [x + 22, y + 23],
        ],
        24,
      );
    });
  } else {
    const cap = [
      line([310, 157], [492, 157], 26),
      stroke(
        [
          [302, 168],
          [391, 168],
          [391, 345],
        ],
        26,
      ),
      line([341, 156], [459, 156], 26),
      line([343, 153], [457, 153], 26),
      line([308, 154], [481, 154], 26),
      stroke(
        [
          [302, 346],
          [355, 346],
          [355, 281],
        ],
        26,
      ),
    ][i];
    const core = [
      ring(342, 251, 25, 26),
      ring(449, 218, 34, 26),
      ring(400, 250, 54, 26),
      ring(400, 238, 54, 26),
      ring(351, 229, 34, 26),
      ring(470, 174, 28, 26),
    ][i];
    const foot = [
      stroke(
        [
          [309, 318],
          [309, 350],
          [490, 350],
        ],
        26,
      ),
      stroke(
        [
          [302, 232],
          [302, 345],
          [493, 345],
        ],
        26,
      ),
      stroke(
        [
          [304, 212],
          [304, 350],
          [461, 350],
        ],
        26,
      ),
      stroke(
        [
          [303, 310],
          [399, 310],
          [399, 347],
          [493, 347],
        ],
        26,
      ),
      stroke(
        [
          [308, 306],
          [410, 306],
          [410, 350],
        ],
        26,
      ),
      stroke(
        [
          [355, 281],
          [418, 281],
          [418, 219],
        ],
        26,
      ),
    ][i];
    const staff = [
      stroke(
        [
          [416, 208],
          [458, 208],
          [458, 294],
          [493, 294],
        ],
        26,
      ),
      line([449, 275], [493, 275], 26),
      line([496, 215], [496, 286], 26),
      line([502, 208], [502, 264], 26),
      stroke(
        [
          [452, 216],
          [494, 216],
          [494, 350],
        ],
        26,
      ),
      stroke(
        [
          [302, 381],
          [498, 381],
        ],
        24,
      ),
    ][i];
    pieces = [cap, core, foot, staff];
  }
  return pose(pieces, names[i], "family", "FICTIONAL PRODUCT / FAMILY STUDY");
}

function contours(p: Piece): Point[][] {
  const edges = [0, ...(p.breaks ?? []), p.points.length];
  return edges.slice(1).map((end, i) => p.points.slice(edges[i], end));
}
const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const pathLength = (points: Point[]) =>
  points.slice(1).reduce((sum, p, i) => sum + distance(points[i], p), 0);
const between = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

// Equal-arclength sampling can shave corners and shorten retraced stems. Reserve
// every authored vertex, then distribute the remaining samples along its edges.
function sampleCorners(points: Point[], count = 128): Point[] {
  const lengths = points.slice(1).map((p, i) => distance(points[i], p));
  const intervals = lengths.map(() => 1);
  for (let spare = count - points.length; spare > 0; spare--) {
    let best = 0;
    lengths.forEach((length, i) => {
      if (length / intervals[i] > lengths[best] / intervals[best]) best = i;
    });
    intervals[best]++;
  }
  return [
    ...intervals.flatMap((n, i) =>
      Array.from({ length: n }, (_, j) =>
        between(points[i], points[i + 1], j / n),
      ),
    ),
    points.at(-1)!,
  ];
}

function bisect(points: Point[]): [Point[], Point[]] {
  const halfway = pathLength(points) / 2;
  let walked = 0;
  for (let i = 1; i < points.length; i++) {
    const length = distance(points[i - 1], points[i]);
    if (walked + length >= halfway) {
      const middle = between(
        points[i - 1],
        points[i],
        (halfway - walked) / (length || 1),
      );
      return [
        [...points.slice(0, i), middle],
        [middle, ...points.slice(i)],
      ];
    }
    walked += length;
  }
  return [points, points];
}
/** Partition a continuous source stroke into touching sections only when a
 * destination needs pen lifts. No hidden/faded substitutes, no zero-width parts.
 */
function normalize(p: Piece, count: number): Piece {
  const paths = contours(p);
  while (paths.length < count) {
    let longest = 0;
    paths.forEach((part, i) => {
      if (pathLength(part) > pathLength(paths[longest])) longest = i;
    });
    paths.splice(longest, 1, ...bisect(paths[longest]));
  }
  return {
    ...p,
    points: paths.flatMap((part) => sampleCorners(part)),
    breaks: paths.slice(1).map((_, i) => (i + 1) * 128),
  };
}
function make(
  id: string,
  name: string,
  purpose: string,
  continuity: string,
  poses: Pose[],
  duration = 9000,
): Transformation {
  const counts = poses[0].pieces.map((_, i) =>
    Math.max(...poses.map((p) => contours(p.pieces[i]).length)),
  );
  const cache = new Map<Pose, Pose>();
  return {
    id,
    name,
    purpose,
    continuity,
    duration,
    frames: poses.map((p, i) => {
      if (!cache.has(p))
        cache.set(p, {
          ...p,
          pieces: p.pieces.map((part, j) => normalize(part, counts[j])),
        });
      return { at: i / (poses.length - 1), pose: cache.get(p)! };
    }),
  };
}
const cached = new Map<RoundTwoIdentity, Transformation[]>();
export function roundTwoTransformations(
  id: RoundTwoIdentity,
): Transformation[] {
  const existing = cached.get(id);
  if (existing) return existing;
  const b = roundTwoBase(id),
    w = application(id),
    e = publication(id),
    d = direction(id);
  let list: Transformation[];
  if (id === "syllable") {
    const g = publisherGrid(id);
    const cells = pose(
      [
        stroke(
          [
            [125, 135],
            [295, 135],
            [295, 365],
            [125, 365],
            [125, 135],
          ],
          12,
        ),
        ring(400, 250, 57, 12),
        stroke(
          [
            [505, 365],
            [675, 365],
            [675, 135],
          ],
          12,
        ),
        stroke(
          [
            [335, 145],
            [465, 145],
            [465, 355],
            [335, 355],
          ],
          12,
        ),
      ],
      "하 / 루 / 로",
      "language",
      "THE WORD SEPARATES INTO THREE SYLLABIC CELLS",
    );
    list = [
      make(
        "SB-01",
        "One block → 하루로",
        "Language / introduction",
        "The cap divides into the two bars of ㅎ; the ring stays its circular core. The foot and turned staff unfold into vowels and ㄹ strokes. Duplicated contours start touching and physically separate to add 루, then 로.",
        [b, syllables(1), syllables(2), syllables(3), syllables(3), b],
        14000,
      ),
      make(
        "SB-02",
        "Syllables → publishing cells",
        "Grid / catalog",
        "The four strokes open three syllabic cells. The cap becomes the first frame, the circle squares into the second, and the foot becomes the third. The final staff stretches into the publication baseline.",
        [b, cells, g, g, b],
        10500,
      ),
      make(
        "SB-03",
        "Block → application",
        "Software / hero",
        "The cap and foot take opposite sides of the window. The circle remains a circle and becomes the sound control. The turned staff branches into header and sidebar rails.",
        [b, w, application(id, 1), w, b],
      ),
      make(
        "SB-04",
        "Block → edition",
        "Product / release",
        "Cap and foot open the cover. The ring unrolls into the sound signature. The turned staff divides into two edition rules; all four return to their original places.",
        [b, e, e, b],
      ),
      make(
        "SB-05",
        "Block → direction",
        "Navigation",
        "The cap bends into the first step; the foot extends toward the destination. The ring becomes a waypoint and the turned staff becomes the arrowhead.",
        [b, d, d, b],
      ),
    ];
  } else if (id === "h-core") {
    const anatomy = pose(
      [
        ring(214, 280, 47, 16),
        stroke(
          [
            [391, 148],
            [391, 250],
            [445, 250],
            [391, 250],
            [391, 352],
          ],
          16,
        ),
        rieul(546, 170, 102, 163, 16),
      ],
      "ㅎ / ㅏ / ㄹ",
      "anatomy",
      "CIRCLE → BRANCH → STEP · STRUCTURAL SOURCES",
    );
    const stations = [
      [406, 208],
      [564, 208],
      [636, 136],
    ].map(([x, y]) =>
      pose(
        [ring(x, y, 19, 12), d.pieces[1], d.pieces[2]],
        "THE CORE FINDS THE NEXT STATE.",
        "direction",
      ),
    );
    const s = seal();
    list = [
      make(
        "HC2-01",
        "Circle, branch, step",
        "Hangul anatomy",
        "The circle is isolated as the loop of ㅎ; the axis unfolds into ㅏ; the surrounding step lengthens into ㄹ. Three sources return as three unified primitives.",
        [b, anatomy, anatomy, b],
      ),
      make(
        "HC2-02",
        "The core becomes a control",
        "Software / hero",
        "The circular core moves directly onto the audio rail. The branching axis becomes the upper window and control track; the step becomes the lower window, header and sidebar.",
        [b, w, application(id, 1), w, b],
        11000,
      ),
      make(
        "HC2-03",
        "Follow the core",
        "Navigation",
        "The axis unfolds into a route and the step sharpens into an arrowhead. The same circular core follows each leg of the route to the destination.",
        [b, d, ...stations, stations[2], b],
        14000,
      ),
      make(
        "HC2-04",
        "Core → publishing seal",
        "Release / imprint",
        "The core expands into the edition’s circular boundary. The axis registers the top; the step registers the publication baseline. Metadata arrives inside that same circle.",
        [b, s, s, b],
      ),
      make(
        "HC2-05",
        "Six roles for one core",
        "Product family",
        "The circle becomes sound, a growing thought, a focus field, daily weather, spending and a future waypoint. The two structural strokes adapt around it.",
        [b, ...names.map((_, i) => roundTwoProduct(id, i)), b],
        19000,
      ),
    ];
  } else if (id === "ro-gate") {
    const opened = pose(
      [
        translate(b.pieces[0], -82, 0),
        translate(b.pieces[1], 82, 0),
        stroke(
          [
            [356, 250],
            [443, 250],
            [418, 225],
            [443, 250],
            [418, 275],
          ],
          20,
        ),
      ],
      "로 / TOWARD, THROUGH, INTO",
      "direction",
      "THE OPENING IS THE DIRECTION",
    );
    const p = portal(id, true),
      n = portal(id, false);
    const closed = pose(
      [
        b.pieces[0],
        stroke(
          [
            [296, 350],
            [494, 350],
            [494, 150],
          ],
          30,
        ),
        b.pieces[2],
      ],
      "A THRESHOLD, NOT A DESTINATION.",
    );
    list = [
      make(
        "RG-01",
        "A threshold opens",
        "Introduction / loading",
        "The opposing brackets close into one square, then separate laterally. The inward turn straightens into a passage marker, making the direction visible inside the opening.",
        [b, closed, opened, opened, b],
      ),
      make(
        "RG-02",
        "Threshold → route",
        "Navigation",
        "The two brackets unfold end to end as an ascending path. The inward turn becomes its terminal arrowhead; no stroke is replaced.",
        [b, d, d, b],
      ),
      make(
        "RG-03",
        "Threshold → application",
        "Software / hero",
        "The opposing brackets become the application perimeter. The inward turn travels inside, extending into the header, sidebar and control rail.",
        [b, w, w, b],
      ),
      make(
        "RG-04",
        "Through to the next page",
        "Page transition / portal",
        "The actual space between the brackets clips the destination. As the brackets move outward, more of the edition is exposed; the inner turn remains a registration corner.",
        [b, n, p, p, n, b],
        12000,
      ),
      make(
        "RG-05",
        "Threshold → edition",
        "Publication / cover",
        "Two brackets enclose a publication cover. The inward turn travels through the opened cover, separating into edition rules and a sound signature.",
        [b, opened, e, e, b],
        11000,
      ),
    ];
  } else if (id === "hangul-loop") {
    const r = pose(
      [rieul(302, 155, 196, 190, 28)],
      "ㄹ / THE STEPPED CONSTRUCTION",
      "language",
      "A SINGLE LINE, FOUR MAJOR TURNS",
    );
    const ru = pose(
      [join(rieul(327, 155, 146, 106, 18), vowel(400, 311, 192, false, 18))],
      "루 / A BLOCK TAKES SHAPE",
      "language",
      "ONE CONTINUOUS SOURCE UNFOLDS INTO CONSONANT + VOWEL",
    );
    const timeline = pose(
      [
        stroke(
          [
            [118, 296],
            [218, 296],
            [218, 206],
            [259, 206],
            [259, 296],
            [388, 296],
            [388, 168],
            [429, 168],
            [429, 296],
            [567, 296],
            [567, 222],
            [608, 222],
            [608, 296],
            [696, 296],
          ],
          10,
        ),
      ],
      "RELEASES ARE PART OF THE SAME LINE.",
      "timeline",
      "2027 / FIRST EDITION     2031 / A NEW CHAPTER     2036 / TODAY",
    );
    const g = publisherGrid(id);
    list = [
      make(
        "HL-01",
        "One line → Hangul",
        "Language / anatomy",
        "The open spiral straightens into ㄹ. Only for the syllable 루 does the continuous source separate into consonant and vowel; the pieces rejoin before returning to the loop.",
        [b, r, ru, ru, r, b],
        12000,
      ),
      make(
        "HL-02",
        "A line with direction",
        "Navigation",
        "Follow the endpoint: the square spiral uncoils into an ascending route, then retraces its terminal corner to draw the arrow. One unbroken path throughout.",
        [b, d, d, b],
      ),
      make(
        "HL-03",
        "Loop → application frame",
        "Software / hero",
        "The spiral’s outer turns form the application perimeter; its inward tail becomes the sidebar and header. One path draws both frame and interface architecture.",
        [b, w, w, b],
      ),
      make(
        "HL-04",
        "Loop → release history",
        "Release / timeline",
        "The same continuous line becomes a publishing baseline with three rising edition markers. Every rise returns to the baseline before the next begins.",
        [b, timeline, timeline, b],
      ),
      make(
        "HL-05",
        "Loop → publishing grid",
        "Catalog / registration",
        "The line travels down the first column, up the second, around the perimeter and across the central rule. A whole publishing grid, drawn without lifting the pen.",
        [b, g, g, b],
      ),
    ];
  } else {
    const anatomy = pose(
      [
        vowel(220, 194, 128, false, 18),
        stroke(
          [
            [584, 135],
            [584, 202],
            [546, 202],
            [584, 202],
            [584, 267],
          ],
          18,
        ),
        vowel(580, 357, 128, true, 18),
        stroke(
          [
            [216, 276],
            [216, 341],
            [254, 341],
            [216, 341],
            [216, 406],
          ],
          18,
        ),
      ],
      "ㅜ / ㅓ / ㅗ / ㅏ",
      "anatomy",
      "FOUR VOWEL MODULES / MIRRORED, NEVER SHUTTERS",
    );
    const g = publisherGrid(id),
      p = portal(id, true),
      n = portal(id, false);
    list = [
      make(
        "HA-01",
        "The four vowel modules",
        "Hangul anatomy",
        "The top, right, bottom and left modules move apart as ㅜ, ㅓ, ㅗ and ㅏ. Their stems keep their direction; their mirrored relationship reforms the central square.",
        [b, anatomy, anatomy, b],
      ),
      make(
        "HA-02",
        "Modules → application",
        "Software / hero",
        "The four bars become the four window edges. Their short stems extend into a status tick, an audio rail, a sidebar and a header. Branches retain their original owners.",
        [b, w, w, b],
      ),
      make(
        "HA-03",
        "Modules → registration",
        "Publishing grid",
        "Each bar takes a side of the page. The four short stems grow across it as alignment rails: the negative space becomes the publishing surface.",
        [b, g, g, b],
      ),
      make(
        "HA-04",
        "One grammar, six products",
        "Product icon family",
        "Four branched modules become sound amplitudes, a growing note, a focus field, a forecast, balanced spending and tomorrow’s steps. All six retain the same four owners.",
        [b, ...names.map((_, i) => roundTwoProduct(id, i)), b],
        19000,
      ),
      make(
        "HA-05",
        "Space becomes the next page",
        "Page transition / reveal",
        "The stems turn outward as the bars become a viewport. The central negative space is a moving crop of the next publication, which grows directly out of the mark.",
        [b, n, p, p, n, b],
        12000,
      ),
    ];
  }
  cached.set(id, list);
  return list;
}

export function roundTwoReel(id: RoundTwoIdentity): Transformation {
  const b = roundTwoBase(id);
  return make(
    "REEL",
    "One mark, a publishing world",
    "Connected identity reel",
    "Resting geometry → language → software → product → publication → return. Follow the same few primary strokes throughout.",
    [
      b,
      roundTwoTransformations(id)[0].frames[1].pose,
      application(id),
      roundTwoProduct(id, 0),
      publication(id),
      b,
    ],
    19000,
  );
}
