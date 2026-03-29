/** Deterministic “tossed” stamp positions as % of canvas (top/left = anchor center). */
export type ScatterSlot = {
  top: number;
  left: number;
  rotate: number;
  scale: number;
  z: number;
};

export function buildScatterSlots(count: number): ScatterSlot[] {
  return Array.from({ length: count }, (_, i) => {
    const top = 6 + ((i * 47 + i * i * 3) % 78);
    const left = 4 + ((i * 61 + (i % 7) * 11) % 88);
    const rotate = ((i * 17) % 41) - 20;
    const scale = 0.68 + (i % 6) * 0.055;
    return { top, left, rotate, scale, z: i + 1 };
  });
}
