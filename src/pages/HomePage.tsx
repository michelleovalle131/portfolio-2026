import { HeroSection } from "../components/HeroSection/HeroSection";
import { FunFactsSection } from "../components/FunFactsSection/FunFactsSection";
import { Footer } from "../components/Footer/Footer";
import { IntroSection } from "../components/IntroSection/IntroSection";
import { FeaturedProjectSection } from "../components/FeaturedProjectSection/FeaturedProjectSection";
import { ExpandableVideo } from "../components/ProjectPanel/ExpandableVideo";
import { useEffect, useRef } from "react";

/** Marks each section (and the footer) [data-inked] once it is well into
 * view, and clears the mark when it has fully left so it prints again on the
 * next visit. src/styles/ink.css plays the heading flood from that cue. */
function useInkOnEnter(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sheets = el.querySelectorAll<HTMLElement>("section, footer");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            entry.target.setAttribute("data-inked", "");
          } else if (!entry.isIntersecting) {
            entry.target.removeAttribute("data-inked");
          }
        }
      },
      { threshold: [0, 0.3] },
    );
    sheets.forEach((sheet) => observer.observe(sheet));
    return () => {
      observer.disconnect();
      sheets.forEach((sheet) => sheet.removeAttribute("data-inked"));
    };
  }, [root]);
}

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Scroll motion: Screenprint — sections print in as they scroll into view */
export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useInkOnEnter(pageRef);

  return (
    <div ref={pageRef} className="motion-ink">
      <HeroSection />
      <IntroSection />
      <FeaturedProjectSection
        id="ai-overlays"
        layout="split"
        pageNumber="02/03"
        title="From Talking Head Video to Dynamic Presentation"
        description="AI Overlays turns a talking-head Loom into a dynamic video presentation, generating polished motion graphics from your words."
        backgroundSrc="/imgs/ai-overlays-bg.jpg"
        screenshotSrc="/imgs/ai-overlays-ui.webp"
        screenshotAlt="A Loom video with AI Overlays: animated stat cards for daily engagement beside the presenter"
        videoSrc="/imgs/ai-overlays-hero.mp4"
        details={{
          meta: "Loom at Atlassian",
          role: "Led end-to-end design of UX, visual and motion system",
          body: (
            <>
              <p>
                AI Overlays is an agent that turns a talking-head Loom into a
                dynamic presentation. It reads the transcript and pacing of what
                you say, then generates timed, editorial motion graphics from
                your words and your team’s context.
              </p>
              <p>
                Announced in the Founder Keynote at Team ’26, where it was
                demoed on stage by Atlassian’s Founder and CEO. The live
                demonstration illustrated how a raw, casual screen-recording
                could instantly transform into a highly-polished and dynamic
                video presentation.
              </p>
              <p>
                <a
                  className="link-inline"
                  href="https://www.youtube.com/watch?v=jQxFsWxn5rQ&t=3379s"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch the TEAM’26 Founder Keynote announcement
                </a>
              </p>
              <img
                src="/imgs/ai-overlays-keynote.jpg"
                alt="Atlassian’s Founder and CEO on stage at Team ’26 beside a slide announcing Loom AI Overlays"
                loading="lazy"
                decoding="async"
              />
              {/* Demo: plays muted on a loop, unless the visitor prefers
                  reduced motion. Full panel width, with an expand button. */}
              <ExpandableVideo
                src="/imgs/ai-overlays-demo.mp4"
                autoPlay={!PREFERS_REDUCED_MOTION}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="Demo of configuring AI Overlays on a Loom video"
              />
              <ExpandableVideo
                src="/imgs/ai-overlays-templates.mp4"
                autoPlay={!PREFERS_REDUCED_MOTION}
                muted
                loop
                playsInline
                controls
                preload="metadata"
                aria-label="AI Overlays templates animating across different video layouts"
              />
              <h3>Impact</h3>
              <ul>
                <li>Featured in Atlassian Team EU Founder Keynote</li>
                <li>
                  Created the foundation for AI Overlays: a template, motion
                  and design system built to grow beyond talking-head videos to
                  screen-share and content-driven Looms
                </li>
                <li>
                  Scaled into sibling workstreams like fast-tracking agentic PR
                  reviews, because it was built as a modular visual and motion
                  system
                </li>
              </ul>
            </>
          ),
        }}
      />
      <FunFactsSection />
      <Footer />
    </div>
  );
}
