import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { HARULO, markSvg } from "../lib/brand/geometry.ts";
import { EXPECTED_HARULO, assertCanonicalGeometry } from "../lib/brand/verify.ts";

const asset = new URL("../public/brand/harulo-cobalt-ember.svg", import.meta.url);

export function verifySourceGeometry(value) {
  assertCanonicalGeometry(value);
  return true;
}

assertCanonicalGeometry(HARULO);
assert.deepEqual(JSON.parse(JSON.stringify(HARULO)), EXPECTED_HARULO);

const generated = markSvg("#123DFF", "#FF5C35");
for (const [key, value] of [
  ["cx", EXPECTED_HARULO.ring.cx], ["cy", EXPECTED_HARULO.ring.cy],
  ["r", EXPECTED_HARULO.ring.r], ["stroke-width", EXPECTED_HARULO.ring.strokeWidth],
]) assert.match(generated, new RegExp(`${key}="${value}"`));
for (const [key, value] of Object.entries(EXPECTED_HARULO.primary)) assert.match(generated, new RegExp(`${key}="${value}"`));
for (const [key, value] of Object.entries(EXPECTED_HARULO.secondary)) assert.match(generated, new RegExp(`${key}="${value}"`));

const renderedAsset = await readFile(asset, "utf8");
assert.match(renderedAsset, /cx="47\.5" cy="41\.5" r="18\.25"/);
assert.match(renderedAsset, /cx="68\.9" cy="29\.2" r="4\.35"/);
assert.match(renderedAsset, /x="30" y="58\.5" width="40" height="6\.8" rx="3\.4"/);
assert.match(renderedAsset, /x="39\.2" y="67\.6" width="21\.6" height="5\.5" rx="2\.75"/);
console.log("Harulo master geometry, generated SVG, and committed asset verified.");
