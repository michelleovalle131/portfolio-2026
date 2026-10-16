import { Fragment, useLayoutEffect, useRef } from "react";

/**
 * Splits heading copy into word spans so the screenprint motion
 * (src/styles/ink.css) can ink each word on its own. Spaces stay as plain
 * text, so wrapping and screen-reader output are unchanged.
 *
 * Each word also gets `--line` (0, 1, 2…: which wrapped line it sits on) and
 * `--lines` (how many lines the heading wraps to), re-measured when the
 * heading reflows, so motion can divide its time between lines.
 */
export function InkText({ children }: { children: string }) {
  const words = children.trim().split(/\s+/);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const spans = wordRefs.current.filter((s): s is HTMLSpanElement => !!s);
    const heading = spans[0]?.parentElement;
    if (!heading) return;

    const tagLines = () => {
      let line = -1;
      let lastTop = Number.NEGATIVE_INFINITY;
      for (const span of spans) {
        const top = span.offsetTop;
        if (top > lastTop + 2) {
          line += 1;
          lastTop = top;
        }
        span.style.setProperty("--line", String(line));
      }
      for (const span of spans) span.style.setProperty("--lines", String(line + 1));
    };

    tagLines();
    const observer = new ResizeObserver(tagLines);
    observer.observe(heading);
    return () => observer.disconnect();
  }, [children]);

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span
            data-ink-word
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </>
  );
}
