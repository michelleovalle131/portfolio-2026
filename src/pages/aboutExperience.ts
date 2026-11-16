/** About page — work history: one entry per product / place, its roles below */
export type ExperienceRole = {
  /** Role + team — rendered bold; empty for none */
  title: string;
  /** Shown in all caps via CSS */
  dateRange: string;
  /** A sentence, or a list of points (rendered as bullets) */
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
    headline: "Loom",
    roles: [
      {
        title: "Sr Product Designer, AI Overlays",
        dateRange: "Jul 2026–Present",
        description:
          "Took agent-created video overlays from 0→1 to a Founder Keynote debut at Team'26 EU, designing the UX, templates and motion system end to end",
      },
      {
        title: "Sr Product Designer, Meeting Recordings",
        dateRange: "Jan 2026–Jul 2026",
        description:
          "Drove the vision for how 1-click AI-suggested actions can turn meetings into progress",
      },
    ],
  },
  {
    id: "confluence",
    headline: "Confluence",
    roles: [
      {
        title: "Sr Product Designer, Activation",
        dateRange: "Oct 2025–Dec 2025",
        description:
          "Led rapid ideation and prototyping to validate key hypotheses and improve Activation and Feature Discovery efforts across Confluence",
      },
      {
        title: "Sr Associate Product Designer → Sr Product Designer, Company Hub",
        dateRange: "Jan 2024–Oct 2025",
        description: [
          "Delivered a 0→1 MVP to GA and set the FY25, FY26, and Unified Hubs product visions",
          "Introduced an editorial design style and scalable visual system that elevated visual quality and gave Company Hub a distinct identity, establishing it as the design standard across a multi-product platform",
          "Strengthened cross-functional alignment by facilitating workshops and establishing rituals that clarified priorities and strengthened team culture",
        ],
      },
      {
        title: "Product Designer → Sr Associate Product Designer, Ecosystem",
        dateRange: "Nov 2022–Dec 2023",
        description:
          "Led the launch of Confluence's Dark Mode in close collaboration with ADS, PM and Eng to deliver on a top 10 customer request",
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
        description:
          "Completed an MS in Interactive Media & Communication at Quinnipiac University while living abroad",
      },
    ],
  },
  {
    id: "gmmb-agency",
    headline: "GMMB agency",
    roles: [
      {
        title: "Sr Multidisciplinary Designer",
        dateRange: "2016–2018",
        description:
          "Led end-to-end digital and brand design for high-profile public sector and nonprofit clients (including the Bill & Melinda Gates Foundation, FEMA, and JB Pritzker for Governor), delivering branding, websites and campaigns",
      },
    ],
  },
  {
    id: "marriott-springhill",
    headline: "Marriott International",
    roles: [
      {
        title: "Sr Art Director",
        dateRange: "2015–2016",
        description:
          "Led the rebranding of SpringHill Suites, Marriott's largest all-suite hotel brand, delivering stakeholder-approved strategic design solutions and nationwide test campaigns",
      },
    ],
  },
];
