import sharp from "sharp";
// Re-encode the existing original; no generated or altered composition.
for (const width of [640, 1122]) {
  await sharp("public/images/daylight.jpg")
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public/images/daylight-${width}.webp`);
}
