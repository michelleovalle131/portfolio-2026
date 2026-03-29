import stampImageUrls from "virtual:hero-imgs";

/**
 * Stamp photos live under `public/imgs/hero-imgs/` (served as `/imgs/hero-imgs/...`).
 * URLs are collected at build time via `virtual:hero-imgs` in `vite.config.ts`.
 */
export const STAMP_IMAGE_URLS: string[] = stampImageUrls;

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/**
 * Assigns each stamp a distinct photo URL when possible (no duplicate images on screen).
 * Extra stamps use gradient fallbacks, cycling when count exceeds unique photos + fallbacks.
 */
/**
 * Derives a short caption from a stamp `imageBackground` value.
 * When the background includes `url(...)`, uses the file base name (Vite hash
 * segment stripped); otherwise returns "" so callers can fall back to a default.
 */
export function labelFromStampBackground(cssBackground: string): string {
  const m = cssBackground.match(/url\(\s*["']?([^"')]+)["']?\s*\)/);
  if (!m) {
    return "";
  }
  let path = m[1]!.split("?")[0]!;
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep */
  }
  const base = path.split("/").pop() ?? path;
  const noExt = base.replace(/\.[^.]+$/i, "");
  /* Vite asset: `name-[hash]` — strip trailing hash chunk */
  const withoutHash = noExt.replace(/-[A-Za-z0-9_-]{6,12}$/, "");
  return humanizeFileBaseName(withoutHash);
}

function humanizeFileBaseName(s: string): string {
  const t = s
    .replace(/,/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) {
    return "";
  }
  return t.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/**
 * Ensures the last path segment is percent-encoded so commas/spaces in filenames
 * never break CSS `background` parsing; idempotent if already encoded.
 */
function safeUrlForCssBackground(url: string): string {
  const q = url.indexOf("?");
  const base = q >= 0 ? url.slice(0, q) : url;
  const query = q >= 0 ? url.slice(q) : "";
  const lastSlash = base.lastIndexOf("/");
  if (lastSlash < 0) {
    return url;
  }
  const dir = base.slice(0, lastSlash + 1);
  const file = base.slice(lastSlash + 1);
  let encodedFile: string;
  try {
    encodedFile = encodeURIComponent(decodeURIComponent(file));
  } catch {
    encodedFile = encodeURIComponent(file);
  }
  return `${dir}${encodedFile}${query}`;
}

export function uniqueStampBackgrounds(
  count: number,
  imageUrls: readonly string[],
  fallbacks: readonly string[],
): string[] {
  if (imageUrls.length === 0) {
    return Array.from({ length: count }, (_, i) => fallbacks[i % fallbacks.length]!);
  }

  /* Dedupe so Hero / contact stamps never reuse the same photo URL in one pass. */
  const pool = [...new Set(imageUrls)];
  shuffleInPlace(pool);

  return Array.from({ length: count }, (_, i) => {
    if (i < pool.length) {
      const url = safeUrlForCssBackground(pool[i]!);
      /* Single layer only — avoid `, #fff` so commas in filenames cannot be read as layer separators. White shows via `.image` background-color on Stamp. */
      return `url("${url}") center / cover no-repeat`;
    }
    const fbIndex = (i - pool.length) % fallbacks.length;
    return fallbacks[fbIndex]!;
  });
}
