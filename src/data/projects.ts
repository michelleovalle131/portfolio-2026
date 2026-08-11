import type { GalleryItem } from "../types/project";

export type Project = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  imgPosition?: string;
  plateColor?: string;
  kicker: string;
  title: string;
  description: string;
  aboutMarkdown?: string;
  gallery?: GalleryItem[];
  /** Optional small heading shown above the gallery, before the first image. */
  galleryIntro?: string;
  ctaHref?: string;
  /** Overrides the default "View project" CTA label. */
  ctaLabel?: string;
  /** When true, the card renders as non-interactive — no link, no modal. */
  disabled?: boolean;
};

const COMPANY_HUB_GALLERY: GalleryItem[] = [
  {
    type: "image",
    src: "/imgs/CoHub (1) copy.png",
    alt: "Company Hub interface",
    caption: "Company Hub was a full system — spanning custom Information Architecture, an editing suite, and admin insights.",
  },
  {
    type: "video",
    src: "/imgs/Cards-[copy].mp4",
    alt: "Company Hub cards interaction",
    caption: "Elements are incredibly customizable to fit different content and stylistic needs.",
  },
  {
    type: "video",
    src: "/imgs/cohub-spotlight-demo.mp4",
    alt: "Company Hub spotlight feature demo",
    caption: "Every element's configuration panel is designed so customers can style with confidence, no design background required.",
  },
  {
    type: "image",
    src: "/imgs/Spotlghts-2.png",
    alt: "Company Hub spotlights module",
    caption: "Built-in dynamic updating means Company Hub content stays current without manual upkeep.",
  },
  {
    type: "image",
    src: "/imgs/bluecap-Phone-in-Hand-Mockup copy.jpg",
    alt: "Company Hub shown on a phone mockup",
    caption: "Company Hub is fully responsive, giving employees the same experience whether they're on desktop or on the go.",
  },
  {
    type: "video",
    src: "/imgs/cohub-responsiveness-medium.mp4",
    alt: "Company Hub responsive layout demo",
  },
  {
    type: "image",
    src: "/imgs/bluecap-AdobeStock_908347774 copy.jpg",
    alt: "Company Hub product photography mockup",
    caption: "As part of the FY26 vision, we explored bringing Company Hub into physical workspaces. Conceptual image only.",
  },
];

const COMPANY_HUB_ABOUT_MARKDOWN = `Led the design and launch of a customizable company-wide hub—where all employees can go for up-to-date announcements, news, verified resources, and more.

### My role

I owned the end-to-end design for Company Hub, partnering closely with product and engineering from strategy through execution. That included leading the FY25, FY26, and Unified Hubs visioning process, running MVP research, and defining the editorialized visual system that became the design standard across the platform. I also mentored designers on the team and helped shape our craft practices.

---

### Problem we set out to solve

**Companies lack a single trusted place for top-down, verified communication**

Employees spend significant time searching across multiple products and surfaces for critical information — wasting time, causing frustration, and leaving them unsure if they've found the most current answer.

With Confluence acting as a centralized source of company knowledge, customers were already looking to us to provide that experience.

![Company Hub problem framing](</imgs/Frame 2087326028 (4) copy.png>)

---

### Evaluating an MVP with customers

To validate interest and understand customer needs, we built and tested an MVP that included a new entry point within Confluence navigation and a set of basic content-formatting elements. What we learned helped shape a solution that better served customers.

### MVP insights

- Customers liked the elements but wanted more ways to visually customize their hub's look and feel — the top request we heard.
- They also wanted more powerful tools to tailor hub content to specific audiences and keep it fresh without heavy manual effort.

![Company Hub MVP](/imgs/hub-mvp.png)

---

### From MVP to Vision

**Transforming Company Hub from a single-page feature in Confluence into a more beautiful and powerful system**

Using insights from the MVP, I led a "blue sky" visioning process for Company Hub, designing a compelling end-to-end experience for our three primary user groups. The vision addressed key user feedback while imagining an ideal future state for the product.

### Vision outcomes

- Delivered an editorialized aesthetic for a distinct, modern take on intranets
- Earned enthusiastic leadership buy-in to green-light the next phase
- Shifted the roadmap from incremental fixes to transformative improvements

[[gallery:0-5]]

---

### Impact

- **Building alignment** — FY25 and FY26 vision work won leadership approval and built genuine excitement for what we were building.
- **Paving the future** — Work on visual quality, site-creation UX, clear IA, and AI-driven concepts elevated design direction across three teams and laid the foundation for Company Hub to become the model for all hub experiences across our products.
- **Accelerating delivery** — Exceeded roadmap commitments, creating buffer for FY26 work.
- **Driving adoption** — Higher wall-to-wall adoption among Company Hub customers compared to non-adopters.
- **Proving value** — Adoption climbed steadily every month for six months straight after GA.

[[gallery:6-12]]
`;

const ROVO_AWARENESS_ABOUT_MARKDOWN = `One-week sprint with successful results in increasing Rovo awareness among Atlassian Cloud users.

### My roles

- Led rapid design ideation and execution within 1 week timeline
- Partnered closely with PM, PGM and ENG to ensure concepts were viable and feasible given constraints and goals

---

### Problem we set out to solve

## Awareness of Rovo among Confluence users is super low.

Only 9% of users list Rovo as a generative AI tool they are aware of.

---

### Proposed solution

## A three-pronged approach from large-scale campaigns to micro-interactions to help users discover Rovo

## 1. Broad reaching campaign

Add eye-catching, engaging but non-intrusive messaging to high traffic surfaces.

## 2. Context-driven prompts

Present Rovo as a better way for users to do what they were already doing.

## 3. Elevate Rovo presence

Wherever AI is in-product, associate it with Rovo's brand clearly and consistently.

---

### Impact

- 📈 The experiment worked as intended: showing Rovo more prominently in Confluence (via banners, branding, and nudges) led to a statistically significant ~1% increase in weekly active AI users for our main "no snippet" metric, hitting the success threshold we set.
- ✨ We also saw smaller positive lifts in overall AI usage, suggesting that increasing awareness of Rovo nudged more people to try and reuse higher‑value AI features like AI Chat.
- 🎯 Established clear brand association between AI features and Rovo.
`;

const COSITAS_BONITAS_ABOUT_MARKDOWN = `Cositas Bonitas is a daily illustration practice app. Each day brings a drawing prompt — a subject and a short poem — pulled from four curated categories: Botanicals, Wildlife, Food & Drink, and Still Life. It's designed to be low-effort: five minutes is plenty to keep the practice alive.

I built it because I wanted a reason to draw every day.

The prompts are designed to sit in a specific sweet spot — directive enough to give you somewhere to start, open enough to leave room for your own eye. The goal isn't to copy a photo. It's to take the prompt as a nudge: look around, find your own inspiration, guided by the idea in front of you.

After you draw, you upload your work and rate the prompt. That feedback shapes what the app offers next, so prompts grow more attuned to what you actually enjoy drawing — not just a random cycle through categories. Over time, you build something else too: a visual journal of everything you've made along the way.

[Check out Cositas Bonitas](https://cositas-bonitas.vercel.app)
`;

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "recent-impact-loom",
    imageSrc: "/imgs/M1CA-hero.jpg",
    imageAlt: "Suggested Actions experience in Confluence with AI prompts and meeting follow-up guidance",
    imgPosition: "top right",
    plateColor: "var(--plate-loom)",
    kicker: "TEAM26 Announcement",
    title: "Turn meetings into progress with instant AI suggestions",
    description:
      "Led the vision and launch of a one-click AI feature for Loom Meeting Recordings that detects action items and turns them into suggested next steps — helping users move straight from conversation to progress.",
    ctaHref: "https://www.atlassian.com/software/confluence",
    ctaLabel: "Coming soon",
    disabled: true,
  },
  {
    id: "recent-impact-company-hub",
    imageSrc: "/imgs/Vision.mp4",
    imageAlt: "Company Hub editor and publishing interface in Confluence",
    imgPosition: "center",
    plateColor: "var(--plate-company-hub)",
    kicker: "Confluence",
    title: "Company Hub — one place for trusted information, built for the whole company",
    description:
      "Led the design and launch of a customizable company-wide hub—where all employees can go for up-to-date announcements, news, verified resources, and more.",
    aboutMarkdown: COMPANY_HUB_ABOUT_MARKDOWN,
    gallery: COMPANY_HUB_GALLERY,
    galleryIntro: "From concept to customers: what shipped",
    ctaHref: "https://www.atlassian.com/software/confluence",
  },
];

export const SECONDARY_PROJECTS: Project[] = [
  {
    id: "activation-strategy",
    imageSrc: "/imgs/aha-to-mastery.png",
    imageAlt: "Confluence interface with suggested action prompts",
    plateColor: "var(--plate-activation)",
    kicker: "Personal Project",
    title: "Cositas Bonitas — an AI-powered daily illustration practice",
    description:
      "Conceptualized, designed and shipped Cositas Bonitas — a web app that generates a daily illustration prompt, then learns your taste over time from what you draw and love.",
    aboutMarkdown: COSITAS_BONITAS_ABOUT_MARKDOWN,
    ctaHref: "https://cositas-bonitas.vercel.app",
  },
  {
    id: "rovo-awareness",
    imageSrc: "/imgs/hero-imgs/Atlassian Rovo Campaign.png",
    imageAlt: "Product marketing composition highlighting Atlassian AI",
    plateColor: "var(--plate-rovo)",
    kicker: "Rovo in Confluence",
    title: "Driving awareness of Atlassian's AI",
    description:
      "Led a one-week sprint that boosted awareness and engagement for Rovo to customers using Confluence.",
    aboutMarkdown: ROVO_AWARENESS_ABOUT_MARKDOWN,
    ctaHref: "https://www.atlassian.com/software/rovo",
  },
];

export const ALL_PROJECTS: Project[] = [...FEATURED_PROJECTS, ...SECONDARY_PROJECTS];

export function findProject(id: string): Project | undefined {
  return ALL_PROJECTS.find((p) => p.id === id);
}
