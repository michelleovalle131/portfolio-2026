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
  { type: "video", src: "/imgs/Vision.mp4", alt: "Company Hub vision walkthrough" },
  { type: "video", src: "/imgs/Wanderly hub.mp4", alt: "Wanderly Hub demo" },
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
  { type: "image", src: "/imgs/Headline-2 copy.png", alt: "Company Hub headline module" },
  { type: "image", src: "/imgs/Preview copy.png", alt: "Company Hub preview screen" },
  {
    type: "image",
    src: "/imgs/Screenshot 2025-11-23 at 2.28.54 PM copy.png",
    alt: "Company Hub product screenshot",
  },
  { type: "video", src: "/imgs/Spaces (1).mp4", alt: "Company Hub spaces feature demo" },
  { type: "image", src: "/imgs/Spotlghts-2.png", alt: "Company Hub spotlights module" },
  { type: "image", src: "/imgs/CoHub (1) copy.png", alt: "Company Hub interface" },
];

const COMPANY_HUB_ABOUT_MARKDOWN = `Led the design and launch of a customizable company-wide hub—where all employees can go for up-to-date announcements, news, verified resources, and more.

### My role

- Defined and championed the FY25, FY26, and Unified Hubs visions, aligning leadership around a clear, future-looking direction and establishing Company Hub as the design standard across a multi-product platform.
- Introduced a new editorialized visual system grounded in scalability and customer research—that elevated the product's visual quality and influenced design direction across three teams.
- Drove cross-functional collaboration across design, product, and engineering to ship over 15 high-quality experiences to customers.
- Accelerated delivery and team effectiveness by exceeding roadmap commitments, creating buffer for FY26 work, and strengthening team culture through mentorship and craft rituals.

---

### Problem we set out to solve

## Companies lack a single trusted place for top down, verified communication

Employees spend significant time searching across multiple products and surfaces to find critical information—leading to wasted time, frustration, and low confidence in whether they found the 'right' most up-to-date answers. As Confluence is positioned as a centralized source of company knowledge, customers increasingly looked to us to solve this problem and bring clarity to their workflows.

---

### MVP

## Ship an MVP experience for a select group of customers to test and validate concept

To validate interest and understand customer needs, we built an MVP and tested it through interviews, landscape research, and usability studies. The MVP included a new entry point within Confluence navigation, and some basic content formatting elements. The insights we gained during this process helped us shape a solution that better served both customers and the market.

### MVP insights

- Customers liked the elements, but wanted more ways to visually customize the look and feel of their hub. This was the top request.
- Customers also wanted more powerful tools to tailor hub content to specific audiences and to keep it fresh without so much manual effort.

---

### Crafting a bold vision for Company Hub

## Transforming Company Hub from a single page feature in Confluence into a more beautiful and powerful system

Using insights from the MVP, I led a "blue sky" visioning process for Company Hub, designing a compelling end-to-end experience for our three primary user groups. The vision addressed key user feedback while imagining an ideal future state for the product.

### Vision outcomes

- Editorialized aesthetic for a distinct and modern take on intranets
- Leadership green-lit the next phase with enthusiastic support
- Enabled a shift from incremental fixes to transformative improvements

[[gallery:0-5]]

---

### From vision to impact

## Shipping a more robust, enhanced experience

These updates reflect how customer insights and strong design direction came together in practical, shippable experiences.

### Impact of my work on Company Hub

- **Building alignment** — FY25 and FY26 vision work secured green-lit leadership approvals and created palpable excitement for what we wanted to build.
- **Paving the future** — My work on building a high-quality visual experience, site creation UX, clear IA, and AI-driven concepts paved the way for Company Hub to become the foundation for all hub-related experiences across the company's products.
- **Increasing adoption** — 54% wall-to-wall adoption among Company Hub customers (vs. 34% for non-adopters).
- **Proving value** — Improvements led to monthly uplift in adoption over 6 months.

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
    imageSrc: "/imgs/App notification-2.mp4",
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
