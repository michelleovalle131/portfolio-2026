import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import type { GalleryItem, ModalProject } from "../../types/project";
import styles from "./ProjectModal.module.css";

const VIDEO_SRC_PATTERN = /\.(mp4|webm)$/i;
const STICKY_BAR_HEIGHT = 56;

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className={styles.mdTitle}>{children}</h1>,
  h2: ({ children }) => <h3 className={styles.mdHeading}>{children}</h3>,
  h3: ({ children }) => <h4 className={styles.mdLabel}>{children}</h4>,
  p: ({ children }) => <p className={styles.mdParagraph}>{children}</p>,
  ul: ({ children }) => <ul className={styles.mdList}>{children}</ul>,
  li: ({ children }) => <li className={styles.mdListItem}>{children}</li>,
  hr: () => <hr className={styles.mdDivider} />,
  em: ({ children }) => <em className={styles.mdEmphasis}>{children}</em>,
};

type ProjectModalProps = {
  project: ModalProject | null;
  onClose: () => void;
};

/** Strips ProjectPage's `[[gallery:0-5]]` inline placement tokens — the modal
 *  shows all gallery media in one continuous section instead of inline. */
function stripGalleryTokens(markdown: string): string {
  return markdown.replace(/\[\[gallery:\d+-\d+\]\]\n?/g, "");
}

/** Drops the markdown's opening paragraph when it repeats the header
 *  description verbatim — the modal shows description above the body,
 *  where ProjectPage (which doesn't) relies on that line as its lead-in. */
function stripDuplicateLeadIn(markdown: string, description: string): string {
  const [firstParagraph, ...rest] = markdown.split(/\n{2,}/);
  if (firstParagraph?.trim() !== description.trim()) {
    return markdown;
  }
  return rest.join("\n\n");
}

type AccordionSection = { title: string; body: string };

/**
 * Splits case-study markdown on `---` rules into accordion sections, using
 * each chunk's leading `### Heading` as the section title. Any text before
 * the first `###` (e.g. Rovo's one-sentence intro) has no title to collapse
 * under, so it renders as plain lead-in copy above the first section.
 */
function parseAccordionSections(markdown: string): { intro: string; sections: AccordionSection[] } {
  const chunks = markdown
    .split(/\n-{3,}\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  let intro = "";
  const sections: AccordionSection[] = [];

  chunks.forEach((chunk, index) => {
    const headingMatch = chunk.match(/^###\s+(.+)$/m);
    if (!headingMatch) {
      if (index === 0) {
        intro = chunk;
      }
      return;
    }
    const headingIndex = headingMatch.index!;
    const leadIn = chunk.slice(0, headingIndex).trim();
    if (index === 0 && leadIn) {
      intro = leadIn;
    }
    sections.push({
      title: headingMatch[1]!.trim(),
      body: chunk.slice(headingIndex + headingMatch[0].length).trim(),
    });
  });

  return { intro, sections };
}

function AccordionItem({
  title,
  body,
  isOpen,
  onToggle,
}: {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.accordionItem}>
      <button
        type="button"
        className={styles.accordionTrigger}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className={styles.accordionTitle}>{title}</span>
        <span className={styles.accordionIcon} aria-hidden="true">
          <span className={styles.accordionIconLineH} />
          <span
            className={[styles.accordionIconLineV, isOpen ? styles.accordionIconLineVOpen : ""].join(" ")}
          />
        </span>
      </button>
      <div
        className={[styles.accordionPanelWrap, isOpen ? styles.accordionPanelWrapOpen : ""].join(" ")}
      >
        <div className={styles.accordionPanelInner}>
          <div className={styles.accordionPanel}>
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>{body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

const GALLERY_PLACEHOLDER_COUNT = 4;

/**
 * Trying to autoplay every stacked video at once gets throttled by the
 * browser (observed: all fully buffered — readyState 4 — yet still paused
 * a few seconds in). Instead, each video plays only while scrolled into
 * view, which sidesteps the multi-autoplay throttling and is lighter on
 * bandwidth/battery for a long stacked gallery.
 */
function GalleryVideo({ item, className }: { item: GalleryItem; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tryPlay = () => {
      video.play().catch(() => {
        /* Autoplay can be rejected (e.g. reduced-motion); controls still let the user press play. */
      });
    };

    // Handle the "already in view on mount" case directly — the
    // IntersectionObserver's own initial callback can be delayed enough
    // (especially under StrictMode's double-effect-invocation in dev) that
    // waiting on it alone leaves the hero video sitting unplayed.
    const rect = video.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      tryPlay();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry!.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={item.src}
      aria-label={item.alt}
      controls
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
}

function GalleryMedia({ item, className }: { item: GalleryItem; className: string }) {
  if (item.type === "video") {
    return <GalleryVideo item={item} className={className} />;
  }
  return (
    <img
      className={className}
      src={item.src}
      alt={item.alt}
      decoding="async"
    />
  );
}

/** The same hero image/video shown on the project's card, reused here as the
 *  first thing in the modal's scroll content, right below the intro. */
function HeroMedia({ src, alt, className }: { src: string; alt: string; className: string }) {
  if (VIDEO_SRC_PATTERN.test(src)) {
    return (
      <video
        className={className}
        src={src}
        aria-label={alt}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }
  return <img className={className} src={src} alt={alt} decoding="async" />;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [showStickyTitle, setShowStickyTitle] = useState(false);

  const parsedAbout = useMemo(
    () =>
      project?.aboutMarkdown
        ? parseAccordionSections(
            stripDuplicateLeadIn(stripGalleryTokens(project.aboutMarkdown), project.description),
          )
        : null,
    [project?.aboutMarkdown, project?.description],
  );

  useEffect(() => {
    setOpenSections(new Set());
    setShowStickyTitle(false);
  }, [project?.id]);

  useEffect(() => {
    const root = scrollAreaRef.current;
    const target = titleRef.current;
    if (!root || !target) {
      return;
    }

    // Fires once the real title scrolls up out from under the sticky bar —
    // mirrors the homepage Nav's echo-title behavior, scoped to the modal's
    // own scroll container instead of the window.
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyTitle(!entry.isIntersecting),
      { root, rootMargin: `-${STICKY_BAR_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [project?.id]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close project details"
      >
        <span aria-hidden="true">&times;</span>
      </button>

      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Echoes the real title once it scrolls up out of view — see the
            IntersectionObserver above, same pattern as the homepage Nav. */}
        <div
          className={[styles.stickyBar, showStickyTitle ? styles.stickyBarVisible : ""].join(" ")}
          style={{ height: STICKY_BAR_HEIGHT }}
        >
          <p
            className={[styles.stickyTitle, showStickyTitle ? styles.stickyTitleVisible : ""].join(" ")}
            aria-hidden="true"
          >
            {project.title}
          </p>
        </div>

        <div ref={scrollAreaRef} className={styles.scrollArea}>
          <div
            className={styles.plateHeader}
            style={project.plateColor ? ({ "--modal-plate-color": project.plateColor } as CSSProperties) : undefined}
          >
            <p className={styles.kicker}>{project.kicker}</p>
            <h2 ref={titleRef} id="project-modal-title" className={styles.title}>
              {project.title}
            </h2>
            <p className={styles.headerDescription}>{project.description}</p>
          </div>

          <div className={styles.heroMediaWrap}>
            <HeroMedia src={project.imageSrc} alt={project.imageAlt} className={styles.heroMedia} />
          </div>

          <div className={styles.body}>
            {parsedAbout && (
              <div className={styles.markdownBody}>
                {parsedAbout.intro && (
                  <ReactMarkdown components={MARKDOWN_COMPONENTS}>{parsedAbout.intro}</ReactMarkdown>
                )}
                <div className={styles.accordion}>
                  {parsedAbout.sections.map((section, index) => (
                    <AccordionItem
                      key={index}
                      title={section.title}
                      body={section.body}
                      isOpen={openSections.has(index)}
                      onToggle={() =>
                        setOpenSections((prev) => {
                          const next = new Set(prev);
                          if (next.has(index)) {
                            next.delete(index);
                          } else {
                            next.add(index);
                          }
                          return next;
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.galleryPanel}>
              {project.gallery && project.gallery.length > 0 ? (
                <>
                  <div
                    className={styles.galleryHeroWrap}
                    style={
                      project.plateColor
                        ? ({ "--modal-plate-color": project.plateColor } as CSSProperties)
                        : undefined
                    }
                  >
                    <GalleryMedia item={project.gallery[0]!} className={styles.galleryHeroMedia} />
                  </div>
                  {project.gallery.length > 1 && (
                    <div className={styles.galleryGrid}>
                      {project.gallery.slice(1).map((item, index) => (
                        <div
                          key={index}
                          className={styles.galleryGridItemWrap}
                          style={
                            project.plateColor
                              ? ({ "--modal-plate-color": project.plateColor } as CSSProperties)
                              : undefined
                          }
                        >
                          <GalleryMedia item={item} className={styles.galleryGridItem} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.galleryGrid}>
                  {Array.from({ length: GALLERY_PLACEHOLDER_COUNT }, (_, index) => (
                    <div key={index} className={styles.galleryPlaceholder}>
                      <span>Image {index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
