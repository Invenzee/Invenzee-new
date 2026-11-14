"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { contact, headingText, services, site } from "@/content/site";
import styles from "./ContactForm.module.css";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={`t-label ${styles.label}`}>
        {label}
      </label>
      <div className={styles.box}>{children}</div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-3`}
    >
      <path
        d="M3.5 6.25 8 10.75 12.5 6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactForm() {
  const [opened, setOpened] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`New project enquiry from ${name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, `Service: ${service}`, "", message].join(
        "\n",
      ),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setOpened(true);
  }

  return (
    <form onSubmit={onSubmit} className={styles.panel}>
      <div className={styles.row}>
        <Field id="contact-name" label={contact.form.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={styles.control}
          />
        </Field>
        <Field id="contact-email" label={contact.form.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={styles.control}
          />
        </Field>
      </div>
      <Field id="contact-service" label={contact.form.service}>
        <select
          id="contact-service"
          name="service"
          defaultValue={contact.form.serviceFallback}
          className={`${styles.control} ${styles.select}`}
        >
          <option value={contact.form.serviceFallback}>
            {contact.form.serviceFallback}
          </option>
          {services.list.map((item) => (
            <option key={item.id} value={headingText(item.title)}>
              {headingText(item.title)}
            </option>
          ))}
        </select>
        <Chevron />
      </Field>
      <Field id="contact-message" label={contact.form.message}>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className={`${styles.control} ${styles.area}`}
        />
      </Field>
      <div className={styles.actions}>
        <button
          type="submit"
          className="group/btn mark inline-flex h-14 shrink-0 appearance-none items-center gap-3 border-0 bg-cyan pr-2 pl-7 font-display text-[1.0625rem] font-semibold tracking-[-0.01em] whitespace-nowrap text-navy transition-colors duration-300 hover:bg-cyan-bright [--chip:var(--color-navy)] [--chip-fg:#fff] [--chip-size:2.5rem]"
        >
          <span>{contact.form.submit}</span>
          <span className="relative grid size-(--chip-size) place-items-center overflow-hidden mark-tile bg-(--chip) text-(--chip-fg)">
            <ArrowIcon className="transition-transform duration-500 ease-expo group-hover/btn:translate-x-[180%]" />
            <ArrowIcon className="absolute -translate-x-[180%] transition-transform duration-500 ease-expo group-hover/btn:translate-x-0" />
          </span>
        </button>
        <p className="t-small min-w-0 max-w-full text-fg-3">{contact.form.note}</p>
      </div>
      {opened ? (
        <p role="status" aria-live="polite" className="t-small text-fg-2">
          Your email app should have opened. If it did not, email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-fg underline decoration-cyan underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
