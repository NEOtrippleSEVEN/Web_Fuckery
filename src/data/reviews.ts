export type Review = {
  quote: string;
  name: string;
  context: string;
};

// Home shows the first three; About shows the rest.
export const reviews: Review[] = [
  {
    quote:
      "Maren told us to wait three weeks and repaint the hallway. We thought she was being fussy. The house went for 9% over ask in six days.",
    name: "Dara & Sam Okafor",
    context: "Sold in Kingston, 2026",
  },
  {
    quote:
      "She showed us eleven houses and talked us out of eight of them, including two that would have made her a faster commission. We live in the ninth.",
    name: "Priya Raman",
    context: "Bought in Cold Spring, 2025",
  },
  {
    quote:
      "Every other agent said our stone house was 'a niche property.' Maren knew the three families who'd want it, and she was right about two of them.",
    name: "The Weiler family",
    context: "Sold in Stone Ridge, 2025",
  },
  {
    quote:
      "We were 3,000 miles away for the entire closing. Maren walked the inspector through, sent us forty minutes of video, and flagged a septic issue the seller's own report missed.",
    name: "Jonah Park",
    context: "Bought in Beacon, 2024",
  },
  {
    quote:
      "Direct to the point of bluntness, which is exactly what you want when the number has seven digits in it.",
    name: "C. Alvarez",
    context: "Sold in Millbrook, 2024",
  },
  {
    quote:
      "Three years after we closed, she still sends us the name of the person to call when something breaks. That's the review.",
    name: "Ruth & Ellen Hastings",
    context: "Bought in Rhinebeck, 2022",
  },
];
