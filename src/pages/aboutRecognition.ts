/** About page — awards & recognition (headline / year / description) */
export type RecognitionEntry = {
  id: string;
  headline: string;
  dateRange: string;
  description: string;
};

export const ABOUT_RECOGNITION: RecognitionEntry[] = [
  {
    id: "shipit-2023",
    headline: "Atlassian ShipIt Hackathon",
    dateRange: "2023",
    description:
      "Listen to Confluence, 3rd place in USA Regionals out of 66 teams",
  },
  {
    id: "print-magazine-2022",
    headline: "Print Magazine Annual",
    dateRange: "2022",
    description: "Preserving family stories, 3rd Place",
  },
  {
    id: "tdc-one-club-2022",
    headline: "Type Directors “One Club” Competition",
    dateRange: "2022",
    description: "Money Kit, Shortlist",
  },
  {
    id: "graphic-design-usa-2021",
    headline: "Graphic Design USA",
    dateRange: "2021",
    description: "59th Design Annual, Preserving family stories",
  },
  {
    id: "aiga-flux-2021",
    headline: "AIGA Annual Flux Competition",
    dateRange: "2021",
    description:
      "Awarded for Family Stories, Money Kit and Night Lights",
  },
  {
    id: "scad-hackathon-2020",
    headline: "SCAD 48h Hackathon",
    dateRange: "2020",
    description: "Touchless UX, Semifinalist out of 28 teams",
  },
  {
    id: "marcom-2017-branding",
    headline: "Marcom Awards",
    dateRange: "2017",
    description:
      "Nutrition International, Platinum in Branding • Platinum in Brand Refresh",
  },
  {
    id: "marcom-2017-logo",
    headline: "Marcom Awards",
    dateRange: "2017",
    description: "Nutrition International, Silver in Logo Design",
  },
];
