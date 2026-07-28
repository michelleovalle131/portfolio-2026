import { type CSSProperties, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { Footer } from "../components/Footer/Footer";
import { findProject } from "../data/projects";
import type { GalleryItem } from "../types/project";
import styles from "./ProjectPage.module.css";

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

function GalleryVideo({ item, className }: { item: GalleryItem; className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tryPlay = () => video.play().catch(() => {});

    const rect = video.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) tryPlay();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry!.isIntersecting) tryPlay();
        else video.pause();
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
  if (item.type === "video") return <GalleryVideo item={item} className={className} />;
  return <img className={className} src={item.src} alt={item.alt} decoding="async" loading="lazy" />;
}

type ContentSegment =
  | { type: "markdown"; text: string }
  | { type: "gallery"; start: number; end: number };

function parseContent(markdown: string): ContentSegment[] {
  const parts = markdown.split(/\[\[gallery:(\d+)-(\d+)\]\]/);
  const segments: ContentSegment[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) segments.push({ type: "markdown", text: parts[i]! });
    if (i + 1 < parts.length) {
      segments.push({ type: "gallery", start: parseInt(parts[i + 1]!), end: parseInt(parts[i + 2]!) });
    }
  }
  return segments;
}

function InlineGallery({
  items,
  plateStyle,
}: {
  items: GalleryItem[];
  plateStyle?: CSSProperties;
}) {
  if (items.length === 0) return null;
  const [hero, ...rest] = items;
  return (
    <div className={styles.inlineGallery}>
      <div className={styles.inlineGalleryHeroWrap} style={plateStyle}>
        <GalleryMedia item={hero!} className={styles.inlineGalleryHeroMedia} />
      </div>
      {rest.length > 0 && (
        <div className={styles.inlineGalleryGrid}>
          {rest.map((item, i) => (
            <div key={i} className={styles.inlineGalleryItemWrap} style={plateStyle}>
              <GalleryMedia item={item} className={styles.inlineGalleryItemMedia} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const project = id ? findProject(id) : undefined;

  if (!project) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Project not found</h1>
          <Link to="/" className={styles.notFoundLink}>← Back to work</Link>
        </div>
      </div>
    );
  }

  const plateStyle = project.plateColor
    ? ({ "--project-plate-color": project.plateColor } as CSSProperties)
    : undefined;

  const segments = project.aboutMarkdown ? parseContent(project.aboutMarkdown) : [];

  return (
    <div className={styles.page}>
      {/* Back link sits on cream background, above the hero */}
      <div className={styles.heroNav}>
        <Link to="/" className={styles.backLink}>
          <span aria-hidden="true">←</span> Back
        </Link>
      </div>

      {/* Hero image with blurred color plate centered at bottom */}
      <div className={styles.hero}>
        <img
          className={styles.heroImage}
          src={project.imageSrc}
          alt={project.imageAlt}
          style={project.imgPosition ? { objectPosition: project.imgPosition } : undefined}
          decoding="async"
        />
        <div className={styles.heroPlate} style={plateStyle}>
          <p className={styles.kicker}>{project.kicker}</p>
          <h1 className={styles.title}>{project.title}</h1>
        </div>
      </div>

      <main className={styles.body}>
        {project.aboutMarkdown ? (
          segments.map((seg, i) =>
            seg.type === "markdown" ? (
              <div key={i} className={styles.markdownBlock}>
                <ReactMarkdown components={MARKDOWN_COMPONENTS}>{seg.text}</ReactMarkdown>
              </div>
            ) : (
              <InlineGallery
                key={i}
                items={(project.gallery ?? []).slice(seg.start, seg.end + 1)}
                plateStyle={plateStyle}
              />
            ),
          )
        ) : (
          <p className={styles.description}>{project.description}</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
