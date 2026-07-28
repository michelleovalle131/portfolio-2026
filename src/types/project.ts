export type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt: string;
};

export type ModalProject = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional rich markdown case-study content shown in the About tab instead of `description`. */
  aboutMarkdown?: string;
  /** Project plate color (CSS value) used as the hero image fallback background. */
  plateColor?: string;
  /**
   * Optional custom gallery media. First item renders as a large featured
   * "hero" tile; the rest fill a 2-column grid below it. Falls back to the
   * single `imageSrc` + placeholder tiles when omitted.
   */
  gallery?: GalleryItem[];
};
