import type { HeadingPart } from "./site";

type ServicePageContent = {
  headline: HeadingPart[];
  scope: string;
  descriptions: string[];
};

export const servicePages: Record<string, ServicePageContent> = {
  marketing: {
    headline: ["Make every ", { accent: "click" }, " count."],
    scope: "Build a campaign around the customer journey",
    descriptions: [
      "Find the searches your customers use and improve the pages that answer them.",
      "Match paid ads to search intent and track what happens after the click.",
      "Choose the right platforms, plan a publishing rhythm and test creative.",
      "Give buyers useful answers at each stage of their decision.",
      "Build email sequences that welcome, nurture and re-engage your audience.",
    ],
  },
  design: {
    headline: ["An identity with ", { accent: "range." }],
    scope: "From the first mark to the full system",
    descriptions: [
      "Define the mark, type, color and visual elements that make your brand recognizable.",
      "Give your team practical rules and examples for using the identity consistently.",
      "Build a set of flexible formats for feeds, campaigns and launches.",
      "Carry the identity into print materials, labels and packaging.",
      "Translate the visual language into clear, usable digital interfaces.",
    ],
  },
  web: {
    headline: ["Make your site ", { accent: "work harder." }],
    scope: "Choose the right build for your site",
    descriptions: [
      "Give visitors a clear path from understanding your offer to making an enquiry.",
      "Build product pages, collections and a checkout around how people shop.",
      "Create a focused page for one campaign, audience and action.",
      "Set up content editing around the updates your team makes most often.",
      "Plan for hosting, updates and maintenance after launch.",
    ],
  },
  software: {
    headline: ["Software that fits ", { accent: "your workflow." }],
    scope: "Build around the work your team does",
    descriptions: [
      "Map who does what, where information lives and which tasks need a dedicated tool.",
      "Create browser-based tools for customers, operations or internal teams.",
      "Bring the workflows people need on the move into a mobile app.",
      "Connect existing systems and define how data moves between them.",
      "Automate repeatable steps and make exceptions visible to the right people.",
    ],
  },
  video: {
    headline: ["Give every frame ", { accent: "a purpose." }],
    scope: "Find the right cut for the story",
    descriptions: [
      "Shape raw footage through pacing, selects, sound and transitions.",
      "Animate typography and visual elements to direct attention and explain ideas.",
      "Build short cuts around a strong opening and the platform’s viewing format.",
      "Break a complex idea into a sequence people can follow.",
      "Create versions of the same message for different formats and audiences.",
    ],
  },
  illustration: {
    headline: ["Imagery with ", { accent: "a point of view." }],
    scope: "Find a visual language for your idea",
    descriptions: [
      "Develop a style that fits the brief and works across the intended formats.",
      "Explore silhouettes, expressions and poses that make characters recognizable.",
      "Turn actions, ideas and information into a coherent system of visuals.",
      "Sketch the key beats of a campaign, film or animation before production.",
      "Create artwork that brings an article or publication’s central idea into focus.",
    ],
  },
};
