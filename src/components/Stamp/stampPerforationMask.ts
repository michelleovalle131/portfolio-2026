/**
 * Builds full-circle punch positions for a rectangular stamp mask.
 * Centers sit on the outer edges; half of each circle sticks outside the box so
 * the visible cutout is a semicircle (classic perforated edge).
 * Same radius on all edges; counts derived from width/height with centered slack.
 * Center pitch is 3r (notch diameter 2r + flat r between cutouts).
 */

export type StampPunch = { cx: number; cy: number };

export type StampPerforationResult = {
  r: number;
  circles: StampPunch[];
};

/** Center-to-center spacing along an edge: 3r ⇒ flat segment between notches = r. */
const PITCH_FACTOR = 3;

const key = (cx: number, cy: number) =>
  `${Math.round(cx * 100) / 100},${Math.round(cy * 100) / 100}`;

function edgeCenters(length: number, r: number): number[] {
  const pitch = PITCH_FACTOR * r;
  if (length <= 2 * r) return [length / 2];
  const maxSpan = length - 2 * r;
  const n = Math.max(1, Math.floor(maxSpan / pitch) + 1);
  const span = (n - 1) * pitch;
  const slack = maxSpan - span;
  const start = r + slack / 2;
  return Array.from({ length: n }, (_, i) => start + i * pitch);
}

export function buildStampPerforationCircles(
  width: number,
  height: number,
  options: { rTarget?: number; rMin?: number; rMax?: number } = {},
): StampPerforationResult {
  const rTarget = options.rTarget ?? 8;
  const rMin = options.rMin ?? 6;
  const rMax = options.rMax ?? 10;

  if (width < 24 || height < 24) {
    return { r: Math.max(rMin, Math.min(rMax, rTarget)), circles: [] };
  }

  // Rough tooth count for pitch 3r: length ≈ 2r + (n−1)·3r = r(3n − 1)
  let nW = Math.max(3, Math.floor(width / (PITCH_FACTOR * rTarget)));
  let nH = Math.max(3, Math.floor(height / (PITCH_FACTOR * rTarget)));
  let r = Math.min(
    width / (PITCH_FACTOR * nW - 1),
    height / (PITCH_FACTOR * nH - 1),
  );
  r = Math.max(rMin, Math.min(rMax, r));

  const xs = edgeCenters(width, r);
  const ys = edgeCenters(height, r);

  const seen = new Set<string>();
  const circles: StampPunch[] = [];
  const add = (cx: number, cy: number) => {
    const k = key(cx, cy);
    if (seen.has(k)) return;
    seen.add(k);
    circles.push({ cx, cy });
  };

  for (const cx of xs) {
    add(cx, 0);
    add(cx, height);
  }
  for (const cy of ys) {
    add(0, cy);
    add(width, cy);
  }

  return { r, circles };
}
