import type { CSSProperties } from "react";
import Image from "next/image";
import { Artwork } from "@/components/ui/Artwork";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Label } from "@/components/ui/Label";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { headingText, markerHex, nav, services, type Service } from "@/content/site";
import { servicePages } from "@/content/service-pages";
import styles from "./ServicePage.module.css";

export function ServicePage({ service }: { service: Service }) {
  const content = servicePages[service.id];
  const accent = markerHex[service.color];
  const theme = { "--service-accent": accent } as CSSProperties;

  return (
    <div className={styles.page} data-service={service.id} style={theme}>
      <section className={`theme-dark ${styles.hero}`}>
        <div className={`wrap ${styles.stage}`}>
          <div className={styles.copy}>
            <Label className={styles.label}>
              <ServiceIcon id={service.id} color={accent} size={18} />
              {headingText(service.title)}
            </Label>
            <Heading as="h1" parts={content.headline} className={styles.title} dot={false} />
            <p className="t-lead text-fg-2">{service.summary}</p>
            <Button href={`${nav.cta.href}?service=${service.id}`} variant="primary" size="md">
              {service.cta}
            </Button>
          </div>
          <div className={styles.visual} aria-hidden="true">
            <div className={styles.picture}>
              {service.image ? (
                <Image
                  src={service.image}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(max-width: 760px) 100vw, 65vw"
                />
              ) : (
                <Artwork variant={service.art} tone={service.tone} animated={false} />
              )}
            </div>
            <div className={styles.sample}>
              <Artwork variant={service.art} tone={service.tone} animated={false} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${service.id === "software" || service.id === "video" ? "theme-dark" : "theme-light"} ${styles.scope}`} aria-labelledby="scope-title">
        <div className={`wrap sec ${styles.scopeInner}`}>
          <h2 id="scope-title" className="t-h2">{content.scope}</h2>
          <ul className={styles.deliverables}>
            {service.items.map((item, index) => (
              <li key={item}>
                <h3 className="t-h4">{item}</h3>
                <p className="t-body">{content.descriptions[index]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <nav className={`theme-dark ${styles.related}`} aria-label="Other services">
        <div className={`wrap ${styles.relatedInner}`}>
          <h2 className="t-h4">Explore our other services</h2>
          <ul>
            {services.list.filter(({ id }) => id !== service.id).map((item) => (
              <li key={item.id}>
                <a href={`/services/${item.id}`}>
                  <ServiceIcon id={item.id} color={markerHex[item.color]} size={15} />
                  {headingText(item.title)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
