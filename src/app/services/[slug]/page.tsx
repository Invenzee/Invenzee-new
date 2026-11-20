import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageReady } from "@/components/sections/about-page/PageReady";
import { ServicePage } from "@/components/sections/service-page/ServicePage";
import { MarketingStory } from "@/components/sections/service-page/marketing/MarketingStory";
import { headingText, services } from "@/content/site";
import { servicePages } from "@/content/service-pages";

type Props = { params: Promise<{ slug: string }> };

async function getService(params: Props["params"]) {
  const { slug } = await params;
  const service = services.list.find((item) => item.id === slug);
  if (!service || !servicePages[service.id]) notFound();
  return service;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return services.list.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params);
  return {
    title: headingText(service.title),
    description: service.summary,
  };
}

export default async function ServiceRoute({ params }: Props) {
  const service = await getService(params);
  const isMarketing = service.id === "marketing";

  return (
    <>
      <PageReady />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-cyan focus:px-5 focus:py-3 focus:text-navy"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        {isMarketing ? <MarketingStory service={service} /> : <ServicePage service={service} />}
        <Process />
        {isMarketing && (
          <>
            <Testimonials />
            <Faq />
            <Contact defaultService={headingText(service.title)} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
