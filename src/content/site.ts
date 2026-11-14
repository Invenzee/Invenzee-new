/* ==========================================================================
   INVENZEE — all landing page copy and data lives here.
   Sections read from this file; do not hard-code copy inside components.
   ========================================================================== */

/** A heading is a list of parts. A plain string is set in the display sans;
 *  `{ accent }` is set in the italic accent serif (1–2 words per heading). */
export type HeadingPart = string | { accent: string };

/** Plain-text reading of a heading, for captions, links, and form values. */
export function headingText(parts: readonly HeadingPart[]): string {
  return parts.map((part) => (typeof part === "string" ? part : part.accent)).join("");
}

export type ArtVariant =
  | "brand"
  | "web"
  | "app"
  | "growth"
  | "motion"
  | "illustration";

export type ArtTone = "navy" | "cyan" | "paper" | "ink";

export type MarkerColor =
  | "cyan"
  | "lime"
  | "coral"
  | "violet"
  | "amber"
  | "pink";

export const markerHex: Record<MarkerColor, string> = {
  cyan: "#4bc5de",
  lime: "#c6f26b",
  coral: "#ff7a59",
  violet: "#9d8cff",
  amber: "#ffc857",
  pink: "#ff8fc7",
};

export const site = {
  name: "Invenzee",
  url: "https://invenzee.com",
  description:
    "Invenzee is an all-in-one digital agency: marketing, SEO and PPC, graphic design, website and software development, video editing and illustration, under one roof.",
  email: "info@invenzee.com",
  phones: [
    { label: "USA", display: "+1-424-424-5752", href: "tel:+14244245752" },
    { label: "PK", display: "+92 331-4302109", href: "tel:+923314302109" },
  ],
  address: {
    lines: ["502, 5th Floor, Emarah Suites", "Karachi, Pakistan"],
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Emarah+Suites+Karachi+Pakistan",
  },
  /* Live clocks shown in the hero bar and footer */
  clocks: [
    { city: "Karachi", code: "KHI", timeZone: "Asia/Karachi" },
    { city: "United States", code: "USA", timeZone: "America/Los_Angeles" },
  ],
} as const;

export const nav = {
  links: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: { label: "Start a project", href: "#contact" },
} as const;

export const hero = {
  eyebrow: "The digital agency where",
  /* Rendered as:  WE [tile] INVENT  /  what's next■  */
  line1: ["Invention", "Meets"],
  line2: "Creativity",
  /* Artwork shown inside the tile; cycles, then expands to fill the screen on scroll */
  slides: [
    { art: "brand", tone: "navy", caption: "Brand identity" },
    { art: "web", tone: "ink", caption: "Web experiences" },
    { art: "motion", tone: "cyan", caption: "Video & motion" },
    { art: "app", tone: "navy", caption: "Custom software" },
  ] satisfies { art: ArtVariant; tone: ArtTone; caption: string }[],
  /* Statement revealed over the expanded artwork */
  statement: [
    "Invenzee brings ",
    { accent: "marketing" },
    ", ",
    { accent: "design" },
    ", ",
    { accent: "code" },
    " and ",
    { accent: "motion" },
    " under one roof, so your brand moves as one.",
  ] satisfies HeadingPart[],
  scrollHint: "Scroll",
};

export const about = {
  id: "about",
  label: "About Invenzee",
  heading: [
    "One team for ",
    { accent: "Everything" },
    " your brand needs",
  ] satisfies HeadingPart[],
  lead: "Invenzee is an all-in-one digital agency based in Karachi, working with brands in the USA, Pakistan and beyond.",
  body: "Strategists, designers, developers, editors and illustrators sit at the same table, so nothing gets lost between vendors. You brief once. We carry it from the first sketch to the last line of code.",
  link: { label: "Start a project", href: "#contact" },
  stats: [
    { value: "6", label: "Disciplines under one roof" },
    { value: "2", label: "Countries on call: USA & PK" },
    { value: "360°", label: "From strategy to launch" },
    { value: "1", label: "Team, one brief" },
  ],
  /* Artwork strip that drifts sideways under the stats */
  strip: [
    { art: "brand", tone: "navy" },
    { art: "illustration", tone: "cyan" },
    { art: "web", tone: "ink" },
    { art: "growth", tone: "paper" },
    { art: "motion", tone: "navy" },
    { art: "app", tone: "cyan" },
  ] satisfies { art: ArtVariant; tone: ArtTone }[],
};

export type Service = {
  id: string;
  title: HeadingPart[];
  color: MarkerColor;
  summary: string;
  items: string[];
  art: ArtVariant;
  tone: ArtTone;
  cta: string;
  image?: string;
};

export const services = {
  id: "services",
  label: "What we do",
  heading: ["Our ", { accent: "Services" }] satisfies HeadingPart[],
  intro: "Six disciplines, one team. Hire us for one, or let them work together.",
  list: [
    {
      id: "marketing",
      title: ["Digital ", { accent: "Marketing" }] satisfies HeadingPart[],
      color: "lime",
      summary:
        "Strategy and campaigns that put your brand in front of the right people, measured against real results.",
      items: [
        "SEO",
        "PPC & Google Ads",
        "Social media marketing",
        "Content marketing",
        "Email marketing",
      ],
      art: "growth",
      tone: "ink",
      image: "/services/marketing.jpg",
      cta: "Grow your audience",
    },
    {
      id: "design",
      title: ["Graphic ", { accent: "Design" }] satisfies HeadingPart[],
      color: "coral",
      summary:
        "A distinctive identity and a visual language that holds together on every screen and every print.",
      items: [
        "Logo & visual identity",
        "Brand guidelines",
        "Social media creatives",
        "Print & packaging",
        "UI/UX design",
      ],
      art: "brand",
      tone: "navy",
      image: "/services/design.jpg",
      cta: "Build your brand",
    },
    {
      id: "web",
      title: ["Website ", { accent: "Development" }] satisfies HeadingPart[],
      color: "cyan",
      summary:
        "Fast, responsive websites and online stores, designed to convert and easy for your team to manage.",
      items: [
        "Business websites",
        "E-commerce stores",
        "Landing pages",
        "CMS & WordPress",
        "Maintenance & hosting",
      ],
      art: "web",
      tone: "ink",
      image: "/services/web.jpg",
      cta: "Launch your website",
    },
    {
      id: "software",
      title: ["Software ", { accent: "Development" }] satisfies HeadingPart[],
      color: "violet",
      summary:
        "Custom software, web apps and mobile apps that fit the way your business actually works.",
      items: [
        "Custom software",
        "Web applications",
        "Mobile apps",
        "APIs & integrations",
        "Automation",
      ],
      art: "app",
      tone: "navy",
      image: "/services/software.jpg",
      cta: "Build your product",
    },
    {
      id: "video",
      title: ["Video ", { accent: "Editing" } , " & Motion"] satisfies HeadingPart[],
      color: "amber",
      summary:
        "Edits, reels and motion graphics that hold attention from the first second to the last frame.",
      items: [
        "Video editing",
        "Motion graphics",
        "Reels & short-form",
        "Explainer videos",
        "Ad creatives",
      ],
      art: "motion",
      tone: "cyan",
      image: "/services/video.jpg",
      cta: "Tell your story",
    },
    {
      id: "illustration",
      title: ["Illustration"],
      color: "pink",
      summary:
        "Original illustration that gives your brand a look nobody else has.",
      items: [
        "Custom illustration",
        "Character design",
        "Icons & infographics",
        "Storyboards",
        "Editorial artwork",
      ],
      art: "illustration",
      tone: "cyan",
      image: "/services/illustration.jpg",
      cta: "Draw your world",
    },
  ] satisfies Service[],
};

/** A block inside a work dialog. Add as many as you need, in any order. */
export type WorkBlock =
  | { kind: "text"; text: string }
  | { kind: "button"; label: string; href: string };

export type ShowcaseItem = {
  title: string;
  discipline: string;
  color: MarkerColor;
  blurb: string;
  art: ArtVariant;
  tone: ArtTone;
  /** Real photo. When omitted, the card and the dialog use the artwork. */
  image?: string;
  /** Full-page website. The card shows the hero; the popup scrolls the rest. */
  long?: boolean;
  blocks: WorkBlock[];
};

function work(
  title: string,
  discipline: string,
  color: MarkerColor,
  file: string,
  blurb: string,
  long = false,
): ShowcaseItem {
  return {
    title,
    discipline,
    color,
    blurb,
    art: "web",
    tone: "ink",
    image: `/real%20project%20images/${encodeURIComponent(file)}`,
    ...(long ? { long: true } : {}),
    blocks: [
      { kind: "text", text: blurb },
      { kind: "button", label: "Start a project", href: "#contact" },
    ],
  };
}

export const showcase = {
  id: "work",
  label: "What we make",
  heading: [" ", { accent: "Our Work" }] satisfies HeadingPart[],
  intro:
    "Logos, apps and websites from the work. Long sites open on the hero, then scroll in the popup.",
  link: { label: "Start a project", href: "#contact" },
  items: [
    work(
      "Connect",
      "Software development",
      "violet",
      "image (1).png",
      "A matching app: welcome, login, discovery and chat, laid out as one product.",
    ),
    work(
      "City General Hospital",
      "Software development",
      "cyan",
      "image (2).png",
      "A hospital app for getting started, signing in, booking a doctor and reading records.",
    ),
    work(
      "Aurora",
      "Software development",
      "violet",
      "image (3).png",
      "A digital wallet: the start screen, a balance, a secure PIN and sending money.",
    ),
    work(
      "HomeHaven",
      "Software development",
      "cyan",
      "image (4).png",
      "A stays app for finding a cabin, reading the listing and confirming a booking.",
    ),
    work(
      "Western Foods",
      "Graphic design",
      "coral",
      "image (5).png",
      "A food mark built from a cloche and a sauce bottle, set in black and orange.",
    ),
    work(
      "Private Chef Wānaka",
      "Graphic design",
      "lime",
      "image (6).png",
      "A mountain mark for a private chef, with a local and sustainable line underneath.",
    ),
    work(
      "The Burger And Bowl",
      "Graphic design",
      "coral",
      "image (7).png",
      "A burger illustration and a hand-lettered wordmark for a casual food brand.",
    ),
    work(
      "Just 4u By Ell",
      "Graphic design",
      "amber",
      "image (8).png",
      "A leaf mark and a wordmark for an all-natural hair growth oil.",
    ),
    work(
      "Liberty Tax",
      "Graphic design",
      "violet",
      "image (9).png",
      "A navy and red mark pairing a house, an upward arrow and the Statue of Liberty.",
    ),
    work(
      "Abritex",
      "Graphic design",
      "violet",
      "image (10).png",
      "A wordmark with a gradient stroke for Abritex LLC.",
    ),
    work(
      "The Hero Project",
      "Graphic design",
      "coral",
      "image (11).png",
      "A shield, a star and a rising arrow for a community project.",
    ),
    work(
      "Kool",
      "Graphic design",
      "coral",
      "image (12).png",
      "A single white script wordmark on a flat orange field.",
    ),
    work(
      "MS General",
      "Graphic design",
      "cyan",
      "image (13).png",
      "A cleaning mark: buildings, a house and a squeegee, for MS General.",
    ),
    work(
      "Carlos Tuning",
      "Graphic design",
      "coral",
      "image (14).png",
      "A speedometer car and a red wordmark for an auto tuning brand.",
    ),
    work(
      "Cuzin's Duzin",
      "Graphic design",
      "pink",
      "image (15).png",
      "A sprinkled donut and a block wordmark on magenta.",
    ),
    work(
      "Technofy Labs",
      "Website development",
      "coral",
      "image (16).png",
      "A long agency site. The card shows the hero. Open it and scroll the rest of the page.",
      true,
    ),
    work(
      "Chapter Bookshop",
      "Website development",
      "violet",
      "image (17).png",
      "A bookshop site. The card keeps the hero. The popup scrolls the full page.",
      true,
    ),
    work(
      "Pampered Paws",
      "Website development",
      "amber",
      "image (18).png",
      "A pet-grooming site. The card shows the hero. Scroll the rest in the popup.",
      true,
    ),
    work(
      "Hospitality Insights",
      "Website development",
      "violet",
      "image (19).png",
      "A consulting site for hospitality businesses. Open it to scroll past the hero.",
      true,
    ),
    work(
      "Pampered Paws page",
      "Website development",
      "amber",
      "image (20).png",
      "A full-page view of Pampered Paws. The hero stays on the card. The page scrolls in the popup.",
      true,
    ),
    work(
      "Pickup Pals",
      "Website development",
      "pink",
      "image (21).png",
      "A children's book site. The card shows the opening. Scroll the rest in the popup.",
      true,
    ),
    work(
      "Tutor Next",
      "Website development",
      "amber",
      "image (22).png",
      "A learning site homepage: courses, certification and a place to start.",
    ),
    work(
      "MS General Cleaning",
      "Website development",
      "cyan",
      "image (23).png",
      "A cleaning and maintenance site. The hero stays on the card. The full page scrolls in the popup.",
      true,
    ),
    work(
      "The Coffee Shop",
      "Website development",
      "amber",
      "image (24).png",
      "A coffee shop page. The card shows the hero. Open it to scroll the products below.",
      true,
    ),
    work(
      "Vale",
      "Website development",
      "violet",
      "image (25).png",
      "A medical treatments homepage, with the offer and the treatment list on one screen.",
    ),
    work(
      "Technofy Labs hero",
      "Website development",
      "coral",
      "image (26).png",
      "The Technofy Labs opening screen, with the services sitting on the headline.",
    ),
  ] satisfies ShowcaseItem[],
};

export const process = {
  id: "process",
  label: "How we work",
  heading: [
    "From brief to ",
    { accent: "launch" },
    " in six moves",
  ] satisfies HeadingPart[],
  intro:
    "A clear path keeps projects on time and on budget. Here is how every engagement runs.",
  steps: [
    {
      n: "01",
      title: "Discover",
      text: "We learn your business, your audience and your goals, and review what you already have.",
    },
    {
      n: "02",
      title: "Plan",
      text: "You get a clear scope: positioning, channels, deliverables, timeline and budget, agreed before we build.",
    },
    {
      n: "03",
      title: "Design",
      text: "We shape the look, the words and the structure, and you approve them before a line of the build starts.",
    },
    {
      n: "04",
      title: "Build",
      text: "Designers, developers, editors and illustrators work in parallel, with regular check-ins along the way.",
    },
    {
      n: "05",
      title: "Launch",
      text: "We ship the site, the campaign or the product, and check that every piece works in the real world.",
    },
    {
      n: "06",
      title: "Grow",
      text: "We measure what lands and keep improving, with SEO, ads and content that build on each other.",
    },
  ],
};

export const marquee = {
  words: [
    "Branding",
    "SEO",
    "PPC",
    "Web development",
    "Software",
    "Video editing",
    "Illustration",
    "Social media",
    "UI/UX",
    "Motion graphics",
  ],
};

export const faq = {
  id: "faq",
  label: "FAQ",
  heading: ["Got ", { accent: "questions?" }] satisfies HeadingPart[],
  intro: "Answers to the questions we hear most often.",
  link: { label: "Ask us anything", href: "#contact" },
  items: [
    {
      q: "What services does Invenzee offer?",
      a: "Everything a brand needs to grow online: digital marketing, SEO and PPC, graphic design and branding, website development, custom software, video editing and illustration.",
    },
    {
      q: "Can I hire you for just one service?",
      a: "Yes. Many clients start with a single project, such as a website, a logo or an ad campaign, and bring in other disciplines as they grow.",
    },
    {
      q: "Do you work with clients outside Pakistan?",
      a: "Yes. We are based in Karachi and work with clients in the USA and worldwide. Reach us on our US line at +1-424-424-5752 or our Pakistan line at +92 331-4302109.",
    },
    {
      q: "How does a project start?",
      a: "With a conversation. Tell us your goals, timeline and budget, and we reply with a clear scope and proposal before any work begins.",
    },
    {
      q: "How much does a project cost?",
      a: "It depends on the scope. After a short discovery call we send a quote, so you know the cost before you commit.",
    },
    {
      q: "Do you offer ongoing support?",
      a: "Yes. SEO, ad management, content, video and site maintenance can all run month to month once your project is live.",
    },
  ],
};

export const contact = {
  id: "contact",
  label: "Contact",
  heading: [
    "Got an idea? Let’s ",
    { accent: "invent" },
    " it",
  ] satisfies HeadingPart[],
  intro: "Tell us what you are building. We will get back to you with next steps.",
  form: {
    name: "Your name",
    email: "Your email",
    service: "What do you need?",
    serviceFallback: "Not sure yet",
    message: "Tell us about your project",
    submit: "Send message",
    note: "Sending opens your email app with the message ready to go.",
  },
  details: {
    address: "Our Address",
    mailbox: "Our Mailbox",
    phone: "Our Phone",
  },
};

export const footer = {
  blurb:
    "The all-in-one digital agency for marketing, design, development and motion.",
  columns: {
    services: "Services",
    company: "Company",
    contact: "Get in touch",
    office: "Office",
  },
  legal: "Invenzee. All rights reserved.",
};
