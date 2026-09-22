import { readdir, readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const root = new URL("../dist/client/_next/static/chunks/", import.meta.url);
const names = (await readdir(root)).filter((name) => name.endsWith(".js"));
let total = 0;
const largest = [];
for (const name of names) {
  const bytes = gzipSync(await readFile(new URL(name, root))).byteLength;
  total += bytes;
  largest.push({ name, bytes });
}
largest.sort((a, b) => b.bytes - a.bytes);
console.log(JSON.stringify({ chunkCount: names.length, totalGzipBytes: total, largest: largest.slice(0, 8) }, null, 2));
if (!names.length) throw new Error("No client chunks found; build before running the performance check.");
if (total > 200_000) throw new Error(`All lazy client chunks total ${total} bytes, above the 200 KB aggregate budget.`);
