import type { ComponentType } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { contact, markerHex, type Service } from "@/content/site";
import { CampaignImage, IdentityProof, InkProof, Wordmark } from "./MotionPrint";
import styles from "./DesignStory.module.css";

function CampaignFormats() {
  return (
    <div className={styles.pressSheet}>
      <div className={styles.cover}>
        <Image src="/services/shift-track.webp" alt="" fill sizes="(max-width: 760px) 60vw, 30vw" />
        <Wordmark /><em>Night Run.</em>
      </div>
      <div className={styles.bib}>
        <div>SHIFT NIGHT RUN</div><strong>026</strong><i />
      </div>
      <div className={styles.pass}>
        <Wordmark /><span>Race pass</span><b>START / A</b>
      </div>
      <div className={styles.ticket}>
        <span>Night Run.</span><b>↗</b>
      </div>
    </div>
  );
}
const chapters: { id: string; label: string; heading: [string, string]; detail: string; Art: ComponentType }[] = [
  {
    id: "typography", label: "Graphic design · Typography",
    Art: IdentityProof,
    heading: ["Make a name", "for yourself."],
    detail: "Launching a brand or ready for a new look? We design your wordmark and build a type system around it, from the sign over your door to the name on your packaging.",
  },
  {
    id: "color", label: "Brand color",
    Art: InkProof,
    heading: ["Own your", "colors."],
    detail: "Give customers a way to spot you on a crowded shelf. We develop your signature palette and deliver print and digital color specs to your printer, web team, and partners.",
  },
  {
    id: "imagery", label: "Campaign imagery",
    Art: CampaignImage,
    heading: ["Give your launch", "a look."],
    detail: "We art-direct the imagery for your next release and deliver a set of campaign visuals sized for your store, paid ads, and social feed.",
  },
  {
    id: "layout", label: "Layout & rollout",
    Art: CampaignFormats,
    heading: ["One campaign.", "Every format."],
    detail: "Send us the brief and your launch date. We turn the approved design into print-ready posters, web banners, and editable social templates your team can publish straight away.",
  },
];

function ChapterHeading({ lines, hero }: { lines: [string, string]; hero: boolean }) {
  const Tag = hero ? "h1" : "h2";
  return (
    <Tag className={hero ? styles.title : styles.heading}>
      {lines[0]}<br /><span>{lines[1]}</span>
    </Tag>
  );
}

export function DesignStory({ service }: { service: Service }) {
  return (
    <div className={`theme-dark ${styles.story}`}>
      {chapters.map(({ id, label, heading, detail, Art }, index) => (
        <section key={id} id={id} className={styles.chapter} aria-label={label}>
          <div className={`wrap ${styles.stage}`}>
            <div className={styles.copy}>
              <Label color={markerHex[service.color]}>{label}</Label>
              <ChapterHeading lines={heading} hero={index === 0} />
              <p className="t-lead text-fg-2">{detail}</p>
              {(index === 0 || index === chapters.length - 1) && <Button href={`#${contact.id}`}>{service.cta}</Button>}
            </div>
            <div className={styles.art} aria-hidden="true">
              <Art />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

