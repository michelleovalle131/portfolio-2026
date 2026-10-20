import stampImageUrls from "virtual:hero-imgs";

/**
 * Hero gallery photos live under `public/imgs/hero-imgs/` (served as
 * `/imgs/hero-imgs/...`). URLs are collected at build time via
 * `virtual:hero-imgs` in `vite.config.ts`.
 */
export const STAMP_IMAGE_URLS: string[] = stampImageUrls;
