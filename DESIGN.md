# Invenzee design system: "Midnight & Signal"

Art direction for the Invenzee landing page. This file is the brief every section is built against. The tokens it describes live in `src/app/globals.css`; the copy lives in `src/content/site.ts`.

## 1. Concept

Invenzee is an all-in-one digital agency: marketing, design, code and motion in one team. The design shows that duality on every screen:

- **The precise voice** (tech): a geometric sans, mono labels, hairline grids, exact alignment.
- **The inventive voice** (creative): one or two words per heading set in a soft, wonky italic serif.

Structure is inspired by bitwip.fr (dark cinematic hero, a tile that expands on scroll, alternating dark and light "sheets", accordion services, horizontal work rail, giant footer wordmark). The identity is Invenzee's own: midnight navy and signal cyan from the logo. Never use Bitwip's orange, cream paper, fonts or star glyph.

## 2. Colour

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#07081C` | Page background, dark sections |
| `ink-2` | `#0E1030` | Cards and surfaces on dark |
| `ink-3` | `#171A4A` | Hover surfaces on dark |
| `navy` | `#101145` | Logo navy. Text on light sections, text on cyan |
| `cyan` | `#4BC5DE` | Logo cyan. The only brand accent: CTAs, the signal dot, active states |
| `cyan-bright` | `#86E2F5` | Hover for cyan |
| `cyan-deep` | `#0B7F99` | Cyan for text and icons on light backgrounds |
| `paper` | `#EFF2F6` | Light sections |
| `paper-2` | `#E1E7EF` | Surfaces and hairlines on light |
| `lime` `coral` `violet` `amber` `pink` | see CSS | Discipline markers only: small squares, thin strokes. Never large fills, never text |

Rules:

- Sections are either `.theme-dark` or `.theme-light`. Inside them use the theme-aware utilities only: `bg-bg`, `bg-surface`, `text-fg`, `text-fg-2`, `text-fg-3`, `border-line`, `border-line-2`, `text-signal`. This keeps every component correct on both themes.
- Cyan is used sparingly: one primary CTA per view, the signal dot, active and hover states. Body text is never cyan.
- No gradients on text. No glassmorphism except the floating nav pill. No drop shadows on dark sections.

## 3. Typography

| Role | Font | Utility | Notes |
| --- | --- | --- | --- |
| Display | Outfit | `t-hero`, `t-h2`, `t-h3`, `t-h4`, `font-display` | Hero is 800 uppercase. Headings are 500 with tight tracking |
| Body | DM Sans | `t-lead`, `t-body`, `t-small`, `font-sans` | 400 |
| Accent | Fraunces italic (SOFT 100, WONK 1) | `accent` | 1 to 2 words per heading, never whole sentences, never body copy |
| Label | DM Mono | `t-label` | 12px uppercase, 0.14em tracking. Section labels, tags, meta |

Rules:

- Headings never end with a full stop. They end with the **signal dot** (`<span class="dot">`), the rounded cyan square from the "i" in the wordmark. The `Heading` component adds it.
- Use the `Heading` component for every section heading. It takes `parts` from the content file and animates word by word.
- Sentence case everywhere except the hero line and mono labels.
- Numbers (stats, step numbers) are Outfit 300 at large sizes with `tabular-nums`.

## 4. Layout

- `.wrap`: max width 1680px, side margin `--m` = clamp(20px, 4vw, 64px).
- `.sec`: vertical padding `--sec` = clamp(80px, 9vw, 152px).
- `.grid-12`: 12 columns, gutter `--g` = clamp(16px, 2vw, 32px). Below `lg` (1024px) collapse to a single column unless stated.
- Light sections are **sheets**: `theme-light sheet`. A sheet has large rounded corners (`--radius-sheet`) and sits on the ink page, so the dark shows around its corners. The section element itself carries the background and radius; put `.wrap` on an inner div.
- Cards: radius 24px (`rounded-card`). Tiles (the logo-like square): radius 22%.
- Hairlines: 1px `border-line`. Lists are separated by hairlines, not boxes.
- Breakpoints to design for: 390 (mobile), 768 (tablet), 1024, 1440, 1920. Nothing may overflow horizontally at 360px.

## 5. Brand glyphs

- **Signal dot** `.dot`: ends headings.
- **Square marker** `.sq`: precedes labels and list items. Colour via the `--sq` CSS variable.
- **Slash** `/`: separator between inline list items, coloured `text-signal`. Echoes the diagonal strokes of the logo mark.
- **Tile**: a rounded square (22% radius) that frames artwork, echoing the white tile in the logo. The hero tile is the main instance.
- **Corner triangle**: the logo has a cyan triangle in the top-left corner of the tile. It may be reused once or twice (for example on the hero tile) as a small clipped corner. Do not overuse it.

## 6. Motion

- Easing: `ease-expo` (cubic-bezier(.16,1,.3,1)) for entrances, `ease-io` for loops and scrubbed transitions. GSAP equivalents: `expo.out`, `power3.inOut`.
- Smooth scroll: Lenis is already running (see `SmoothScroll.tsx`). Scroll-driven effects use GSAP ScrollTrigger imported from `@/lib/gsap`.
- Entrances: headings rise word by word (`Heading`), blocks fade and lift 28px (`Reveal`), staggered 60 to 90ms.
- Hover: links draw a cyan underline from the left; buttons slide the arrow through the chip; cards lift artwork scale to 1.04 over 900ms.
- Always wrap GSAP work in `useGSAP` with a scope ref, and in `gsap.matchMedia()` so pinned and scrubbed effects only run at `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`. Mobile and reduced-motion users get a simple static or natively scrolling layout.
- Nothing should move for more than about 1.2s on entrance. No bounce or elastic easing.

## 7. Shared building blocks (already written, do not modify)

| Import | What it is |
| --- | --- |
| `@/content/site` | All copy and data: `site`, `nav`, `hero`, `about`, `services`, `showcase`, `process`, `marquee`, `faq`, `contact`, `footer`, `markerHex` |
| `@/components/ui/Heading` | `<Heading parts={...} as="h2" className="t-h2" dot delay show />` |
| `@/components/ui/Reveal` | `<Reveal delay={i * 80}>...</Reveal>` |
| `@/components/ui/Button` | `<Button href variant="primary|outline|solid" size="md|lg">`, `<ArrowLink href>`, `<ArrowIcon />` |
| `@/components/ui/Label` | `<Label color={hex}>What we do</Label>` |
| `@/components/ui/Logo` | `<Logo variant="full|ink|mark" height={32} />` |
| `@/components/ui/LiveClock` | `<LiveClock timeZone="Asia/Karachi" />`, `<CurrentYear />` |
| `@/components/ui/Artwork` | `<Artwork variant tone className animated />`: code-drawn brand artwork that fills its container |
| `@/lib/gsap` | `gsap`, `ScrollTrigger`, `useGSAP`, `prefersReducedMotion()` |
| `@/lib/useInView` | `useInView()` hook |
| `@/lib/ready` | `markReady()`, `onReady(cb)`, `isReady()`: the preloader-finished signal |
| `@/components/providers/SmoothScroll` | `getLenis()`, `setScrollLocked(bool)`, `scrollToTarget(target, offset)` |

## 8. Page structure

Order and theme of the landing page (`src/app/page.tsx`):

1. `Preloader`: ink. Logo mark, then the hero line assembles.
2. `Nav`: fixed. Full-width bar at the top of the page, condenses into a floating glass pill after scrolling.
3. `Hero`: dark. `WE [tile] INVENT / what's next■`. The tile expands to full screen on scroll, then the statement appears over it.
4. `About` (`#about`): light sheet. Heading, lead, stats grid, drifting artwork strip.
5. `Services` (`#services`): dark. Accordion of six disciplines with a sticky artwork preview.
6. `Showcase` (`#work`): dark. Pinned horizontal rail of capability cards.
7. `Process` (`#process`): light sheet. Four numbered steps.
8. `MarqueeBand`: dark. Two rows of oversized discipline names drifting in opposite directions.
9. `Faq` (`#faq`): light sheet. Accordion.
10. `Contact` (`#contact`): dark. Big heading, form, contact details.
11. `Footer`: dark. Link columns, live clocks, giant wordmark.

## 9. Engineering rules

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (tokens in `globals.css` via `@theme`). Read `AGENTS.md` first: bundled docs are in `node_modules/next/dist/docs/`.
- `cacheComponents` is enabled. Never call `new Date()`, `Date.now()` or `Math.random()` while rendering a server component. Use `LiveClock` or `CurrentYear`, or do it in an effect.
- Add `"use client"` only where a component needs state, effects or GSAP.
- Style with Tailwind utilities and the tokens above. If a section needs keyframes or complex selectors, add a CSS module next to it (`Hero.module.css`). Do not edit `globals.css`, `site.ts`, `layout.tsx`, `page.tsx` or anything in `components/ui`, `components/providers` or `lib`. If one of them needs a change, report it instead.
- Copy comes from `src/content/site.ts`. Do not invent clients, testimonials, awards or metrics.
- Accessibility: semantic landmarks, one `h1` (in the hero), buttons for actions and links for navigation, `aria-expanded` and `aria-controls` on accordions, visible focus, decorative artwork `aria-hidden`. Text contrast at least 4.5:1.
- Do not add dependencies. Available: `gsap` (including `gsap/SplitText`), `@gsap/react`, `lenis`.
- Do not run `npm run dev`, `npm run build` or `next` commands: a dev server is already running on http://localhost:3000 and parallel builds corrupt its cache. Verify with `npx tsc --noEmit` and `npx eslint <your files>`.
