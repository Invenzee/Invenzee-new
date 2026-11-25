import type { Service } from "@/content/site";
import { ServiceStory, type StoryChapter } from "../ServiceStory";
import { CmsBoard, Hosting, Maintenance } from "./WorkflowDemos";
import { DesignReveal, ClientDesk } from "./InteractiveScenes";

const chapters: StoryChapter[] = [
  { id: "custom-websites", label: "Website development", heading: ["Custom", "Websites"],
    detail: "We design and build your site around the work you want to show and the action you want customers to take, from a first impression on mobile to a project enquiry.", Art: DesignReveal, interactive: true },
  { id: "cms-websites", heading: ["CMS", "Websites"],
    detail: "Run your store on Shopify, publish with WordPress, or manage your site in Wix or Webflow. We set up the platform around your content and show your team how to keep it current.", Art: CmsBoard, artLabel: "Shopify, WordPress, Wix and Webflow connected to Invenzee." },
  { id: "domain-hosting", heading: ["Domains &", "Hostinger Hosting"],
    detail: "We connect your domain, configure your Hostinger hosting and HTTPS certificate, and handle the switch when your site is ready to launch.", Art: Hosting, artLabel: "A Hostinger origin server answering a secure request." },
  { id: "website-maintenance", heading: ["Website", "Maintenance"],
    detail: "Keep your site healthy after launch. We back it up, test updates on staging, and check performance and customer journeys after each release.", Art: Maintenance, artLabel: "Sample release log showing a backup, update and successful health check." },
  { id: "web-applications", heading: ["Web", "Applications"],
    detail: "Give clients and staff a shared place to manage requests, approvals, and handovers. We build the portal around your workflow and give each person access to the files and decisions they need.", Art: ClientDesk, interactive: true },
];

export function WebsiteStory({ service }: { service: Service }) {
  return <ServiceStory chapters={chapters} service={service} />;
}
