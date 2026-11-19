/** About page — work history: one entry per product / place, its roles below */
export type ExperienceRole = {
  /** Role + team — rendered bold; empty for none */
  title: string;
  /** Shown in all caps via CSS */
  dateRange: string;
  /** One point or a list of points — always rendered as bullets */
  description: string | string[];
};

export type ExperienceEntry = {
  id: string;
  /** The product (or company / school) */
  headline: string;
  roles: ExperienceRole[];
};

export const ABOUT_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "loom",
    headline: "Loom @Atlassian",
    roles: [
      {
        title: "Senior Product Designer, AI Overlays",
        dateRange: "Jul 2026–Present",
        description: [
          "Took agent-created video overlays from 0→1, designing the UX, templates, and motion system end-to-end; debuted in the Founder Keynote at Team '26 EU",
          "Designed and shipped 18 production-ready templates in 5.5 weeks using an AI-assisted Figma-to-Cursor workflow; another squad reused the system to ship in two weeks",
          "Invited by Core Design leadership to present this workflow at AI Builders Week, Atlassian's company-wide AI initiative",
        ],
      },
      {
        title: "Senior Product Designer, Meeting Recordings",
        dateRange: "Jan 2026–Jul 2026",
        description: [
          "Drove the vision for how 1-click AI-suggested actions turn meetings into progress",
          "Designed onboarding for a team experiment that nearly doubled recordings per user",
        ],
      },
    ],
  },
  {
    id: "confluence",
    headline: "Confluence @Atlassian",
    roles: [
      {
        title: "Senior Product Designer, Activation",
        dateRange: "Oct 2025–Dec 2025",
        description:
          "Designed and shipped 8 Activation and Feature Discovery experiments, 6 of which drove measurable gains in engagement",
      },
      {
        title: "Product Designer IV → Senior Product Designer, Company Hub",
        dateRange: "Jan 2024–Oct 2025",
        description: [
          "Delivered a 0→1 MVP to GA and set the FY25, FY26, and Unified Hubs product visions",
          "Introduced an editorial design style and scalable visual system that gave the product a distinct identity and made it the design standard across a multi-product platform",
          "Strengthened cross-functional alignment by facilitating workshops and establishing rituals that clarified priorities and team culture",
          "Coached fellow designers on the design system, driving team adoption that helped us ship more, faster",
        ],
      },
      {
        title: "Product Designer III → Product Designer IV, Ecosystem",
        dateRange: "Nov 2022–Dec 2023",
        description:
          "Led the launch of Dark Mode with the Atlassian Design System (ADS) team, PM, and Eng, delivering a top 10 customer request",
      },
    ],
  },
  {
    id: "masters-shanghai",
    headline: "Expat in Shanghai, China",
    roles: [
      {
        // No role line: the dates sit alone, the degree is the sentence below
        title: "",
        dateRange: "Sep 2018–Jul 2022",
        description: [
          "Completed an MS in Interactive Media & Communication at Quinnipiac University while living abroad",
          "Received national awards for student work with GDUSA, PrintMag, and AIGA",
        ],
      },
    ],
  },
  {
    id: "gmmb-agency",
    headline: "GMMB agency",
    roles: [
      {
        title: "Senior Multidisciplinary Designer",
        dateRange: "2016–2018",
        description: [
          "Led end-to-end digital and brand design for prominent public sector and nonprofit clients (including the Bill & Melinda Gates Foundation, FEMA, and JB Pritzker for Governor), delivering branding, websites and campaigns",
          "Design lead for the rebranding of global non-profit organizations that resulted in award-winning work, and return client business",
        ],
      },
    ],
  },
  {
    id: "marriott-springhill",
    headline: "Marriott International",
    roles: [
      {
        title: "Senior Art Director",
        dateRange: "2015–2016",
        description: [
          "Led the rebranding of SpringHill Suites, Marriott's largest all-suite hotel brand, delivering stakeholder-approved strategic design solutions and nationwide test campaigns",
          "Launched on schedule and under budget by $30,000 while solving production challenges",
        ],
      },
    ],
  },
];
