import { ArrowLink } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { faq } from "@/content/site";
import { FaqList } from "./faq/FaqList";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export function Faq() {
  return (
    <section id={faq.id} className="theme-light sheet relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="wrap sec">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:col-span-4 lg:self-start">
            <Label>{faq.label}</Label>
            <Heading
              parts={faq.heading}
              as="h2"
              className="t-h2 mt-6"
              dot={false}
            />
            <p className="t-body mt-5 text-fg-2">{faq.intro}</p>
            <ArrowLink href={faq.link.href} className="mt-7">
              {faq.link.label}
            </ArrowLink>
          </div>
          <div className="col-span-12 min-w-0 lg:col-span-7 lg:col-start-6">
            <FaqList />
          </div>
        </div>
      </div>
    </section>
  );
}
