/** Lab-only vector topology. A piece keeps its identity throughout a morph. */
export type Identity = "hangul" | "horizon" | "aperture";
export type Point = readonly [number, number];
export type Piece = { points: Point[]; width: number; solid?: boolean };
export type Pose = {
  pieces: Piece[];
  caption?: string;
  detail?: string;
  kind?: string;
};
export type Frame = { at: number; pose: Pose };
export type Transformation = {
  id: string;
  name: string;
  purpose: string;
  continuity: string;
  duration: number;
  frames: Frame[];
};
export const identities = [
  {
    id: "hangul" as const,
    name: "Hangul Flow",
    code: "A",
    premise: "Language becomes a living structure.",
    anatomy:
      "The loop and bars of ㅎ, the branching staff of ㅏ, and the stepped rhythm of ㄹ become a connected directional ligature.",
  },
  {
    id: "horizon" as const,
    name: "Horizon Core",
    code: "B",
    premise: "A threshold. A core. A new possibility.",
    anatomy:
      "An off-centre core sits inside a broken arch. A stepped horizon makes the crossing between one state and the next visible.",
  },
  {
    id: "aperture" as const,
    name: "Solar Aperture",
    code: "C",
    premise: "What is hidden becomes published.",
    anatomy:
      "Eight unequal shutters surround an offset square of light. Their flat edges can become the architecture of an application.",
  },
];

const SAMPLES = 40;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export function sampled(points: Point[], count = SAMPLES): Point[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++)
    lengths.push(
      lengths[i - 1] +
        Math.hypot(
          points[i][0] - points[i - 1][0],
          points[i][1] - points[i - 1][1],
        ),
    );
  const total = lengths[lengths.length - 1];
  if (!total) return Array.from({ length: count }, () => points[0]);
  return Array.from({ length: count }, (_, i) => {
    const d = (i / (count - 1)) * total;
    let j = 1;
    while (j < lengths.length - 1 && lengths[j] < d) j++;
    const t = (d - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1);
    return [
      lerp(points[j - 1][0], points[j][0], t),
      lerp(points[j - 1][1], points[j][1], t),
    ];
  });
}
const line = (a: Point, b: Point, width = 11): Piece => ({
  points: sampled([a, b]),
  width,
});
const poly = (points: Point[], width = 11, solid = false): Piece => ({
  points: sampled(solid ? [...points, points[0]] : points),
  width,
  solid,
});
const arc = (
  x: number,
  y: number,
  r: number,
  from = 0,
  to = Math.PI * 2,
  width = 11,
  solid = false,
): Piece => ({
  points: Array.from({ length: SAMPLES }, (_, i) => [
    x + Math.cos(lerp(from, to, i / (SAMPLES - 1))) * r,
    y + Math.sin(lerp(from, to, i / (SAMPLES - 1))) * r,
  ]),
  width,
  solid,
});
const rect = (x: number, y: number, w: number, h: number, solid = true) =>
  poly(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    solid ? 0 : 8,
    solid,
  );
const move = (p: Piece, x: number, y: number, scale = 1): Piece => ({
  ...p,
  points: p.points.map(([a, b]) => [
    (a - 400) * scale + 400 + x,
    (b - 250) * scale + 250 + y,
  ]),
});
function segments(points: Point[], width = 11) {
  return points.slice(1).map((p, i) => line(points[i], p, width));
}

function hangulWord(): Piece[] {
  const rieul = (x: number) =>
    segments(
      [
        [x, 160],
        [x + 90, 160],
        [x + 90, 200],
        [x, 200],
        [x, 240],
        [x + 90, 240],
      ],
      12,
    );
  return [
    arc(187, 241, 35, 0, Math.PI * 2, 12),
    line([148, 175], [226, 175], 12),
    line([166, 153], [208, 153], 12),
    line([261, 152], [261, 320], 12),
    line([261, 227], [287, 227], 12),
    ...rieul(329),
    line([317, 278], [431, 278], 12),
    line([374, 278], [374, 322], 12),
    ...rieul(488),
    line([476, 316], [590, 316], 12),
    line([533, 274], [533, 316], 12),
  ];
}
export function basePose(identity: Identity): Pose {
  if (identity === "hangul")
    return {
      pieces: [
        ...Array.from({ length: 6 }, (_, i) =>
          arc(
            327,
            260,
            48,
            (i / 6) * Math.PI * 2,
            ((i + 1) / 6) * Math.PI * 2,
            15,
          ),
        ),
        ...segments(
          [
            [277, 177],
            [310, 177],
            [343, 177],
            [376, 177],
          ],
          15,
        ),
        ...segments(
          [
            [414, 166],
            [414, 220],
            [414, 274],
            [414, 328],
          ],
          15,
        ),
        ...segments(
          [
            [414, 208],
            [503, 208],
            [503, 249],
            [460, 249],
            [460, 289],
            [528, 289],
            [528, 329],
            [473, 329],
          ],
          15,
        ),
      ],
    };
  if (identity === "horizon")
    return {
      pieces: [
        arc(400, 270, 102, Math.PI, Math.PI * 1.5, 16),
        arc(400, 270, 102, Math.PI * 1.5, Math.PI * 2, 16),
        line([281, 301], [344, 301], 16),
        line([344, 301], [410, 301], 16),
        line([410, 301], [410, 330], 16),
        line([410, 330], [466, 330], 16),
        line([466, 330], [518, 330], 16),
        arc(434, 248, 28, 0, Math.PI * 2, 0, true),
      ],
    };
  const outer: Point[] = [
    [272, 124],
    [400, 124],
    [528, 124],
    [528, 250],
    [528, 376],
    [400, 376],
    [272, 376],
    [272, 250],
  ];
  const inner: Point[] = [
    [347, 199],
    [402, 190],
    [455, 206],
    [463, 250],
    [445, 301],
    [392, 311],
    [338, 294],
    [336, 241],
  ];
  return {
    pieces: outer.map((p, i) => {
      const n = (i + 1) % 8,
        q = outer[n],
        a = inner[i],
        b = inner[n];
      return poly(
        [
          [lerp(p[0], q[0], 0.035), lerp(p[1], q[1], 0.035)],
          [lerp(q[0], p[0], 0.035), lerp(q[1], p[1], 0.035)],
          [lerp(b[0], a[0], 0.065), lerp(b[1], a[1], 0.065)],
          [lerp(a[0], b[0], 0.065), lerp(a[1], b[1], 0.065)],
        ],
        0,
        true,
      );
    }),
  };
}

function windowPose(identity: Identity): Pose {
  const hf = [
    ...Array.from({ length: 6 }, (_, i) =>
      arc(481, 312, 12, (i / 6) * Math.PI * 2, ((i + 1) / 6) * Math.PI * 2, 6),
    ),
    ...segments(
      [
        [160, 104],
        [320, 104],
        [480, 104],
        [640, 104],
      ],
      6,
    ),
    ...segments(
      [
        [160, 104],
        [160, 202],
        [160, 300],
        [160, 398],
      ],
      6,
    ),
    line([160, 154], [640, 154], 5),
    line([640, 104], [640, 398], 6),
    line([640, 398], [160, 398], 6),
    line([288, 154], [288, 398], 5),
    line([345, 312], [585, 312], 6),
    line([608, 265], [608, 356], 5),
    line([608, 356], [321, 356], 5),
  ];
  const hc = [
    poly(
      [
        [160, 250],
        [160, 104],
        [400, 104],
      ],
      7,
    ),
    poly(
      [
        [400, 104],
        [640, 104],
        [640, 398],
      ],
      7,
    ),
    line([160, 398], [640, 398], 7),
    line([160, 250], [160, 398], 7),
    line([160, 154], [640, 154], 5),
    line([288, 154], [288, 398], 5),
    line([336, 312], [584, 312], 5),
    arc(483, 312, 13, 0, Math.PI * 2, 0, true),
  ];
  const sa = [
    rect(160, 104, 236, 9),
    rect(401, 104, 239, 9),
    poly(
      [
        [640, 117],
        [640, 282],
        [631, 282],
        [631, 117],
      ],
      0,
      true,
    ),
    poly(
      [
        [640, 287],
        [640, 402],
        [631, 402],
        [631, 287],
      ],
      0,
      true,
    ),
    poly(
      [
        [627, 402],
        [401, 402],
        [401, 393],
        [627, 393],
      ],
      0,
      true,
    ),
    poly(
      [
        [396, 402],
        [160, 402],
        [160, 393],
        [396, 393],
      ],
      0,
      true,
    ),
    poly(
      [
        [160, 389],
        [160, 157],
        [280, 157],
        [280, 389],
      ],
      0,
      true,
    ),
    poly(
      [
        [160, 151],
        [160, 117],
        [627, 117],
        [627, 151],
      ],
      0,
      true,
    ),
  ];
  return {
    pieces: identity === "hangul" ? hf : identity === "horizon" ? hc : sa,
    caption: "SORI / SOUND, IN YOUR HANDS.",
    detail: "APPLICATION STUDY · NOT RELEASED",
    kind: "window",
  };
}
function gridPose(identity: Identity): Pose {
  let pieces: Piece[];
  if (identity === "hangul")
    pieces = [
      ...Array.from({ length: 6 }, (_, i) =>
        line([128 + i * 108, 86], [128 + i * 108, 414], 3),
      ),
      ...Array.from({ length: 6 }, (_, i) =>
        line([104, 92 + i * 62], [696, 92 + i * 62], 3),
      ),
      ...[0, 1, 2, 3].map((i) =>
        poly(
          [
            [i % 2 ? 714 : 86, i < 2 ? 100 : 400],
            [i % 2 ? 714 : 86, i < 2 ? 70 : 430],
            [i % 2 ? 684 : 116, i < 2 ? 70 : 430],
          ],
          3,
        ),
      ),
      line([150, 447], [245, 447], 4),
      line([320, 447], [405, 447], 4),
      line([480, 447], [610, 447], 4),
    ];
  else
    pieces = [0, 1, 2, 3]
      .map((i) =>
        identity === "aperture"
          ? rect(118 + i * 185, 78, 5, 342)
          : line([118 + i * 185, 78], [118 + i * 185, 420], 4),
      )
      .concat(
        [0, 1, 2, 3].map((i) =>
          identity === "aperture"
            ? rect(96, 92 + i * 106, 610, 5)
            : line([96, 92 + i * 106], [706, 92 + i * 106], 4),
        ),
      );
  return {
    pieces,
    caption: "A PLACE FOR EVERY EDITION.",
    detail: "01 SORI     02 NAMU     03 GOYO",
    kind: "grid",
  };
}
function sealPose(identity: Identity): Pose {
  const count = identity === "hangul" ? 19 : 8;
  const pieces = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2,
      b = ((i + 0.91) / count) * Math.PI * 2;
    if (identity !== "aperture")
      return arc(
        400,
        250,
        i % 3 === 0 ? 150 : 136,
        a,
        b,
        identity === "hangul" ? 9 : 14,
      );
    const points: Point[] = [];
    for (let j = 0; j <= 10; j++)
      points.push([
        400 + Math.cos(lerp(a, b, j / 10)) * 156,
        250 + Math.sin(lerp(a, b, j / 10)) * 156,
      ]);
    for (let j = 10; j >= 0; j--)
      points.push([
        400 + Math.cos(lerp(a, b, j / 10)) * 129,
        250 + Math.sin(lerp(a, b, j / 10)) * 129,
      ]);
    return poly(points, 0, true);
  });
  return {
    pieces,
    caption: "PUBLISHED",
    detail: "HARULO STUDIO / EDITION 01",
    kind: "seal",
  };
}
function directionPose(): Pose {
  const points: Point[] = [
    [112, 338],
    [225, 338],
    [225, 272],
    [380, 272],
    [380, 196],
    [575, 196],
    [649, 122],
  ];
  const sampledPath = sampled(points, 18);
  return {
    pieces: [
      ...segments(sampledPath, 13),
      line([581, 122], [649, 122], 13),
      line([649, 122], [649, 190], 13),
    ],
    caption: "TOWARD THE NEXT POSSIBILITY.",
    detail: "OBSERVE → BUILD → PUBLISH",
    kind: "direction",
  };
}
function editionPose(): Pose {
  const pieces = [
    ...segments(
      [
        [253, 82],
        [547, 82],
        [547, 418],
        [253, 418],
        [253, 82],
      ],
      7,
    ),
    line([253, 142], [547, 142], 5),
    line([253, 354], [547, 354], 5),
    ...Array.from({ length: 6 }, (_, i) =>
      line(
        [301 + i * 37, 290 - [27, 58, 82, 66, 40, 16][i]],
        [301 + i * 37, 303],
        15,
      ),
    ),
    line([279, 383], [340, 383], 5),
    line([407, 383], [520, 383], 5),
    ...segments(
      [
        [281, 168],
        [281, 198],
        [305, 198],
        [305, 168],
        [281, 168],
      ],
      4,
    ),
    line([328, 184], [405, 184], 5),
  ];
  return {
    pieces,
    caption: "SORI / 01",
    detail: "SOFTWARE EDITION · v4.8.2",
    kind: "edition",
  };
}

export function productPose(identity: Identity, index: number): Pose {
  // Six silhouettes, one construction language. No raster swaps between family members.
  const count = identity === "hangul" ? 19 : 8;
  const names = ["SORI", "NAMU", "GOYO", "HARU WEATHER", "DAMI", "MORROW"];
  const splitStrokes = (strokes: Piece[], count: number) =>
    strokes.flatMap((stroke, i) => {
      const n =
        Math.floor(count / strokes.length) +
        (i < count % strokes.length ? 1 : 0);
      const points = sampled(stroke.points, n * (SAMPLES - 1) + 1);
      return Array.from({ length: n }, (_, j) => ({
        ...stroke,
        points: points.slice(j * (SAMPLES - 1), (j + 1) * (SAMPLES - 1) + 1),
      }));
    });
  if (identity === "hangul") {
    // Continuous loop / branch / step logic, rather than nineteen unrelated stripes.
    const vocabulary = [
      [
        arc(329, 265, 40, 0, Math.PI * 2, 14),
        poly(
          [
            [388, 176],
            [388, 327],
          ],
          14,
        ),
        poly(
          [
            [388, 215],
            [473, 215],
            [473, 253],
            [441, 253],
            [441, 295],
            [518, 295],
          ],
          14,
        ),
      ],
      [
        poly(
          [
            [400, 160],
            [400, 301],
          ],
          14,
        ),
        poly(
          [
            [302, 178],
            [302, 224],
            [400, 259],
            [495, 224],
            [495, 178],
          ],
          14,
        ),
        poly(
          [
            [331, 148],
            [331, 178],
            [400, 207],
            [469, 178],
            [469, 148],
          ],
          14,
        ),
        arc(400, 329, 25, 0, Math.PI * 2, 14),
      ],
      [
        arc(400, 250, 101, -0.7, Math.PI * 1.78, 14),
        poly(
          [
            [441, 231],
            [466, 231],
            [466, 268],
            [416, 268],
          ],
          14,
        ),
        line([400, 180], [400, 217], 14),
      ],
      [
        arc(384, 267, 80, Math.PI, Math.PI * 2, 14),
        poly(
          [
            [293, 306],
            [390, 306],
            [390, 332],
            [506, 332],
          ],
          14,
        ),
        line([469, 199], [512, 199], 14),
        line([490, 177], [490, 221], 14),
      ],
      [
        arc(319, 188, 23, 0, Math.PI * 2, 14),
        poly(
          [
            [373, 160],
            [475, 160],
            [475, 213],
            [373, 213],
          ],
          14,
        ),
        poly(
          [
            [321, 260],
            [426, 260],
            [426, 314],
            [321, 314],
          ],
          14,
        ),
        line([474, 277], [474, 331], 14),
      ],
      [
        poly(
          [
            [291, 327],
            [352, 327],
            [352, 271],
            [414, 271],
            [414, 215],
            [502, 215],
          ],
          14,
        ),
        poly(
          [
            [459, 174],
            [502, 174],
            [502, 215],
          ],
          14,
        ),
        arc(307, 190, 24, 0, Math.PI * 2, 14),
      ],
    ];
    return {
      pieces: splitStrokes(vocabulary[index], count),
      caption: names[index],
      detail: "A HARULO STUDIO EDITION",
      kind: "family",
    };
  }
  if (identity === "horizon") {
    // Every sibling has a core, and a threshold which serves a different purpose.
    const vocabulary = [
      [
        arc(335, 249, 76, -1.05, 1.05, 13),
        arc(335, 249, 125, -1.05, 1.05, 13),
        poly(
          [
            [287, 351],
            [402, 351],
            [402, 330],
            [503, 330],
          ],
          13,
        ),
      ],
      [
        line([400, 211], [400, 326], 13),
        poly(
          [
            [309, 208],
            [309, 247],
            [400, 280],
            [491, 247],
            [491, 208],
          ],
          13,
        ),
        poly(
          [
            [290, 346],
            [414, 346],
            [414, 367],
            [506, 367],
          ],
          13,
        ),
      ],
      [arc(400, 250, 103, 0.4, Math.PI * 2 - 0.4, 14)],
      [
        arc(393, 272, 101, Math.PI, Math.PI * 2, 14),
        poly(
          [
            [280, 306],
            [401, 306],
            [401, 332],
            [512, 332],
          ],
          14,
        ),
      ],
      [
        poly(
          [
            [292, 160],
            [369, 160],
            [369, 207],
            [465, 207],
          ],
          13,
        ),
        poly(
          [
            [292, 242],
            [369, 242],
            [369, 286],
            [465, 286],
          ],
          13,
        ),
        poly(
          [
            [292, 328],
            [407, 328],
            [407, 350],
            [500, 350],
          ],
          13,
        ),
      ],
      [
        poly(
          [
            [286, 332],
            [353, 332],
            [353, 274],
            [419, 274],
            [419, 216],
            [487, 216],
          ],
          14,
        ),
        line([286, 367], [487, 367], 10),
      ],
    ];
    const cores: Point[] = [
      [316, 249],
      [400, 167],
      [418, 250],
      [431, 244],
      [493, 176],
      [487, 165],
    ];
    return {
      pieces: [
        ...splitStrokes(vocabulary[index], 7),
        arc(cores[index][0], cores[index][1], 24, 0, Math.PI * 2, 0, true),
      ],
      caption: names[index],
      detail: "A HARULO STUDIO EDITION",
      kind: "family",
    };
  }
  const pieces = Array.from({ length: count }, (_, i) => {
    const t = i / count,
      a = t * Math.PI * 2;
    if (index === 0) {
      const h = 35 + Math.sin(((i + 1) / (count + 1)) * Math.PI) * 150;
      return rect(287 + t * 226, 250 - h / 2, 16, h);
    }
    if (index === 1) {
      const row = Math.floor(i / 2),
        y = 163 + (row / Math.ceil(count / 2)) * 177,
        side = i % 2 ? 1 : -1;
      return poly(
        [
          [399, y + 30],
          [399 + side * 90, y],
          [399 + side * 90, y + 20],
          [399, y + 48],
        ],
        0,
        true,
      );
    }
    if (index === 2) {
      const start = a + 0.03,
        end = a + (Math.PI * 2) / count - 0.03;
      return poly(
        [
          [400 + Math.cos(start) * 110, 250 + Math.sin(start) * 110],
          [400 + Math.cos(end) * 110, 250 + Math.sin(end) * 110],
          [400 + Math.cos(end) * 68, 250 + Math.sin(end) * 68],
          [400 + Math.cos(start) * 68, 250 + Math.sin(start) * 68],
        ],
        0,
        true,
      );
    }
    if (index === 3) {
      const x = 286 + t * 227,
        y = 287 - Math.sin(t * Math.PI) * 99;
      return rect(x, y, 18, 321 - y);
    }
    if (index === 4) {
      const y = 157 + t * 180,
        w = 38 + (i % 3) * 28;
      return rect(335, y, w, 17);
    }
    const x = 284 + t * 210,
      y = 325 - t * 148;
    return poly(
      [
        [x, y],
        [x + 21, y - 15],
        [x + 21, y + 38],
        [x, y + 53],
      ],
      0,
      true,
    );
  });
  return {
    pieces,
    caption: names[index],
    detail: "A HARULO STUDIO EDITION",
    kind: "family",
  };
}
function portalPose(identity: Identity, scale: number): Pose {
  const base = basePose(identity);
  return {
    pieces: base.pieces.map((p) => move(p, 0, 0, scale)),
    caption: "A NEW DAY. A NEW PAGE.",
    detail: "THE IDENTITY BECOMES THE THRESHOLD",
    kind: "portal",
  };
}
function make(
  id: string,
  name: string,
  purpose: string,
  continuity: string,
  poses: Pose[],
  duration = 6500,
): Transformation {
  // Align closed contours once, not per frame. Matching winding and cyclic phase
  // prevents shutter corners twisting through themselves on the way to a frame.
  const area = (points: Point[]) =>
    points.reduce((sum, p, i) => {
      const q = points[(i + 1) % points.length];
      return sum + p[0] * q[1] - q[0] * p[1];
    }, 0);
  const align = (source: Piece, target: Piece): Piece => {
    if (!source.solid || !target.solid) return target;
    let points = target.points.slice(0, -1);
    if (area(source.points) * area(points) < 0) points = points.reverse();
    let best = 0,
      distance = Infinity;
    for (let offset = 0; offset < points.length; offset++) {
      const cost = points.reduce((sum, _, i) => {
        const p = points[(i + offset) % points.length],
          q = source.points[i];
        return sum + (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
      }, 0);
      if (cost < distance) {
        distance = cost;
        best = offset;
      }
    }
    const shifted = points.map((_, i) => points[(i + best) % points.length]);
    return { ...target, points: [...shifted, shifted[0]] };
  };
  const frames: Frame[] = [];
  poses.forEach((pose, i) => {
    const previous = frames[i - 1]?.pose;
    const resolved = previous
      ? pose === poses[i - 1]
        ? previous
        : {
            ...pose,
            pieces: pose.pieces.map((piece, n) =>
              align(previous.pieces[n], piece),
            ),
          }
      : pose;
    frames.push({ at: i / (poses.length - 1), pose: resolved });
  });
  return {
    id,
    name,
    purpose,
    continuity,
    duration,
    frames,
  };
}
export function transformations(identity: Identity): Transformation[] {
  const b = basePose(identity),
    w = windowPose(identity),
    g = gridPose(identity),
    s = sealPose(identity);
  if (identity === "hangul") {
    const word = {
      pieces: hangulWord(),
      caption: "하루로",
      detail: "A DAY → TOWARD A BETTER DAY",
      kind: "language",
    };
    const day = {
      ...word,
      pieces: word.pieces.map((p, i) => (i >= 12 ? word.pieces[i - 7] : p)),
      caption: "하루",
      detail: "THE DIRECTION IS ALREADY IN THE DAY",
    };
    return [
      make(
        "HF-01",
        "하루 → 하루로",
        "Introduction",
        "The ㄹ strokes travel out of 루; the lower staff turns upward to complete 로. Nothing is typeset over the geometry.",
        [day, word, word],
      ),
      make(
        "HF-02",
        "Language → ligature",
        "Logo signature",
        "The 19 Hangul strokes reorganize into a loop, a branching staff, and one stepped directional ribbon.",
        [word, b, b],
      ),
      make(
        "HF-03",
        "A stroke finds a way",
        "Navigation",
        "The circular fragments open into one continuous rising path. Its last two strokes become the destination arrow.",
        [b, directionPose(), directionPose(), b],
      ),
      make(
        "HF-04",
        "Language → application",
        "Product / hero",
        "The loop stays intact as it becomes an audio control. The bar and staff open the window frame; the stepped ribbon separates into interface rails.",
        [b, w, w, b],
        8000,
      ),
      make(
        "HF-05",
        "The publishing grid",
        "Page transition",
        "Every stroke extends into a registration rail. The mark becomes the layout that receives the next edition.",
        [b, g, g, b],
        8000,
      ),
      make(
        "HF-06",
        "An edition takes shape",
        "Release / imprint",
        "The logo opens into the cover, sound bars and edition rails of a Sori publication, then returns to its imprint.",
        [b, editionPose(), editionPose(), b],
        8000,
      ),
    ];
  }
  if (identity === "horizon") {
    const low = {
      pieces: b.pieces.map((p, i) =>
        i === 7
          ? move(p, -34, 84, 0.45)
          : {
              ...p,
              points: p.points.map(
                ([x, y]) => [x, lerp(314, y, 0.09)] as Point,
              ),
            },
      ),
    };
    const arcPose = (x: number, y: number): Pose => ({
      pieces: [
        arc(400, 330, 180, Math.PI, Math.PI * 1.5, 5),
        arc(400, 330, 180, Math.PI * 1.5, Math.PI * 2, 5),
        line([200, 351], [300, 351], 5),
        line([300, 351], [400, 351], 5),
        line([400, 351], [400, 381], 5),
        line([400, 351], [500, 351], 5),
        line([500, 351], [600, 351], 5),
        arc(x, y, 23, 0, Math.PI * 2, 0, true),
      ],
      caption: "ONE DAY. MANY POSSIBILITIES.",
      detail: "06:00                    12:00                    18:00",
      kind: "arc",
    });
    const control = {
      ...w,
      pieces: w.pieces.map((p, i) => (i === 7 ? move(p, 72, 0) : p)),
      caption: "YOUR DAY. YOUR LEVEL.",
    };
    return [
      make(
        "HC-01",
        "Cross the threshold",
        "Introduction / loading",
        "The compressed arch opens while the core rises through the stepped threshold into its settled position.",
        [low, b, b],
      ),
      make(
        "HC-02",
        "The whole day",
        "Timeline",
        "The arch unfurls into a day arc. The same core crosses dawn, the apex and dusk before returning.",
        [
          b,
          arcPose(220, 330),
          arcPose(273, 203),
          arcPose(400, 150),
          arcPose(527, 203),
          arcPose(580, 330),
          b,
        ],
        11000,
      ),
      make(
        "HC-03",
        "Horizon → structure",
        "Publishing grid",
        "The broken horizon straightens into publication rails; the arch separates into the vertical columns.",
        [b, g, g, b],
        8000,
      ),
      make(
        "HC-04",
        "The core is a control",
        "Software interaction",
        "The arch becomes the window; the core becomes an audio control and moves along its own horizon.",
        [b, w, control, w, b],
        9500,
      ),
      make(
        "HC-05",
        "Across the eclipse",
        "Page transition",
        "The core expands across the frame as the arch becomes the outer threshold; the destination emerges in the returning geometry.",
        [
          b,
          {
            ...b,
            pieces: b.pieces.map((p, i) =>
              move(p, i === 7 ? -34 : 0, i === 7 ? 2 : 0, i === 7 ? 18 : 3),
            ),
          },
          w,
          w,
          b,
        ],
        9500,
      ),
      make(
        "HC-06",
        "A horizon opens",
        "Application viewport",
        "The two levels of the horizon separate into the upper and lower edges of a viewport; the core stays inside as a focus point.",
        [
          b,
          {
            ...w,
            pieces: w.pieces.map((p) => ({
              ...p,
              points: p.points.map(
                ([x, y]) => [x, 250 + (y - 250) * 0.18] as Point,
              ),
            })),
          },
          w,
          w,
          b,
        ],
        9000,
      ),
    ];
  }
  const closed = {
    pieces: b.pieces.map((p) => ({
      ...p,
      points: p.points.map(([x, y], i) =>
        i > 20 && i < 37
          ? ([lerp(x, 400, 0.8), lerp(y, 250, 0.8)] as Point)
          : ([x, y] as Point),
      ),
    })),
  };
  return [
    make(
      "SA-01",
      "Open the possibility",
      "Reveal / loading",
      "The shutters pivot apart. Their negative space is the reveal, not a second graphic placed over the logo.",
      [closed, b, portalPose(identity, 1.75), b],
      8000,
    ),
    make(
      "SA-02",
      "Aperture → application",
      "Product / hero",
      "The eight solid shutters straighten into window edges, a navigation divider and a status rail.",
      [b, w, w, b],
      8000,
    ),
    make(
      "SA-03",
      "Register the release",
      "Publisher seal",
      "The shutters unroll into an interrupted edition seal. The publication sits in the space the logo opens.",
      [b, s, s, b],
      8000,
    ),
    make(
      "SA-04",
      "One publisher, six voices",
      "Product icon family",
      "The same eight pieces become six different silhouettes: sound, growing notes, focus, weather, spending and tomorrow.",
      [b, ...Array.from({ length: 6 }, (_, i) => productPose(identity, i)), b],
      16000,
    ),
    make(
      "SA-05",
      "An expanding catalog",
      "Layout / catalog",
      "Each shutter extends into a horizontal or vertical rail. Eight pieces establish the publication grid.",
      [b, g, g, b],
      8000,
    ),
    make(
      "SA-06",
      "Into the next page",
      "Page transition",
      "The aperture expands beyond the frame; its central opening becomes the next page before the mark reforms.",
      [b, portalPose(identity, 6.5), portalPose(identity, 6.5), w, b],
      9500,
    ),
  ];
}
export function identityReel(identity: Identity): Transformation {
  const b = basePose(identity);
  const poses =
    identity === "hangul"
      ? [
          b,
          { pieces: hangulWord(), caption: "하루로", kind: "language" },
          directionPose(),
          windowPose(identity),
          editionPose(),
          gridPose(identity),
          b,
        ]
      : identity === "horizon"
        ? [
            b,
            gridPose(identity),
            windowPose(identity),
            productPose(identity, 0),
            sealPose(identity),
            b,
          ]
        : [
            b,
            portalPose(identity, 2),
            windowPose(identity),
            productPose(identity, 0),
            productPose(identity, 1),
            sealPose(identity),
            b,
          ];
  return make(
    "REEL",
    "The living identity",
    "Connected identity reel",
    "One topology moves through the entire publishing cycle: identity, environment, application, edition, publication, return.",
    poses,
    19000,
  );
}
export function poseAt(transformation: Transformation, progress: number): Pose {
  const p = Math.max(0, Math.min(1, progress));
  const i = transformation.frames.findIndex((f) => f.at >= p);
  if (i <= 0) return transformation.frames[0].pose;
  const a = transformation.frames[i - 1],
    b = transformation.frames[i];
  const raw = (p - a.at) / (b.at - a.at);
  // Structural response: outer pieces lead, inner pieces follow. A held arrival makes the result readable.
  const pieces = a.pose.pieces.map((piece, index) => {
    const delay = transformation.id.startsWith("HF")
      ? index < 6
        ? 0
        : index < 9
          ? 0.035
          : index < 12
            ? 0.07
            : (index % 3) * 0.025
      : transformation.id.startsWith("HC") && index < 2
        ? 0
        : (index % 4) * 0.025;
    const x = Math.max(0, Math.min(1, (raw - delay) / (0.84 - delay)));
    const t = x * x * x * (x * (x * 6 - 15) + 10);
    const target = b.pose.pieces[index];
    if (!target) return piece;
    return {
      solid: piece.solid || target.solid,
      width: lerp(piece.width, target.width, t),
      points: piece.points.map(
        ([px, py], n) =>
          [
            lerp(px, target.points[n][0], t),
            lerp(py, target.points[n][1], t),
          ] as Point,
      ),
    };
  });
  if (transformation.id === "HC-02" && p >= 1 / 6 && p <= 5 / 6) {
    // The core follows the actual circle, continuously across intermediate states.
    const phase = (p - 1 / 6) / (4 / 6);
    const angle = Math.PI + Math.PI * phase * phase * (3 - 2 * phase);
    pieces[7] = arc(
      400 + Math.cos(angle) * 180,
      330 + Math.sin(angle) * 180,
      23,
      0,
      Math.PI * 2,
      0,
      true,
    );
  }
  return { ...(raw > 0.5 ? b.pose : a.pose), pieces };
}
export function pathData(piece: Piece): string {
  return (
    piece.points
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ") + (piece.solid ? " Z" : "")
  );
}
