type LogoMarkProps = {
  className?: string;
  /** Shown to assistive tech (h1 still names the page) */
  title?: string;
  /** Hide from the a11y tree when a parent link supplies the name (e.g. nav). */
  decorative?: boolean;
};

/**
 * Visual: `Hero.module.css` `.logo` uses this asset as a CSS mask and fills with
 * `var(--hero-fg)` — same gray / light contrast behavior as the previous inline SVG + currentColor.
 */
export function LogoMark({
  className,
  title = "Michelle Ovalle",
  decorative = false,
}: LogoMarkProps) {
  return (
    <span
      className={className}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    />
  );
}
