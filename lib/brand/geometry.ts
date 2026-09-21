/** The approved 06 · High Tension master. Do not optically alter these values. */
export const HARULO = Object.freeze({
  viewBox: "0 0 100 100",
  ring: Object.freeze({ cx: 47.5, cy: 41.5, r: 18.25, strokeWidth: 7.25 }),
  satellite: Object.freeze({ cx: 68.9, cy: 29.2, r: 4.35 }),
  primary: Object.freeze({ x: 30, y: 58.5, width: 40, height: 6.8, rx: 3.4 }),
  secondary: Object.freeze({
    x: 39.2,
    y: 67.6,
    width: 21.6,
    height: 5.5,
    rx: 2.75,
  }),
});

export const proportions = Object.freeze({
  tierRatio: HARULO.secondary.width / HARULO.primary.width,
  satelliteRatio: HARULO.satellite.r / HARULO.ring.r,
  strokeRatio: HARULO.ring.strokeWidth / (HARULO.ring.r * 2),
});

/** Asset files are generated from this same source, never redrawn. */
export function markSvg(color = "currentColor", signal = color) {
  const { ring: r, satellite: s, primary: p, secondary: q } = HARULO;
  return `<g fill="${color}"><circle cx="${r.cx}" cy="${r.cy}" r="${r.r}" fill="none" stroke="${color}" stroke-width="${r.strokeWidth}"/><circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${signal}"/><rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" rx="${p.rx}"/><rect x="${q.x}" y="${q.y}" width="${q.width}" height="${q.height}" rx="${q.rx}"/></g>`;
}
