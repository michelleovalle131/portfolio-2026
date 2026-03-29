/**
 * WCAG relative luminance (sRGB) for picking light vs dark foreground on --page-bg.
 */

export function parseCssColorToRgb(
  css: string,
): { r: number; g: number; b: number } | null {
  const t = css.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(t);
  if (short) {
    const h = short[1]!;
    return {
      r: parseInt(h[0]! + h[0], 16),
      g: parseInt(h[1]! + h[1], 16),
      b: parseInt(h[2]! + h[2], 16),
    };
  }
  const long = /^#([0-9a-f]{6})$/i.exec(t);
  if (long) {
    const h = long[1]!;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(t);
  if (rgb) {
    return { r: +rgb[1]!, g: +rgb[2]!, b: +rgb[3]! };
  }
  return null;
}

function channelToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const R = channelToLinear(rgb.r);
  const G = channelToLinear(rgb.g);
  const B = channelToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** True when the background is dark enough that light hero type reads better. */
export function isDarkPageBackground(cssColor: string): boolean {
  const rgb = parseCssColorToRgb(cssColor);
  if (!rgb) {
    return false;
  }
  return relativeLuminance(rgb) < 0.5;
}
