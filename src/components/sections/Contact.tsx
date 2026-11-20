import { Suspense } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { Flag } from "@/components/ui/Flag";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { contact, site } from "@/content/site";
import { ContactForm, ContactPageForm } from "./contact/ContactForm";
import styles from "./contact/Contact.module.css";

export function Contact({
  standalone = false,
  defaultService,
}: {
  standalone?: boolean;
  defaultService?: string;
}) {
  const hasPageHeading = standalone || Boolean(defaultService);

  return (
    <section id={contact.id} className={standalone ? `theme-dark ${styles.standalone}` : "theme-dark"} aria-labelledby="contact-heading">
      <div className="wrap sec">
        {!hasPageHeading && <Label>{contact.label}</Label>}
        <div className={styles.columns}>
          <div className={styles.copy}>
            <div id="contact-heading">
              <Heading
                parts={hasPageHeading ? contact.pageHeading : contact.heading}
                as={standalone ? "h1" : "h2"}
                className={`t-h2 ${styles.display}`}
                dot={!standalone}
              />
            </div>
            <p className={`${styles.intro} mt-7 text-fg-2`}>
              {hasPageHeading ? contact.pageIntro : contact.intro}
            </p>
            <address className={`${styles.details} not-italic`}>
            <Reveal className={`${styles.detail} border-t border-line py-4`}>
              <Label>{contact.details.address}</Label>
              <a
                href={site.address.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center gap-4 t-h4 text-fg"
              >
                <span className={styles.addressLine}>
                  {site.address.lines.join(" ")}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <ArrowIcon className="-rotate-45 shrink-0 text-[0.75em] transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
            <Reveal delay={80} className={`${styles.detail} border-t border-line py-4`}>
              <Label>{contact.details.mailbox}</Label>
              <a
                href={`mailto:${site.email}`}
                className={`group relative ${styles.mail}`}
              >
                {site.email}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </a>
            </Reveal>
            <Reveal delay={160} className={`${styles.detail} border-t border-b border-line py-4`}>
              <Label>{contact.details.phone}</Label>
              <ul className="flex flex-col gap-1">
                {site.phones.map((phone) => (
                  <li
                    key={phone.href}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1"
                  >
                    <a
                      href={phone.href}
                      className="group relative inline-block t-h4 text-fg"
                    >
                      {phone.display}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    </a>
                    <Flag code={phone.flag} />
                  </li>
                ))}
              </ul>
            </Reveal>
            </address>
          </div>
          <div className={styles.formCol}>
            {standalone ? (
              <Suspense fallback={<ContactForm />}>
                <ContactPageForm />
              </Suspense>
            ) : (
              <ContactForm defaultService={defaultService} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
