import { ServiceStory, type StoryChapter } from "../ServiceStory";
import Image from "next/image";


import type { Service } from "@/content/site";
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
const chapters: StoryChapter[] = [
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

export function DesignStory({ service }: { service: Service }) {
  return <ServiceStory service={service} chapters={chapters} />;
}
