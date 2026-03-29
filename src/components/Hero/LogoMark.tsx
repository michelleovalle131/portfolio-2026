type LogoMarkProps = {
  className?: string;
  /** Shown to assistive tech (h1 still names the page) */
  title?: string;
};

export function LogoMark({ className, title = "Michelle Ovalle" }: LogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        d="M44.7024 0C37.845 0 32.9758 2.97448 30.4905 8.14271V0.419395H22.9889L16.9163 23.9603H16.4258L9.5847 0.419395H0L0.0163506 33.5806H2.80249V2.62928H3.33224L4.10072 5.24243L6.7397 14.3046L12.361 33.5806H16.3996L17.2498 30.2674L17.724 28.4285L24.3787 2.62928H24.9182V33.5806H30.4905V26.7348C32.845 31.4191 37.397 34 44.1792 34C54.9346 34 60 27.4445 60 16.8822C60 6.31995 54.6992 0 44.7024 0ZM44.3689 32.5386C38.1589 32.5386 37.2924 27.209 37.2924 17.4468C37.2924 6.50707 38.0118 1.4582 44.3689 1.4582C50.726 1.4582 51.259 6.31028 51.259 17.0177C51.259 27.7252 50.3041 32.5386 44.3689 32.5386Z"
        fill="currentColor"
      />
    </svg>
  );
}
