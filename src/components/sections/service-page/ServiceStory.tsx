import type { ComponentType } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { contact, markerHex, type Service } from "@/content/site";
import styles from "./ServiceStory.module.css";

export type StoryChapter = {
  id: string;
  label?: string;
  heading: [string, string];
  detail: string;
  Art: ComponentType;
  interactive?: boolean;
  artLabel?: string;
};

function ChapterHeading({ lines, hero }: { lines: [string, string]; hero: boolean }) {
  const Tag = hero ? "h1" : "h2";
  return (
    <Tag className={hero ? styles.title : styles.heading} aria-label={lines.join(" ")}>
      {lines[0]}<br /><span>{lines[1]}</span>
    </Tag>
  );
}

export function ServiceStory({ service, chapters }: { service: Service; chapters: StoryChapter[] }) {
  return (
    <div className={`theme-dark ${styles.story}`}>
      {chapters.map(({ id, label, heading, detail, Art, interactive, artLabel }, index) => (
        <section key={id} id={id} className={styles.chapter} aria-label={heading.join(" ")}>
          <div className={`wrap ${styles.stage}`}>
            <div className={styles.copy}>
              {label && <Label color={markerHex[service.color]}>{label}</Label>}
              <ChapterHeading lines={heading} hero={index === 0} />
              <p className="t-lead text-fg-2">{detail}</p>
              {(index === 0 || index === chapters.length - 1) && <Button href={`#${contact.id}`}>{service.cta}</Button>}
            </div>
            <div className={styles.art} role={artLabel ? "img" : undefined} aria-label={artLabel} aria-hidden={interactive || artLabel ? undefined : true}>
              <Art />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}


