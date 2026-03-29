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

/** Measured box + punch data for SVG mask (userSpaceOnUse). */
export type StampMaskGeometry = {
  w: number;
  h: number;
} & StampPerforationResult;

/** Center-to-center spacing along an edge: 3r ⇒ flat segment between notches = r. */
const PITCH_FACTOR = 3;

const key = (cx: number, cy: number) =>
  `${Math.round(cx * 100) / 100},${Math.round(cy * 100) / 100}`;

/** Circle centers along a world-space axis segment [worldStart, worldEnd], inset by r, spaced by `pitch`, phase-aligned. */
function worldCentersAlongAxis(
  worldStart: number,
  worldEnd: number,
  r: number,
  pitch: number,
  phase: number,
): number[] {
  const minCenter = worldStart + r;
  const maxCenter = worldEnd - r;
  if (maxCenter < minCenter) {
    return [(worldStart + worldEnd) / 2];
  }
  let first = minCenter;
  const rem = ((minCenter - phase) % pitch + pitch) % pitch;
  if (rem !== 0) {
    first += pitch - rem;
  }
  const out: number[] = [];
  for (let u = first; u <= maxCenter + 1e-6; u += pitch) {
    out.push(u);
  }
  if (out.length === 0) {
    out.push((minCenter + maxCenter) / 2);
  }
  return out;
}

const DEFAULT_SEAMLESS_R = 8;

/**
 * Same tooth spacing as {@link buildStampPerforationCircles} (pitch = 3r), but punch
 * positions snap to a shared world grid so stamps in one frame share a continuous rhythm.
 *
 * `scallopDensity` > 1 tightens pitch (more notches); e.g. 1.25 ≈ 25% more scallops per edge vs baseline.
 * `pitchExtraPx` widens center-to-center spacing (e.g. 2 ≈ 2px more gap between scallops).
 * `pitchWidthMultiplier` scales that combined pitch (e.g. 2 = double spacing between notches).
 *
 * If `pitchInR` is set, center-to-center spacing is exactly `r × pitchInR` (ignores density / extra / width mult).
 */
export function buildStampPerforationCirclesSeamless(
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  options: {
    r?: number;
    phaseX?: number;
    phaseY?: number;
    /** 1 = default pitch; 1.25 ⇒ ~25% more scallops along each edge. */
    scallopDensity?: number;
    /** Added to pitch after density (px); increases flat gap between notches. */
    pitchExtraPx?: number;
    /** Multiplies center-to-center pitch after density + extra (1 = default). */
    pitchWidthMultiplier?: number;
    /** When set, pitch = r × this (e.g. 1.5 ⇒ 1.5r spacing); overrides density / extra / mult. */
    pitchInR?: number;
  } = {},
): StampPerforationResult {
  const r = options.r ?? DEFAULT_SEAMLESS_R;
  const density = Math.max(
    1.0001,
    options.scallopDensity ?? 1,
  );
  const pitchMult = options.pitchWidthMultiplier ?? 1;
  const pitch =
    options.pitchInR != null
      ? Math.max(r * 0.25, r * options.pitchInR)
      : Math.max(
          r * 0.25,
          ((PITCH_FACTOR * r) / density + (options.pitchExtraPx ?? 0)) * pitchMult,
        );
  const phaseX = options.phaseX ?? 0;
  const phaseY = options.phaseY ?? 0;

  if (width < 2 * r + 4 || height < 2 * r + 4) {
    return { r, circles: [] };
  }

  const wxTop = worldCentersAlongAxis(
    offsetX,
    offsetX + width,
    r,
    pitch,
    phaseX,
  );
  const wySide = worldCentersAlongAxis(
    offsetY,
    offsetY + height,
    r,
    pitch,
    phaseY,
  );

  const seen = new Set<string>();
  const circles: StampPunch[] = [];
  const add = (cx: number, cy: number) => {
    const k = key(cx, cy);
    if (seen.has(k)) return;
    seen.add(k);
    circles.push({ cx, cy });
  };

  for (const wx of wxTop) {
    add(wx - offsetX, 0);
    add(wx - offsetX, height);
  }
  for (const wy of wySide) {
    add(0, wy - offsetY);
    add(width, wy - offsetY);
  }

  return { r, circles };
}

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
