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
  ctaHref?: string;
};

const COMPANY_HUB_GALLERY: GalleryItem[] = [
  {
    type: "image",
    src: "/imgs/bluecap-Phone-in-Hand-Mockup copy.jpg",
    alt: "Company Hub shown on a phone mockup",
  },
  {
    type: "image",
    src: "/imgs/bluecap-AdobeStock_908347774 copy.jpg",
    alt: "Company Hub product photography mockup",
  },
  { type: "video", src: "/imgs/Cards-[copy].mp4", alt: "Company Hub cards interaction" },
  {
    type: "video",
    src: "/imgs/cohub-responsiveness-medium.mp4",
    alt: "Company Hub responsive layout demo",
  },
  { type: "video", src: "/imgs/cohub-spotlight-demo.mp4", alt: "Company Hub spotlight feature demo" },
  { type: "image", src: "/imgs/Preview copy.png", alt: "Company Hub preview screen" },
  { type: "image", src: "/imgs/Spotlghts-2.png", alt: "Company Hub spotlights module" },
  { type: "image", src: "/imgs/CoHub (1) copy.png", alt: "Company Hub interface" },
];

const COMPANY_HUB_ABOUT_MARKDOWN = `Led the design and launch of a customizable company-wide hub—where all employees can go for up-to-date announcements, news, verified resources, and more.

### My role

I owned end-to-end design across strategy, vision, and execution — partnering closely with product and engineering. I led the FY25, FY26, and Unified Hubs visioning process, ran MVP research and validation, and defined the editorialized visual system that became the design standard across the platform. I also mentored designers on the team and helped shape our craft practices.

---

### Problem we set out to solve

**Companies lack a single trusted place for top-down, verified communication**

Employees spend significant time searching across multiple products and surfaces for critical information — wasting time, causing frustration, and leaving them unsure if they've found the most current answer. As Confluence is positioned as a centralized source of company knowledge, customers increasingly looked to us to bring clarity to that experience.

---

### Evaluating an MVP with customers

To validate interest and understand customer needs, we built and tested an MVP that included a new entry point within Confluence navigation and a set of basic content-formatting elements. What we learned helped shape a solution that better served customers.

### MVP insights

- Customers liked the elements but wanted more ways to visually customize their hub's look and feel — the top request we heard.
- They also wanted more powerful tools to tailor hub content to specific audiences and keep it fresh without heavy manual effort.

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

### From Vision to Impact

- **Building alignment** — FY25 and FY26 vision work won leadership approval and built genuine excitement for what we were building, establishing Company Hub as the design standard across a multi-product platform.
- **Paving the future** — Work on visual quality, site-creation UX, clear IA, and AI-driven concepts elevated design direction across three teams and laid the foundation for Company Hub to become the model for all hub experiences across our products.
- **Accelerating delivery** — Exceeded roadmap commitments, creating buffer for FY26 work.
- **Driving adoption** — 54% wall-to-wall adoption among Company Hub customers, vs. 34% for non-adopters.
- **Proving value** — Adoption climbed steadily every month for six months straight.

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

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "recent-impact-loom",
    imageSrc: "/imgs/M1CA-Port-web.mp4",
    imageAlt: "Suggested Actions experience in Confluence with AI prompts and meeting follow-up guidance",
    imgPosition: "top right",
    plateColor: "var(--plate-loom)",
    kicker: "Loom Meeting Recordings",
    title: "Turn meetings into progress with instant AI suggestions",
    description:
      "Led the vision and launch of a one-click AI feature for Loom Meeting Recordings that detects action items and turns them into suggested next steps — helping users move straight from conversation to progress.",
    ctaHref: "https://www.atlassian.com/software/confluence",
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
    ctaHref: "https://www.atlassian.com/software/confluence",
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
