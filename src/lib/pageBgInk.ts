/**
 * Derive trail ink from `--page-bg` (hex from the color picker): complementary hue,
 * light stroke on dark backgrounds and dark stroke on light ones.
 */

export type InkColors = {
  r: number;
  g: number;
  b: number;
  /** Softer RGB for shadow / wash (same hue family, tuned for contrast). */
  shadowR: number;
  shadowG: number;
  shadowB: number;
};

let cachedRaw = "";
let cached: InkColors | null = null;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace(/^#/, "").trim();
  if (m.length === 3 && /^[0-9a-fA-F]{3}$/.test(m)) {
    return {
      r: parseInt(m[0]! + m[0]!, 16),
      g: parseInt(m[1]! + m[1]!, 16),
      b: parseInt(m[2]! + m[2]!, 16),
    };
  }
  if (m.length === 6 && /^[0-9a-fA-F]{6}$/.test(m)) {
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16),
    };
  }
  return null;
}

function parseCssColorToRgb(
  raw: string,
): { r: number; g: number; b: number } | null {
  const fromHex = hexToRgb(raw);
  if (fromHex) return fromHex;
  const m = raw.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i,
  );
  if (m) {
    return {
      r: Math.min(255, Math.max(0, Math.round(Number(m[1])))),
      g: Math.min(255, Math.max(0, Math.round(Number(m[2])))),
      b: Math.min(255, Math.max(0, Math.round(Number(m[3])))),
    };
  }
  return null;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): {
  r: number;
  g: number;
  b: number;
} {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return {
    r: Math.round(Math.min(255, Math.max(0, (rp + m) * 255))),
    g: Math.round(Math.min(255, Math.max(0, (gp + m) * 255))),
    b: Math.round(Math.min(255, Math.max(0, (bp + m) * 255))),
  };
}

/** WCAG relative luminance (sRGB). */
function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

const FALLBACK_BG = "#faf9f6";

export function getInkFromPageBg(): InkColors {
  const raw =
    (typeof document !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--page-bg")
          .trim()
      : FALLBACK_BG) || FALLBACK_BG;

  if (raw === cachedRaw && cached) {
    return cached;
  }

  const rgb = parseCssColorToRgb(raw) ?? parseCssColorToRgb(FALLBACK_BG)!;
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const compH = (h + 180) % 360;
  const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);
  const darkBg = lum < 0.45;

  let ink: { r: number; g: number; b: number };
  let shadow: { r: number; g: number; b: number };

  if (darkBg) {
    const sat = Math.min(0.22, 0.1 + s * 0.35);
    ink = hslToRgb(compH, sat, 0.9);
    shadow = {
      r: Math.round(ink.r * 0.55 + 40 * 0.45),
      g: Math.round(ink.g * 0.55 + 38 * 0.45),
      b: Math.round(ink.b * 0.58 + 52 * 0.42),
    };
  } else {
    const sat = Math.min(0.42, 0.26 + s * 0.35);
    ink = hslToRgb(compH, sat, 0.24);
    shadow = {
      r: Math.round(ink.r * 0.72),
      g: Math.round(ink.g * 0.72),
      b: Math.round(ink.b * 0.72),
    };
  }

  cachedRaw = raw;
  cached = {
    r: ink.r,
    g: ink.g,
    b: ink.b,
    shadowR: Math.min(255, Math.max(0, shadow.r)),
    shadowG: Math.min(255, Math.max(0, shadow.g)),
    shadowB: Math.min(255, Math.max(0, shadow.b)),
  };
  return cached;
}
