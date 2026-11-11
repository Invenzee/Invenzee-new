/* ==========================================================================
   INVENZEE — all landing page copy and data lives here.
   Sections read from this file; do not hard-code copy inside components.
   ========================================================================== */

/** A heading is a list of parts. A plain string is set in the display sans;
 *  `{ accent }` is set in the italic accent serif (1–2 words per heading). */
export type HeadingPart = string | { accent: string };

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
  eyebrow: "The all-in-one digital agency",
  /* Rendered as:  WE [tile] INVENT  /  what's next■  */
  line1: ["We", "invent"],
  line2: "What’s Next",
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
    { accent: "everything" },
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
  title: string;
  color: MarkerColor;
  summary: string;
  items: string[];
  art: ArtVariant;
  tone: ArtTone;
  cta: string;
};

export const services = {
  id: "services",
  label: "What we do",
  heading: ["Our ", { accent: "services" }] satisfies HeadingPart[],
  intro: "Six disciplines, one team. Hire us for one, or let them work together.",
  list: [
    {
      id: "marketing",
      title: "Digital marketing",
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
      cta: "Grow your audience",
    },
    {
      id: "design",
      title: "Graphic design & branding",
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
      cta: "Build your brand",
    },
    {
      id: "web",
      title: "Website development",
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
      cta: "Launch your website",
    },
    {
      id: "software",
      title: "Software development",
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
      cta: "Build your product",
    },
    {
      id: "video",
      title: "Video editing & motion",
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
      cta: "Tell your story",
    },
    {
      id: "illustration",
      title: "Illustration",
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
      cta: "Draw your world",
    },
  ] satisfies Service[],
};

export type ShowcaseItem = {
  title: string;
  discipline: string;
  color: MarkerColor;
  blurb: string;
  art: ArtVariant;
  tone: ArtTone;
};

/* TODO(invenzee): replace these capability cards with real case studies
   (client name, real screenshot/photo, result) once project assets are ready. */
export const showcase = {
  id: "work",
  label: "What we make",
  heading: [
    "A taste of what ",
    "we ",
    { accent: "make" },
  ] satisfies HeadingPart[],
  intro:
    "From a logo sketch to a shipped product: the range we cover without leaving the building.",
  link: { label: "Start a project", href: "#contact" },
  items: [
    {
      title: "Logo & identity systems",
      discipline: "Graphic design",
      color: "coral",
      blurb: "Marks, palettes and guidelines built to be recognised at a glance.",
      art: "brand",
      tone: "navy",
    },
    {
      title: "E-commerce stores",
      discipline: "Website development",
      color: "cyan",
      blurb: "Storefronts that load fast, look sharp and make checkout easy.",
      art: "web",
      tone: "ink",
    },
    {
      title: "Search & paid campaigns",
      discipline: "Digital marketing",
      color: "lime",
      blurb: "SEO and PPC run together, so every click has a job to do.",
      art: "growth",
      tone: "paper",
    },
    {
      title: "Mobile & web apps",
      discipline: "Software development",
      color: "violet",
      blurb: "Products shaped around your workflow, from prototype to release.",
      art: "app",
      tone: "cyan",
    },
    {
      title: "Reels & explainers",
      discipline: "Video editing",
      color: "amber",
      blurb: "Short-form edits and motion graphics made for the scroll.",
      art: "motion",
      tone: "navy",
    },
    {
      title: "Custom illustration",
      discipline: "Illustration",
      color: "pink",
      blurb: "Characters, icons and editorial artwork drawn for your brand only.",
      art: "illustration",
      tone: "paper",
    },
    {
      title: "Social media content",
      discipline: "Digital marketing",
      color: "lime",
      blurb: "Calendars, creatives and captions that keep your feed alive.",
      art: "brand",
      tone: "cyan",
    },
    {
      title: "Business dashboards",
      discipline: "Software development",
      color: "violet",
      blurb: "Your numbers in one place, built on the tools you already use.",
      art: "growth",
      tone: "ink",
    },
  ] satisfies ShowcaseItem[],
};

export const process = {
  id: "process",
  label: "How we work",
  heading: [
    "From brief to ",
    { accent: "launch" },
    " in four moves",
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
      title: "Create",
      text: "Designers, developers, editors and illustrators work in parallel, with regular check-ins along the way.",
    },
    {
      n: "04",
      title: "Launch & grow",
      text: "We ship, measure and keep improving, with SEO, ads and content that build on each other.",
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
