"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/site";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.25v9.5M3.25 8h9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const last = faq.items.length - 1;

  return (
    <div>
      {faq.items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `faq-q-${index}`;
        const panelId = `faq-a-${index}`;
        return (
          <Reveal
            key={item.q}
            delay={index * 50}
            className={
              index === last
                ? "border-t border-b border-line"
                : "border-t border-line"
            }
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
                className="group flex w-full items-center justify-between gap-6 border-0 bg-transparent py-[clamp(18px,1.8vw,26px)] text-left"
              >
                <span className="t-h4 text-fg">{item.q}</span>
                <span
                  className={`grid size-9 shrink-0 place-items-center mark-tile border transition-all duration-500 ease-expo motion-reduce:transition-none ${
                    open
                      ? "rotate-45 border-navy bg-navy text-white"
                      : "border-line-2 text-fg group-hover:border-fg"
                  }`}
                >
                  <PlusIcon />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              className={`grid transition-[grid-template-rows] duration-[550ms] ease-expo motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className={`t-body max-w-[60ch] pr-14 pb-7 text-fg-2 transition-opacity duration-500 ease-expo motion-reduce:transition-none ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
