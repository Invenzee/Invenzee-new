"use client";

import type { CSSProperties } from "react";
import { about, aboutPage, markerHex, site, type TeamIcon } from "@/content/site";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import InfiniteSpiral from "@/components/ui/InfiniteSpiral/InfiniteSpiral";
import ProfileCard from "@/components/ui/ProfileCard/ProfileCard";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  return (
    <>
      <Hero />
      <Journey />
      <Goals />
      <Team />
    </>
  );
}

function Hero() {
  const { hero } = aboutPage;
  const portraits = aboutPage.team.people.map((person) => ({
    src: person.image,
    alt: `${person.role} at Invenzee`,
  }));
  return (
    <section className={`theme-dark ${styles.hero}`}>
      <div className={styles.heroMain}>
        <div className={styles.heroTop}>
          <div className={styles.heroCopy}>
            <Label>{hero.label}</Label>
            <Heading parts={hero.heading} as="h1" className="t-h2" />
            <Reveal delay={80}>
              <p className={`t-lead text-pretty text-fg ${styles.heroLead}`}>{about.lead}</p>
            </Reveal>
            <Reveal delay={140}>
              <p className={`t-body text-pretty text-fg-2 ${styles.heroBody}`}>{about.body}</p>
            </Reveal>
            <Reveal delay={200} className={styles.heroLink}>
              <ArrowLink href={hero.link.href}>{hero.link.label}</ArrowLink>
            </Reveal>
          </div>
          <p className={`t-label ${styles.places}`}>
            {site.clocks.map((clock, index) => (
              <span key={clock.timeZone}>
                {index > 0 ? <span className={styles.slash}> / </span> : null}
                {clock.city}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.stats}>
          {about.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70} className={styles.stat}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className="t-label text-fg-3">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <div className={styles.spiral}>
        <InfiniteSpiral
          items={portraits}
          animationMode="all"
          speed={0.55}
          radius={170}
          cardWidth={100}
          cardHeight={100}
          verticalSpacing={60}
          perspective={1000}
          cardRadius={10}
          centerScale={1.2}
          edgeBlur={6}
          cardsPerTurn={7}
          pauseOnHover
        />
      </div>
    </section>
  );
}

function Journey() {
  const { journey } = aboutPage;
  return (
    <section id={journey.id} className={`theme-light sheet relative z-10 ${styles.sheet}`}>
      <div className="wrap sec">
        <Label>{journey.label}</Label>
        <div className={styles.sectionHead}>
          <Heading parts={journey.heading} as="h2" className="t-h2" />
          <Reveal delay={80}>
            <p className="t-body text-pretty text-fg-2">{journey.intro}</p>
          </Reveal>
        </div>
        <ol className={styles.chapters}>
          {journey.chapters.map((chapter, index) => (
            <Reveal key={chapter.n} as="li" delay={index * 60} className={styles.chapter}>
              <p className={styles.chapterNum}>{chapter.n}</p>
              <div className={styles.chapterCopy}>
                <h3 className="t-h3">{chapter.title}</h3>
                <p className="t-body text-pretty text-fg-2">{chapter.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Goals() {
  const { goals } = aboutPage;
  return (
    <section id={goals.id} className={`theme-dark ${styles.goals}`}>
      <div className="wrap sec">
        <Label>{goals.label}</Label>
        <div className={styles.sectionHead}>
          <Heading parts={goals.heading} as="h2" className="t-h2" />
          <Reveal delay={80}>
            <p className="t-body text-pretty text-fg-2">{goals.intro}</p>
          </Reveal>
        </div>
        <ol className={styles.goalGrid}>
          {goals.list.map((goal, index) => (
            <Reveal key={goal.n} as="li" delay={index * 70} className={styles.goal}>
              <p className={`t-label ${styles.goalMeta}`}>
                <span
                  aria-hidden="true"
                  className="sq"
                  style={{ "--sq": markerHex[goal.color], width: 8, height: 8 } as CSSProperties}
                />
                {goal.n}
              </p>
              <h3 className="t-h3">{goal.title}</h3>
              <p className="t-body text-pretty text-fg-2">{goal.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function rolePattern(body: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="180" viewBox="0 0 160 180" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`,
  )}`;
}

const ROLE_PATTERNS: Record<TeamIcon, string> = {
  code: rolePattern(`
    <path d="M22 28 10 42l12 14M46 28l12 14-12 14M28 22l8 36"/>
    <path d="M108 24l-10 22M124 18h18M124 18v16"/>
    <path d="M112 78c10 0 10 8 0 12 10 4 10 12 0 12M138 78c-10 0-10 8 0 12-10 4-10 12 0 12"/>
    <path d="M18 138l14 10-14 10M40 158h18M108 132h28v28h-28zM114 142h16M114 150h10"/>
  `),
  design: rolePattern(`
    <path d="M28 18c10 2 14 14 8 24L22 62l-8-8 14-20c2-6 6-14 0-16zM18 58l8 8"/>
    <circle cx="118" cy="36" r="16"/>
    <path d="M96 22h18M96 22v18"/>
    <rect x="18" y="92" width="28" height="28" rx="3"/>
    <path d="M70 108c16-18 28-8 40 2"/>
    <path d="M108 128l22 8-8 6 10 4-16 10-4-12z"/>
    <circle cx="48" cy="152" r="10"/>
  `),
  office: rolePattern(`
    <path d="M28 16h16v10H28zM22 26h28v36H22zM30 40l5 5 10-12"/>
    <rect x="100" y="20" width="34" height="30" rx="3"/>
    <path d="M100 30h34M110 20v-6M124 20v-6"/>
    <circle cx="36" cy="112" r="16"/>
    <path d="M36 104v9l7 4"/>
    <path d="M96 100h40v36H96zM104 112h24M104 122h16"/>
    <path d="M22 150h28M22 158h18"/>
  `),
  illustration: rolePattern(`
    <path d="M22 58 48 16l8 8L30 66l-8-8zM22 58l-6 16 16-6"/>
    <path d="M96 28c18 4 28 20 18 34"/>
    <path d="M118 22c2 10-2 16-8 18"/>
    <circle cx="36" cy="112" r="8"/>
    <circle cx="58" cy="104" r="5"/>
    <circle cx="48" cy="128" r="4"/>
    <path d="M100 108l8 28 8-20 8 20 8-28"/>
    <path d="M24 156h20M112 156l6-10 6 10"/>
  `),
  marketing: rolePattern(`
    <path d="M18 36h16l22-12v40L34 52H18zM56 32v24M62 28c8 6 8 22 0 28"/>
    <path d="M104 48V22M104 48l-10-10M104 48l10-10"/>
    <path d="M92 58h8v16h-8zM104 50h8v24h-8zM116 40h8v34h-8z"/>
    <circle cx="36" cy="118" r="16"/>
    <circle cx="36" cy="118" r="8"/>
    <circle cx="36" cy="118" r="2" fill="#fff" stroke="none"/>
    <path d="M100 112l14 8-14 8v-6H86v-4h14z"/>
    <path d="M22 158h24M108 158h28"/>
  `),
  publish: rolePattern(`
    <path d="M24 16h22l12 12v36H24zM46 16v12h12"/>
    <path d="M32 40h16M32 48h12"/>
    <path d="M108 46V22M108 22l-8 8M108 22l8 8M92 46h32"/>
    <rect x="18" y="96" width="36" height="28" rx="4"/>
    <path d="M28 106h16M28 114h10"/>
    <path d="M96 96h40v40H96zM108 108v16M100 116h16"/>
    <path d="M30 150h18M108 154h24"/>
  `),
  video: rolePattern(`
    <rect x="14" y="22" width="40" height="28" rx="4"/>
    <path d="M30 30v12l12-6z" fill="#fff" stroke="none"/>
    <path d="M100 18h8v8h-8zM116 18h8v8h-8zM132 18h8v8h-8zM100 34h40v16H100zM100 58h8v8h-8zM116 58h8v8h-8zM132 58h8v8h-8z"/>
    <path d="M18 108h6l4-12 6 24 6-18 5 10h8"/>
    <path d="M96 104h44M96 104v8M118 96v16M140 104v8"/>
    <rect x="22" y="142" width="28" height="18" rx="3"/>
    <path d="M108 146h36M108 154h24"/>
  `),
};

function patternFor(icon: TeamIcon) {
  return ROLE_PATTERNS[icon];
}

function Team() {
  const { team } = aboutPage;
  return (
    <section id={team.id} className={`theme-light sheet relative z-10 ${styles.sheet} ${styles.teamSheet}`}>
      <div className="wrap sec">
        <Label>{team.label}</Label>
        <div className={styles.sectionHead}>
          <Heading parts={team.heading} as="h2" className="t-h2" />
          <Reveal delay={80}>
            <p className="t-body text-pretty text-fg-2">{team.intro}</p>
          </Reveal>
        </div>
        <ul className={styles.team}>
          {team.people.map((person) => (
            <li key={person.role} className={styles.member}>
              <ProfileCard
                name={person.role}
                title={person.job}
                socials={team.socials}
                contactText="Contact"
                avatarUrl={person.image.replace("/team/", "/team/cutouts/")}
                iconUrl={patternFor(person.icon)}
                backdropColor="#101145"
                radius={16}
                holo={0.35}
                glare={0.45}
                tiltStrength={6}
                parallax={4}
                enableTilt
                intro
                showUserInfo
                enableMobileTilt={false}
                theme="light"
                onContactClick={() => {
                  window.location.href = team.link.href;
                }}
              />
            </li>
          ))}
        </ul>
        <Reveal delay={80} className={styles.teamCta}>
          <Button href={team.link.href} variant="primary" size="md">
            {team.link.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
