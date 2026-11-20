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
    { label: "USA", flag: "US", display: "+1-424-424-5752", href: "tel:+14244245752" },
    { label: "PK", flag: "PK", display: "+92 331-4302109", href: "tel:+923314302109" },
  ],
  address: {
    lines: ["502, 5th Floor, Emarah Suites", "Karachi, Pakistan"],
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Emarah+Suites+Karachi+Pakistan",
  },
  /* Live clocks shown in the hero bar and footer */
  clocks: [
    { city: "Karachi", code: "KHI", flag: "PK", timeZone: "Asia/Karachi" },
    { city: "United States", code: "USA", flag: "US", timeZone: "America/Los_Angeles" },
  ],
} as const;

export const nav = {
  links: [
    { label: "Services", href: "/#services", menu: "services" },
    { label: "Work", href: "/#work" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/about", menu: "about" },
  ],
  cta: { label: "Start a project", href: "/contact" },
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

export const navMenus = {
  services: {
    title: ["Pick one. ", { accent: "Or all six." }] satisfies HeadingPart[],
    cta: { label: "All services", href: "/#services" },
    items: services.list.map((service) => ({
      href: `/services/${service.id}`,
      title: headingText(service.title),
      image: service.image,
    })),
  },
  about: {
    title: ["Meet the", { accent: "studio." }] satisfies HeadingPart[],
    cta: { label: "About the agency", href: "/about" },
    items: [
      {
        href: "/about",
        title: "About us",
        text: "The studio, the path, and the team",
      },
      {
        href: "/#process",
        title: "How we work",
        text: "From brief to launch in six moves",
      },
      {
        href: nav.cta.href,
        title: "Get in touch",
        text: "Address, mailbox and phone",
      },
    ],
  },
} as const;

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
    blocks: [{ kind: "button", label: "Start a project", href: "#contact" }],
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
      "A dating app in four screens: a welcome, sign-in with email or social, a match card, and a live chat. Getting started, finding someone, and talking all sit in one product.",
    ),
    work(
      "City General Hospital",
      "Software development",
      "cyan",
      "image (2).png",
      "A hospital app for City General: welcome, login, booking a doctor, and a patient’s records. Find a specialist, book a time, and review reports and medications from one place.",
    ),
    work(
      "Aurora",
      "Software development",
      "violet",
      "image (3).png",
      "A digital wallet called Aurora. The set covers the start screen, a balance with cards, a secure PIN, and sending money. Send, receive, pay, and confirm live on one product.",
    ),
    work(
      "HomeHaven",
      "Software development",
      "cyan",
      "image (4).png",
      "A stays app for finding a place to stay. Six screens take you from the welcome through search, the cabin listing, amenities, and a confirmed booking.",
    ),
    work(
      "Western Foods",
      "Graphic design",
      "coral",
      "image (5).png",
      "A food mark for Western Foods: a black cloche and an orange sauce bottle, with WESTERN in black and FOODS in orange underneath.",
    ),
    work(
      "Private Chef Wānaka",
      "Graphic design",
      "lime",
      "image (6).png",
      "A mountain and sun mark on deep green for a private chef in Wānaka. The line underneath reads local, sustainable, and ethical.",
    ),
    work(
      "The Burger And Bowl",
      "Graphic design",
      "coral",
      "image (7).png",
      "A sesame burger illustration with a red script wordmark and a black “And Bowl” underneath, for a casual food brand.",
    ),
    work(
      "Just 4u By Ell",
      "Graphic design",
      "amber",
      "image (8).png",
      "A green leaf mark and a white wordmark on brown for Just 4u By Ell, an all-natural hair growth oil.",
    ),
    work(
      "Liberty Tax",
      "Graphic design",
      "violet",
      "image (9).png",
      "A navy Statue of Liberty set inside a red house outline, with an upward arrow, above the Liberty Tax wordmark.",
    ),
    work(
      "Abritex",
      "Graphic design",
      "violet",
      "image (10).png",
      "A white wordmark on black for Abritex LLC, cut by a blue-to-purple stroke that runs through the letters.",
    ),
    work(
      "The Hero Project",
      "Graphic design",
      "coral",
      "image (11).png",
      "A black shield, three red figures, a rising arrow and a star, set above The Hero Project wordmark.",
    ),
    work(
      "Kool",
      "Graphic design",
      "coral",
      "image (12).png",
      "A single white script wordmark, underlined, on a flat orange field.",
    ),
    work(
      "MS General",
      "Graphic design",
      "cyan",
      "image (13).png",
      "A cleaning mark for MS General: city buildings, a house and a squeegee, with the company name set in blue underneath.",
    ),
    work(
      "Carlos Tuning",
      "Graphic design",
      "coral",
      "image (14).png",
      "A silver speedometer drawn as a car, with a red Carlos wordmark and white Tuning underneath, for an auto tuning brand.",
    ),
    work(
      "Cuzin's Duzin",
      "Graphic design",
      "pink",
      "image (15).png",
      "A pink sprinkled donut above a silver block wordmark, set on magenta for Cuzin's Duzin.",
    ),
    work(
      "Technofy Labs",
      "Website development",
      "coral",
      "image (16).png",
      "A long agency site for Technofy Labs. It runs from the Create Impact hero through branding, design, marketing, portfolio, pricing, and a contact form. Scroll the full page here.",
      true,
    ),
    work(
      "Chapter Bookshop",
      "Website development",
      "violet",
      "image (17).png",
      "A bookshop site, Crafting Tales One Chapter at a Time. Featured books, bestsellers, news, and a newsletter run down the page. Scroll the full shop here.",
      true,
    ),
    work(
      "Pampered Paws",
      "Website development",
      "amber",
      "image (18).png",
      "A pet-grooming site for Pampered Paws: services, pricing, a gallery, owner reviews, and a mailing list. Open it and scroll from the welcome to the footer.",
      true,
    ),
    work(
      "Hospitality Insights",
      "Website development",
      "violet",
      "image (19).png",
      "A consulting site for hospitality businesses. Solutions, calculations, services, a contact form, and client logos sit on one long page.",
      true,
    ),
    work(
      "Pampered Paws page",
      "Website development",
      "amber",
      "image (20).png",
      "The full Pampered Paws page, from the welcome through grooming services, pricing, the gallery, questions, and the footer.",
      true,
    ),
    work(
      "Pickup Pals",
      "Website development",
      "pink",
      "image (21).png",
      "A children's book site for Pickup Pals. The page holds the story, reviews from young readers, the author, a newsletter, and events.",
      true,
    ),
    work(
      "Tutor Next",
      "Website development",
      "amber",
      "image (22).png",
      "A learning homepage for Tutor Next. Curated courses, certification, and a place to start sit above a section on a more flexible way to learn.",
    ),
    work(
      "MS General Cleaning",
      "Website development",
      "cyan",
      "image (23).png",
      "A cleaning and maintenance site for MS General. Booking, home and office cleaning, property care, and client notes run down one page.",
      true,
    ),
    work(
      "The Coffee Shop",
      "Website development",
      "amber",
      "image (24).png",
      "A coffee shop page, Your Daily Dose of Delight. Drinks sit on the hero, and the best-selling products continue below.",
      true,
    ),
    work(
      "Vale",
      "Website development",
      "violet",
      "image (25).png",
      "A medical treatments homepage for Vale. The offer sits beside a clinician, then four treatments: hair loss, erectile dysfunction, premature ejaculation, and weight loss.",
    ),
    work(
      "Technofy Labs hero",
      "Website development",
      "coral",
      "image (26).png",
      "The Technofy Labs opening. Service cards for web development and logo design sit on the Create Impact headline, with the about block just below.",
    ),
  ] satisfies ShowcaseItem[],
};

function teamPhoto(file: string) {
  return `/team/${encodeURIComponent(file)}`;
}

/** Card pattern behind a portrait. Stays with the person when the list is reordered. */
export type TeamIcon =
  | "code"
  | "design"
  | "office"
  | "illustration"
  | "marketing"
  | "publish"
  | "video";

/** The About page. The homepage keeps its own short About section. */
export const aboutPage = {
  path: "/about",
  hero: {
    label: "About us",
    heading: ["Meet the ", { accent: "Minds" }] satisfies HeadingPart[],
    link: { label: "Meet the team", href: "#team" },
  },
  journey: {
    id: "journey",
    label: "Our journey",
    heading: [{ accent: "Our journey" }] satisfies HeadingPart[],
    intro:
      "A brand should not have to explain itself five times to get one result. This is the path the studio walks.",
    chapters: [
      {
        n: "01",
        title: "One table",
        text: "Strategists, designers, developers, editors and illustrators sit together. The brief is heard once and carried the whole way.",
      },
      {
        n: "02",
        title: "Karachi, and further out",
        text: "The studio is based in Karachi and works with brands in the USA, Pakistan and beyond. A US line and a Pakistan line both stay open.",
      },
      {
        n: "03",
        title: "Six disciplines",
        text: "Marketing, design, websites, software, video and illustration live under one roof. Hire one of them, or let them work as a set.",
      },
      {
        n: "04",
        title: "Shipped as one piece",
        text: "Logos, sites and products leave looking like they came from the same hands, from the first sketch to the last line of code.",
      },
    ],
  },
  goals: {
    id: "goals",
    label: "Our goals",
    heading: ["What we hold ", { accent: "the work" }, " to"] satisfies HeadingPart[],
    intro: "Four things we protect on every engagement, before a file is opened and after it ships.",
    list: [
      {
        n: "01",
        title: "One brief",
        text: "You explain the goal once. The same team carries it, so nothing has to be retold between vendors.",
        color: "cyan",
      },
      {
        n: "02",
        title: "A clear scope",
        text: "Positioning, deliverables, timeline and budget are agreed before the build starts.",
        color: "lime",
      },
      {
        n: "03",
        title: "One look",
        text: "Identity, interface, motion and words are drawn so they still match when they sit side by side.",
        color: "coral",
      },
      {
        n: "04",
        title: "Work that continues",
        text: "After launch, SEO, ads, content and care can keep running on what already shipped.",
        color: "violet",
      },
    ] satisfies {
      n: string;
      title: string;
      text: string;
      color: MarkerColor;
    }[],
  },
  team: {
    id: "team",
    label: "Our team",
    heading: ["The people on ", { accent: "the brief" }] satisfies HeadingPart[],
    intro:
      "Each person owns a discipline. They work the same job, at the same table.",
    link: nav.cta,
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/invenzee99" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/invenzee" },
    ],
    people: [
      {
        role: "Safdar Ali Khan",
        job: "Administrator & Publisher",
        handle: "product",
        icon: "publish",
        image: teamPhoto("Studio Portrait with Branded T-Shirt.png"),
      },
      {
        role: "Aryan-ul-Hassan",
        job: "Senior Graphic Designer",
        handle: "design",
        icon: "design",
        image: teamPhoto("Studio Portrait of Man Wearing Invenzee T-Shirt.png"),
      },
      {
        role: "Abdul Rehman",
        job: "Senior Marketing Manager",
        handle: "marketing-lead",
        icon: "marketing",
        image: teamPhoto("Confident Corporate Portrait with Gold Watch.png"),
      },
      {
        role: "Muhammad Ukasha",
        job: "Full Stack Developer",
        handle: "studio",
        icon: "code",
        image: teamPhoto("Studio Portrait with Invenzee Logo.png"),
      },
      {
        role: "Shehryar Khan",
        job: "Marketing Strategist",
        handle: "motion",
        icon: "marketing",
        image: teamPhoto("Invenzee T-Shirt Studio Portrait.png"),
      },
      {
        role: "Abdullah Khan",
        job: "Office Management",
        handle: "code",
        icon: "office",
        image: teamPhoto("Invenzee Studio Portrait.png"),
      },
      {
        role: "Junaid Talib",
        job: "Illustrator",
        handle: "marketing",
        icon: "illustration",
        image: teamPhoto("Professional Portrait with Invenzee Logo.png"),
      },
      {
        role: "Umer Siddique",
        job: "Junior Video Editor",
        handle: "illustration",
        icon: "video",
        image: teamPhoto("Studio Portrait with Inventive Logo.png"),
      },
    ] satisfies {
      role: string;
      job: string;
      handle: string;
      icon: TeamIcon;
      image: string;
    }[],
  },
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

export const testimonials = {
  id: "testimonials",
  label: "Testimonials",
  heading: ["Notes from ", { accent: "the work." }] satisfies HeadingPart[],
  intro:
    "A few notes from people we have built with. The line turns on its own, or pick a face.",
  people: [
    {
      name: "Amina Rahman",
      role: "Founder",
      place: "Karachi",
      flag: "PK" as const,
      image: "/testimonials/amina-rahman.jpg",
      quote:
        "One brief covered the brand, the site and the launch films. Nothing had to be explained twice.",
    },
    {
      name: "Daniel Cho",
      role: "Marketing lead",
      place: "Los Angeles",
      flag: "US" as const,
      image: "/testimonials/daniel-cho.jpg",
      quote:
        "They treated the campaign and the product as one story. The work arrived looking like it came from a single team.",
    },
    {
      name: "Sofia Almeida",
      role: "Product owner",
      place: "Lisbon",
      flag: "PT" as const,
      image: "/testimonials/sofia-almeida.jpg",
      quote:
        "The scope was clear before anyone opened a file. We always knew what was next, and what it would cost.",
    },
    {
      name: "Omar Farooq",
      role: "Studio director",
      place: "Dubai",
      flag: "AE" as const,
      image: "/testimonials/omar-farooq.jpg",
      quote:
        "Design, code and motion sat in the same thread. Reviews were short because the work was already aligned.",
    },
    {
      name: "Lena Vogel",
      role: "Editor",
      place: "Berlin",
      flag: "DE" as const,
      image: "/testimonials/lena-vogel.jpg",
      quote:
        "The edits matched the brand we had just drawn. It felt like the same hands were on both.",
    },
    {
      name: "James Okonkwo",
      role: "Founder",
      place: "London",
      flag: "GB" as const,
      image: "/testimonials/james-okonkwo.jpg",
      quote:
        "We started with a site and stayed for the campaigns. The handoff between disciplines never showed.",
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
  pageHeading: ["Contact ", { accent: "us" }] satisfies HeadingPart[],
  pageIntro: "Tell us about your project, what you’d like to achieve, and when you’d like to get started.",
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
