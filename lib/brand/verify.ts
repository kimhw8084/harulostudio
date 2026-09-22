export const EXPECTED_HARULO = {
  viewBox: "0 0 100 100",
  ring: { cx: 47.5, cy: 41.5, r: 18.25, strokeWidth: 7.25 },
  satellite: { cx: 68.9, cy: 29.2, r: 4.35 },
  primary: { x: 30, y: 58.5, width: 40, height: 6.8, rx: 3.4 },
  secondary: { x: 39.2, y: 67.6, width: 21.6, height: 5.5, rx: 2.75 },
} as const;

export function assertCanonicalGeometry(value: unknown): asserts value is typeof EXPECTED_HARULO {
  if (JSON.stringify(value) !== JSON.stringify(EXPECTED_HARULO)) {
    throw new Error("Harulo master geometry does not match the independent canonical specification.");
  }
}
