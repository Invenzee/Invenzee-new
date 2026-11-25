import Image from "next/image";
import type { Service } from "@/content/site";
import { ServiceStory, type StoryChapter } from "../ServiceStory";
import s from "./VideoStory.module.css";

function Still() {
  return <Image src="/services/first-light-espresso.webp" alt="" fill sizes="(max-width: 760px) 90vw, 45vw" className={s.still} />;
}

function EditTimeline() {
  return (
    <div className={s.edit}>
      <div className={s.monitor}><Still /><strong>First<br /><em>Light.</em></strong></div>
      <div className={s.timeline}>
        <div className={s.times}><span>00:00</span><span>00:03</span><span>00:06</span></div>
        <div className={s.clips}><span>Wide</span><span>Detail</span><span>End card</span></div>
        <div className={s.wave}>{Array.from({length: 48}, (_, i) => <i key={i} style={{ height: (20 + 78 * Math.abs(Math.sin(i * .91) * Math.cos(i * .29))) + "%" }} />)}</div>
        <i className={s.playhead} />
      </div>
    </div>
  );
}

function MotionTitles() {
  return (
    <div className={s.titleCard}>
      <div className={s.sun}><i /><i /><i /><i /></div>
      <div className={s.typeMask}><strong>First</strong></div>
      <div className={s.typeMask}><em>Light.</em></div>
      <span>ESPRESSO ROAST</span>
    </div>
  );
}

function VerticalCut() {
  return (
    <div className={s.reel}>
      <div className={s.source}><Still /><i /></div>
      <div className={s.vertical}><Still /><div className={s.reelProgress} />
        <strong>The first<br /><em>pour.</em></strong>
        <span>Fresh from the machine.</span>
      </div>
    </div>
  );
}

function Explainer() {
  return (
    <div className={s.explainer}>
      <header>Pulling an espresso</header>
      <div className={s.frames}>
        <div><div className={s.beans}><i /><i /><i /></div><b>Grind</b></div>
        <div><div className={s.tamper}><i /><b /></div><b>Tamp</b></div>
        <div><div className={s.cup}><i /><b /></div><b>Pour</b></div>
      </div>
      <div className={s.sequence}><i /><i /><i /></div>
    </div>
  );
}

function AdVariants() {
  return (
    <fieldset className={s.ads}>
      <legend>Compare campaign hooks</legend>
      <input id="video-hook-a" name="video-hook" type="radio" defaultChecked /><label htmlFor="video-hook-a">Product</label>
      <input id="video-hook-b" name="video-hook" type="radio" /><label htmlFor="video-hook-b">Morning ritual</label>
      <div className={s.ad}><Still /><div className={s.adCopy}>
        <small>FIRST LIGHT COFFEE</small>
        <strong className={s.product}>Espresso<br />roast.</strong>
        <strong className={s.ritual}>Morning,<br />made.</strong>
        <span>Shop the roast ↗</span>
      </div></div>
    </fieldset>
  );
}

const chapters: StoryChapter[] = [
  { id: "video-editing", label: "Video editing & motion", heading: ["Video", "Editing"], Art: EditTimeline,
    detail: "Send us your footage. We find the strongest takes, build the story, and finish the cut with color and sound for the screen where it will play." },
  { id: "motion-graphics", heading: ["Motion", "Graphics"], Art: MotionTitles,
    detail: "Give your brand a recognizable presence on screen. We animate your logo, titles, and transitions and deliver reusable graphics for your next release." },
  { id: "short-form", heading: ["Reels &", "Short-form"], Art: VerticalCut,
    detail: "Turn one shoot into a series of vertical cuts. We reframe the action, write on-screen captions, and give each reel its own opening hook." },
  { id: "explainer-videos", heading: ["Explainer", "Videos"], Art: Explainer,
    detail: "Show customers how your product works. We take your brief from script and storyboard to a finished sequence with clear visuals and a voiceover that sets the pace." },
  { id: "ad-creatives", heading: ["Ad", "Creatives"], Art: AdVariants, interactive: true,
    detail: "Test different reasons to buy using the same campaign footage. We cut variations of the hook, offer, and end card so your media team can compare results." },
];

export function VideoStory({ service }: { service: Service }) {
  return <ServiceStory service={service} chapters={chapters} />;
}
