/** About page — work history (headline / level / dates / description) */
export type ExperienceEntry = {
  id: string;
  headline: string;
  /** Seniority + role — rendered bold */
  levelLine: string;
  /** Shown in all caps via CSS */
  dateRange: string;
  description: string;
};

export const ABOUT_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "loom-recordings",
    headline: "Meeting Recordings on Loom",
    levelLine: "Sr Product Designer",
    dateRange: "January 2026–Present",
    description:
      "Shaping how teams capture, review, and act on their meetings",
  },
  {
    id: "confluence-activation",
    headline: "Flywheel Activation on Confluence",
    levelLine: "Sr Product Designer",
    dateRange: "April 2025–December 2025",
    description:
      "Led rapid ideation and prototyping to validate key hypotheses and improve activation/feature discovery across Confluence",
  },
  {
    id: "company-hub",
    headline: "Company Hub on Confluence",
    levelLine: "Sr Product Designer",
    dateRange: "January 2024–Oct 2025",
    description:
      "Delivered a 0→1 MVP to GA and set FY25, FY26, and Unified Hubs product visions—establishing Company Hub as the design standard across a multi-product platform",
  },
  {
    id: "ecosystem-confluence",
    headline: "Ecosystem on Confluence",
    levelLine: "Product Designer",
    dateRange: "Nov 2022–Dec 2023",
    description:
      "Led the launch of Confluence's Dark Mode in close collaboration with ADS, PM and Eng to deliver on a top customer request",
  },
  {
    id: "masters-shanghai",
    headline: "MS Interactive Media & Communication",
    levelLine: "Shanghai, China",
    dateRange: "January 2019–August 2022",
    description:
      "Completed while living abroad in Shanghai, China",
  },
  {
    id: "gmmb-agency",
    headline: "GMMB agency",
    levelLine: "Sr Multidisciplinary Designer",
    dateRange: "2016–2018",
    description:
      "Led end-to-end digital and brand design for high-profile public sector and nonprofit clients (including the Bill & Melinda Gates Foundation, FEMA, and JB Pritzker for Governor), delivering branding, websites and campaigns",
  },
  {
    id: "marriott-springhill",
    headline: "Marriott International",
    levelLine: "Sr Art Director",
    dateRange: "2015–2016",
    description:
      "Led the rebranding of SpringHill Suites, Marriott's largest all-suite hotel brand, delivering stakeholder-approved strategic design solutions and nationwide test campaigns",
  },
];
