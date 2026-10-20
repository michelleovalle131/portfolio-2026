import { useState, type ReactNode } from "react";
import styles from "./FeaturedProjectSection.module.css";
import { ProjectPanel } from "../ProjectPanel/ProjectPanel";

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * The screen recording has its own blurred backdrop around the player; this
 * frames just the player (cropped by position) so it sits on our own
 * backdrop like the screenshot did.
 */
function VideoShot({
  className,
  src,
  label,
  ...rest
}: { className: string; src: string; label: string; [data: `data-${string}`]: string }) {
  return (
    <div className={`${styles.videoShot} ${className}`} {...rest}>
      <video
        src={src}
        autoPlay={!PREFERS_REDUCED_MOTION}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}

type FeaturedProjectSectionProps = {
  id: string;
  /** Handwritten section counter, e.g. "02/03". */
  pageNumber: string;
  /** Optional mono label in the top-right corner, e.g. the project name. */
  label?: string;
  title: string;
  description: string;
  /** Atmospheric backdrop, multiplied onto the accent plate. */
  backgroundSrc: string;
  /** Product UI shown centered over the backdrop. */
  screenshotSrc: string;
  screenshotAlt: string;
  /** A video to show instead of the backdrop + screenshot (muted, looping);
   * screenshotAlt describes it */
  videoSrc?: string;
  /** "stacked": full-width image under the title. "split": image fills the right 10 columns. */
  layout?: "stacked" | "split";
  /** When given, the image opens a side panel with these project details */
  details?: {
    meta?: string;
    /** What you did on it, under the meta line */
    role?: string;
    tags?: string[];
    body: ReactNode;
  };
};

export function FeaturedProjectSection({
  id,
  pageNumber,
  label,
  title,
  description,
  backgroundSrc,
  screenshotSrc,
  screenshotAlt,
  videoSrc,
  layout = "stacked",
  details,
}: FeaturedProjectSectionProps) {
  const headingId = `${id}-heading`;
  const [panelOpen, setPanelOpen] = useState(false);
  const MediaTag = details ? "button" : "div";

  return (
    <section
      className={[styles.section, layout === "split" ? styles.split : ""]
        .filter(Boolean)
        .join(" ")}
      id={id}
      aria-labelledby={headingId}
      // The whole section opens the project; the image is its keyboard button.
      // Clicks inside the panel (rendered in here) bubble up too — skip those,
      // including during its closing slide.
      onClick={
        details
          ? (e) => {
              if ((e.target as Element).closest("[data-project-panel]")) return;
              setPanelOpen(true);
            }
          : undefined
      }
      data-clickable={details ? "" : undefined}
    >
      <div className={`editorialGrid ${styles.grid}`}>
        <p className={styles.pageNumber} aria-hidden>
          {pageNumber}
        </p>
        {label && (
          <p className={styles.label}>
            {label}
          </p>
        )}

        <h2 className={styles.title} id={headingId}>
          {title}
        </h2>

        <MediaTag
          className={[styles.media, details ? styles.mediaButton : ""].filter(Boolean).join(" ")}
          data-ink-box
          {...(details
            ? {
                type: "button" as const,
                onClick: () => setPanelOpen(true),
                "aria-haspopup": "dialog" as const,
                "aria-label": `Open project: ${title}`,
              }
            : {})}
        >
          {videoSrc ? (
            <>
              <img
                className={styles.backdrop}
                data-ink="rise"
                data-ink-pass="1"
                src={backgroundSrc}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <VideoShot
                className={styles.screenshotVideo}
                src={videoSrc}
                label={screenshotAlt}
                data-ink="rise"
                data-ink-pass="2"
              />
            </>
          ) : (
            <>
              <img
                className={styles.backdrop}
                data-ink="rise"
                data-ink-pass="1"
                src={backgroundSrc}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                className={styles.screenshot}
                data-ink="rise"
                data-ink-pass="2"
                src={screenshotSrc}
                alt={screenshotAlt}
                loading="lazy"
                decoding="async"
              />
            </>
          )}
        </MediaTag>

        <p className={styles.description}>
          {description}
          {/* Opens the side panel, like a click anywhere in the section */}
          {details && (
            <>
              {" "}
              <button
                type="button"
                className="link-inline"
                onClick={() => setPanelOpen(true)}
                aria-haspopup="dialog"
              >
                Learn more
              </button>
            </>
          )}
        </p>
      </div>

      {details && (
        <ProjectPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          title={title}
          meta={details.meta}
          role={details.role}
          tags={details.tags}
          media={
            videoSrc ? (
              <>
                <img className={styles.panelBackdrop} src={backgroundSrc} alt="" />
                <VideoShot className={styles.panelShotVideo} src={videoSrc} label={screenshotAlt} />
              </>
            ) : (
              <>
                <img className={styles.panelBackdrop} src={backgroundSrc} alt="" />
                <img className={styles.panelShot} src={screenshotSrc} alt={screenshotAlt} />
              </>
            )
          }
        >
          {details.body}
        </ProjectPanel>
      )}
    </section>
  );
}
