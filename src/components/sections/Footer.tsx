import type { CSSProperties, ReactNode } from "react";
import { CurrentYear, LiveClock } from "@/components/ui/LiveClock";
import { Logo } from "@/components/ui/Logo";
import { contact, footer, markerHex, nav, services, site } from "@/content/site";
import { BackToTop } from "./footer/BackToTop";
import { Wordmark } from "./footer/Wordmark";

const linkText =
  "relative font-display text-[15px] leading-[1.35] font-medium break-words text-fg-2 transition-colors duration-300 hover:text-fg focus-visible:text-fg group-hover:text-fg group-focus-visible:text-fg";

function ColumnTitle({ children }: { children: ReactNode }) {
  return <p className="t-label text-fg-3">{children}</p>;
}

function Underline() {
  return (
    <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100" />
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={`group inline-block max-w-full ${linkText}`}>
      {children}
      <Underline />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="theme-dark border-t border-line">
      <div className="wrap pt-[clamp(56px,6vw,96px)] pb-7">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 min-w-0 lg:col-span-4">
            <Logo variant="full" height={36} />
            <p className="t-small mt-5 max-w-[30ch] text-fg-2">{footer.blurb}</p>
          </div>

          <div className="col-span-6 min-w-0 lg:col-span-2">
            <ColumnTitle>{footer.columns.services}</ColumnTitle>
            <ul className="mt-5 flex flex-col gap-3">
              {services.list.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${services.id}`}
                    className="group inline-flex max-w-full items-start gap-2.5"
                  >
                    <span
                      className="sq mt-1.5"
                      style={
                        {
                          "--sq": markerHex[item.color],
                          width: 8,
                          height: 8,
                        } as CSSProperties
                      }
                    />
                    <span className={linkText}>
                      {item.title}
                      <Underline />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 min-w-0 lg:col-span-2">
            <ColumnTitle>{footer.columns.company}</ColumnTitle>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
              <li>
                <TextLink href={`#${contact.id}`}>Contact</TextLink>
              </li>
            </ul>
          </div>

          <div className="col-span-6 min-w-0 lg:col-span-2">
            <ColumnTitle>{footer.columns.contact}</ColumnTitle>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
              </li>
              {site.phones.map((phone) => (
                <li
                  key={phone.href}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
                >
                  <TextLink href={phone.href}>{phone.display}</TextLink>
                  <span className="t-label text-fg-3">{phone.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 min-w-0 lg:col-span-2">
            <ColumnTitle>{footer.columns.office}</ColumnTitle>
            <address className="mt-5 not-italic">
              <p className="font-display text-[15px] leading-[1.35] font-medium text-fg-2">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {site.clocks.map((clock) => (
                  <li
                    key={clock.timeZone}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <span className="t-label text-fg-3">{clock.city}</span>
                    <LiveClock
                      timeZone={clock.timeZone}
                      className="t-label text-cyan"
                    />
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>

        <Wordmark />

        <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-5">
          <p className="t-label text-fg-3">
            © <CurrentYear /> {footer.legal}
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
