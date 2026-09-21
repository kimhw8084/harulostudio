import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../lib/brand/geometry.ts", import.meta.url), "utf8");
const values = [47.5, 41.5, 18.25, 7.25, 68.9, 29.2, 4.35, 30, 58.5, 40, 6.8, 3.4, 39.2, 67.6, 21.6, 5.5, 2.75];
for (const value of values) assert.match(source, new RegExp(`\\b${String(value).replace(".", "\\.")}\\b`));
assert.match(source, /approved 06 · High Tension master/);
console.log("Harulo master geometry verified.");
