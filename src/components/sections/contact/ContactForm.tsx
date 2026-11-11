"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { contact, services, site } from "@/content/site";
import styles from "./ContactForm.module.css";

const controlClass = `${styles.control} w-full min-w-0 appearance-none bg-transparent py-[14px] font-display text-[1.25rem] leading-[1.15] font-medium tracking-[-0.02em] text-fg placeholder:text-fg-3`;

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
    <div className="group/field min-w-0">
      <label
        htmlFor={id}
        className="t-label text-fg-3 transition-colors duration-500 ease-expo group-focus-within/field:text-fg"
      >
        {label}
      </label>
      <div className="relative mt-2">
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-500 ease-expo group-focus-within/field:scale-x-100"
        />
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-fg-3"
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
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-(--g) md:grid-cols-2">
        <Field id="contact-name" label={contact.form.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={controlClass}
          />
        </Field>
        <Field id="contact-email" label={contact.form.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={controlClass}
          />
        </Field>
      </div>
      <Field id="contact-service" label={contact.form.service}>
        <select
          id="contact-service"
          name="service"
          defaultValue={contact.form.serviceFallback}
          className={`${controlClass} cursor-pointer pr-8`}
        >
          <option value={contact.form.serviceFallback}>
            {contact.form.serviceFallback}
          </option>
          {services.list.map((item) => (
            <option key={item.id} value={item.title}>
              {item.title}
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
          className={`${controlClass} resize-y`}
        />
      </Field>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
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
