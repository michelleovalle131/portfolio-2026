import stampImageUrls from "virtual:hero-imgs";

/**
 * Hero gallery photos live under `public/imgs/hero-imgs/` (served as
 * `/imgs/hero-imgs/...`). URLs are collected at build time via
 * `virtual:hero-imgs` in `vite.config.ts`.
 */
export const STAMP_IMAGE_URLS: string[] = stampImageUrls;

/** "/imgs/hero-imgs/Company%20Hub%20App.png" → "Company Hub App" */
export function printTitleFromSrc(src: string): string {
  const file = src.split("/").pop() ?? "";
  let name = file;
  try {
    name = decodeURIComponent(file);
  } catch {
    /* leave as is */
  }
  return name.replace(/\.[a-z0-9]+$/i, "");
}
