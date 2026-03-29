/**
 * Stamp photos: add files under `imgs/hero-imgs/` (project root).
 * Vite resolves them at build time; add or remove files and rebuild.
 */
const fromHeroImgs = import.meta.glob<string>(
  "../../../imgs/hero-imgs/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true, import: "default" },
);

export const STAMP_IMAGE_URLS: string[] = Object.values(fromHeroImgs);

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
export function uniqueStampBackgrounds(
  count: number,
  imageUrls: readonly string[],
  fallbacks: readonly string[],
): string[] {
  if (imageUrls.length === 0) {
    return Array.from({ length: count }, (_, i) => fallbacks[i % fallbacks.length]!);
  }

  const pool = [...imageUrls];
  shuffleInPlace(pool);

  return Array.from({ length: count }, (_, i) => {
    if (i < pool.length) {
      const url = pool[i]!;
      return `url("${url}") center / cover no-repeat, #ffffff`;
    }
    const fbIndex = (i - pool.length) % fallbacks.length;
    return fallbacks[fbIndex]!;
  });
}
