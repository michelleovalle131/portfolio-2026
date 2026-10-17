/** About page — work history: one entry per product / place, its roles below */
export type ExperienceRole = {
  /** Role + team — rendered bold */
  title: string;
  /** Shown in all caps via CSS */
  dateRange: string;
  description: string;
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
        title: "Sr Product Designer on AI Overlays",
        dateRange: "Jul 2026–Present",
        description:
          "Took agent-created video overlays from 0→1 to a Founder Keynote debut at Team'26 EU, designing the UX, templates and motion system end to end",
      },
      {
        title: "Sr Product Designer on Meeting Recordings",
        dateRange: "Jan 2026–Jun 2026",
        description:
          "Drove the vision for how 1-click AI-suggested actions can turn meeting discussions into progress",
      },
    ],
  },
  {
    id: "confluence",
    headline: "Confluence",
    roles: [
      {
        title: "Sr Product Designer on Flywheel",
        dateRange: "Apr 2025–Dec 2025",
        description:
          "Led rapid ideation and prototyping to validate key hypotheses and improve Activation and Feature Discovery efforts across Confluence",
      },
      {
        title: "Sr Product Designer on Company Hub",
        dateRange: "Jan 2024–Oct 2025",
        description:
          "Delivered a 0→1 MVP to GA and set FY25, FY26, and Unified Hubs product visions—establishing Company Hub as the design standard across a multi-product platform",
      },
      {
        title: "Product Designer on Ecosystem",
        dateRange: "Nov 2022–Dec 2023",
        description:
          "Led the launch of Confluence's Dark Mode in close collaboration with ADS, PM and Eng to deliver on a top 10 customer request",
      },
    ],
  },
  {
    id: "masters-shanghai",
    headline: "MS Interactive Media & Communication",
    roles: [
      {
        title: "Shanghai, China",
        dateRange: "Jan 2019–Aug 2022",
        description:
          "Completed at Quinnipiac University while living abroad in Shanghai, China",
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
