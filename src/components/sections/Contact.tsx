import { ArrowIcon } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { contact, site } from "@/content/site";
import { ContactForm } from "./contact/ContactForm";
import styles from "./contact/Contact.module.css";

export function Contact() {
  return (
    <section id={contact.id} className="theme-dark">
      <div className="wrap sec">
        <Label>{contact.label}</Label>
        <Heading
          parts={contact.heading}
          as="h2"
          className={`t-h2 mt-6 ${styles.display}`}
        />
        <p className="t-lead mt-7 max-w-[min(36ch,100%)] text-fg-2">
          {contact.intro}
        </p>
        <div className="mt-[clamp(56px,7vw,112px)] grid-12 gap-y-16 lg:items-start">
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <ContactForm />
          </div>
          <address className="col-span-12 min-w-0 not-italic lg:col-span-5 lg:col-start-8">
            <Reveal className="border-t border-line py-7">
              <Label>{contact.details.address}</Label>
              <a
                href={site.address.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-4 flex w-full items-center gap-4 t-h4 text-fg"
              >
                <span className="min-w-0">
                  {site.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <ArrowIcon className="-rotate-45 shrink-0 text-[0.75em] transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
            <Reveal delay={80} className="border-t border-line py-7">
              <Label>{contact.details.mailbox}</Label>
              <a
                href={`mailto:${site.email}`}
                className="group relative mt-4 inline-block max-w-full t-h3 break-words text-fg"
              >
                {site.email}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </a>
            </Reveal>
            <Reveal delay={160} className="border-t border-b border-line py-7">
              <Label>{contact.details.phone}</Label>
              <ul className="mt-4 flex flex-col gap-3">
                {site.phones.map((phone) => (
                  <li
                    key={phone.href}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <a
                      href={phone.href}
                      className="group relative inline-block t-h4 text-fg"
                    >
                      {phone.display}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    </a>
                    <span className="t-label text-fg-3">({phone.label})</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </address>
        </div>
      </div>
    </section>
  );
}
