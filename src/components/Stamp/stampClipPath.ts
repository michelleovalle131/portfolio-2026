/** Builds a percentage-based polygon for a perforated “stamp” silhouette. */
export function stampPolygonPercent(
  teethX = 16,
  teethY = 20,
  bite = 1.1
): string {
  const pts: [number, number][] = [];

  const top = teethX;
  for (let i = 0; i <= top; i++) {
    const x = (i / top) * 100;
    const y = i % 2 === 0 ? 0 : bite;
    pts.push([x, y]);
  }

  const right = teethY;
  for (let i = 1; i <= right; i++) {
    const x = 100 - (i % 2 === 0 ? 0 : bite);
    const y = (i / right) * 100;
    pts.push([x, y]);
  }

  const bottom = teethX;
  for (let i = bottom - 1; i >= 0; i--) {
    const x = (i / top) * 100;
    const y = 100 - (i % 2 === 0 ? 0 : bite);
    pts.push([x, y]);
  }

  const left = teethY;
  for (let i = left - 1; i > 0; i--) {
    const x = i % 2 === 0 ? 0 : bite;
    const y = (i / right) * 100;
    pts.push([x, y]);
  }

  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

/**
 * Soft wavy / scalloped rectangle (decorative paper edge), not square perforations.
 * Uses smooth sin² waves along each side — similar to die-cut stationery.
 */
export function scallopedPaperPolygon(
  scallopsPerEdge = 9,
  depthPercent = 2.35,
  segmentsPerScallop = 8,
): string {
  const pts: [number, number][] = [];
  const d = depthPercent;
  const s = Math.max(2, scallopsPerEdge);
  const steps = s * segmentsPerScallop;

  const wave = (t: number) => d * (Math.sin((s * Math.PI * t) / 100) ** 2);

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    pts.push([x, wave(x)]);
  }
  for (let i = 1; i <= steps; i++) {
    const y = (i / steps) * 100;
    pts.push([100 - wave(y), y]);
  }
  for (let i = steps - 1; i >= 0; i--) {
    const x = (i / steps) * 100;
    pts.push([x, 100 - wave(x)]);
  }
  for (let i = steps - 1; i >= 0; i--) {
    const y = (i / steps) * 100;
    pts.push([wave(y), y]);
  }

  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}
