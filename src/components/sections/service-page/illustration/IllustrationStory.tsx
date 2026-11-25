import Image from "next/image";
import type { Service } from "@/content/site";
import { ServiceStory, type StoryChapter } from "../ServiceStory";
import styles from "./IllustrationStory.module.css";

function Print({ plate, priority = false }: { plate: string; priority?: boolean }) {
  return (
    <div className={styles.print} data-plate={plate}>
      <Image src={`/services/illustration-${plate}.webp`} alt="" fill preload={priority}
        sizes="(max-width: 760px) 90vw, 45vw" />
    </div>
  );
}

const chapters: StoryChapter[] = [
  { id: "custom-illustration", label: "Illustration", heading: ["Custom", "Illustration"],
    detail: "Give your next launch a world of its own. We develop the composition, palette, and drawing style around your brief, then deliver artwork sized for your campaign.",
    artLabel: "A giant whale glides over a harbor at night.", Art: () => <Print plate="whale" priority /> },
  { id: "character-design", heading: ["Character", "Design"],
    detail: "Put a face to your brand. We design your character’s silhouette, expressions, and poses, and deliver a model sheet your team can use across packaging, social posts, and animation.",
    artLabel: "A pink heron postal courier in a navy coat, with a walking pose and expression studies.", Art: () => <Print plate="courier" /> },
  { id: "icons-infographics", heading: ["Icons &", "Infographics"],
    detail: "Make the next step easy to see. We draw matching icons for products and signage, and turn complex information into diagrams your audience can follow.",
    artLabel: "A coordinated set of six illustrated maritime wayfinding symbols.", Art: () => <Print plate="signals" /> },
  { id: "storyboards", heading: ["Storyboard", "Illustration"],
    detail: "See how your film will cut together before the shoot. We draw the key frames, camera angles, and transitions so your team can agree on the story while changes are still easy.",
    artLabel: "Four sequential frames follow a paper boat from a pair of hands into the harbor.", Art: () => <Print plate="departure" /> },
  { id: "editorial-artwork", heading: ["Editorial", "Artwork"],
    detail: "Give your article a lead image that readers remember. We work from the manuscript to pitch visual concepts, refine the chosen sketch, and deliver the final art for print and digital editions.",
    artLabel: "A wave rises through an apartment building in a conceptual illustration about rising tides.", Art: () => <Print plate="tides" /> },
];

export function IllustrationStory({ service }: { service: Service }) {
  return <ServiceStory service={service} chapters={chapters} />;
}
