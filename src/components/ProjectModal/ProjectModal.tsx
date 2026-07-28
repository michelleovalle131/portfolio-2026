import { type CSSProperties, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import type { GalleryItem, ModalProject } from "../../types/project";
import styles from "./ProjectModal.module.css";

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

type ModalTab = "about" | "gallery";

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

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("about");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (project) {
      setActiveTab("about");
    }
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
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <div
          className={styles.colorStrip}
          aria-hidden="true"
          style={project.plateColor ? ({ "--modal-plate-color": project.plateColor } as CSSProperties) : undefined}
        />

        <div
          className={styles.plateHeader}
          style={project.plateColor ? ({ "--modal-plate-color": project.plateColor } as CSSProperties) : undefined}
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
          <p className={styles.kicker}>{project.kicker}</p>
          <h2 id="project-modal-title" className={styles.title}>
            {project.title}
          </h2>

          <div className={styles.tabs} role="tablist" aria-label="Project details">
            <button
              type="button"
              role="tab"
              id="project-modal-tab-about"
              aria-selected={activeTab === "about"}
              aria-controls="project-modal-panel-about"
              className={[styles.tab, activeTab === "about" ? styles.tabActive : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              type="button"
              role="tab"
              id="project-modal-tab-gallery"
              aria-selected={activeTab === "gallery"}
              aria-controls="project-modal-panel-gallery"
              className={[styles.tab, activeTab === "gallery" ? styles.tabActive : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActiveTab("gallery")}
            >
              Gallery
            </button>
          </div>
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.body}>
            {activeTab === "about" ? (
              <div
                id="project-modal-panel-about"
                role="tabpanel"
                aria-labelledby="project-modal-tab-about"
                className={styles.aboutPanel}
              >
                {project.aboutMarkdown ? (
                  <div className={styles.markdownBody}>
                    <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                      {project.aboutMarkdown}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className={styles.description}>{project.description}</p>
                )}
              </div>
            ) : (
              <div
                id="project-modal-panel-gallery"
                role="tabpanel"
                aria-labelledby="project-modal-tab-gallery"
                className={styles.galleryPanel}
              >
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
                  <>
                    <div className={styles.galleryImageWrap}>
                      <img
                        className={styles.galleryImage}
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    {Array.from({ length: GALLERY_PLACEHOLDER_COUNT - 1 }, (_, index) => (
                      <div key={index} className={styles.galleryPlaceholder}>
                        <span>Image {index + 2}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
