/**
 * Stamp photos: add files under `imgs/hero-imgs/` (project root).
 * Vite resolves them at build time; add or remove files and rebuild.
 */
const fromHeroImgs = import.meta.glob<string>(
  "../../../imgs/hero-imgs/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true, import: "default" },
);

export const STAMP_IMAGE_URLS: string[] = Object.values(fromHeroImgs);

/** Each stamp gets an independent random image URL, or fallbacks if the folder is empty. */
export function randomStampBackgrounds(
  count: number,
  imageUrls: readonly string[],
  fallbacks: readonly string[],
): string[] {
  if (imageUrls.length === 0) {
    return fallbacks.slice(0, count);
  }
  return Array.from({ length: count }, () => {
    const url = imageUrls[Math.floor(Math.random() * imageUrls.length)]!;
    /* Solid layer behind image — white mat like michelleovalle.vercel.app polaroids */
    return `url("${url}") center / cover no-repeat, #ffffff`;
  });
}
