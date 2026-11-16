"use client";

import { Fragment } from "react";
import { nav, testimonials } from "@/content/site";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Flag } from "@/components/ui/Flag";
import styles from "./Testimonials.module.css";

const people = testimonials.people;

type Person = (typeof people)[number];

function Stars() {
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 16 16" width="14" height="14">
          <path
            fill="currentColor"
            d="M8 1.4 9.9 5.8l4.7.5-3.5 3.2.9 4.6L8 11.8 4 14.1l.9-4.6L1.4 6.3l4.7-.5L8 1.4Z"
          />
        </svg>
      ))}
    </span>
  );
}

function Place({ person }: { person: Person }) {
  return (
    <span className={styles.place}>
      <Flag code={person.flag} />
      <span>{person.place}</span>
    </span>
  );
}

function QuoteCard({ person }: { person: Person }) {
  return (
    <article className={styles.quoteCard}>
      <span className={styles.who}>
        <img src={person.image} alt="" className={styles.avatar} />
        <span>
          <span className={styles.name}>{person.name}</span>
          <span className={styles.role}>{person.role}</span>
        </span>
      </span>
      <span className={styles.quote}>“{person.quote}”</span>
      <span className={styles.foot}>
        <Stars />
        <Place person={person} />
      </span>
    </article>
  );
}

function PhotoCard({ person }: { person: Person }) {
  return (
    <article className={styles.photoCard}>
      <img src={person.image} alt="" />
      <span className={styles.photoMeta}>
        <span className={styles.photoName}>{person.name}</span>
        <span className={styles.photoRole}>{person.role}</span>
      </span>
      <span className={styles.photoFoot}>
        <Stars />
        <Place person={person} />
      </span>
    </article>
  );
}

function Strip({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {people.map((person) => (
        <Fragment key={person.name}>
          <QuoteCard person={person} />
          <PhotoCard person={person} />
        </Fragment>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id={testimonials.id} className={`theme-dark ${styles.section}`}>
      <div className={`wrap ${styles.head}`}>
        <div className={styles.copy}>
          <Label>{testimonials.label}</Label>
          <Heading parts={testimonials.heading} as="h2" className={`t-h2 mt-6 ${styles.title}`} />
        </div>
        <Button href={nav.cta.href} variant="primary" size="md">
          {nav.cta.label}
        </Button>
      </div>

      <div className={styles.stage}>
        <div className={styles.track}>
          <Strip />
          <Strip hidden />
        </div>
      </div>
    </section>
  );
}
