import assert from "node:assert/strict";
import test from "node:test";
import { HARULO, markSvg } from "../../lib/brand/geometry.ts";
import { EXPECTED_HARULO, assertCanonicalGeometry } from "../../lib/brand/verify.ts";

test("canonical geometry matches the independent specification", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(HARULO)), EXPECTED_HARULO);
  assert.match(markSvg("#123DFF", "#FF5C35"), /cx="47\.5" cy="41\.5" r="18\.25"/);
  assert.match(markSvg("#123DFF", "#FF5C35"), /x="39\.2" y="67\.6" width="21\.6" height="5\.5" rx="2\.75"/);
});

test("a mutated coordinate fails even when the original value appears in a comment-like field", () => {
  const mutated = {
    ...HARULO,
    ring: { ...HARULO.ring, cy: 42 },
    __comment: "the original cy was 41.5",
  };
  assert.throws(() => assertCanonicalGeometry(mutated));
});
