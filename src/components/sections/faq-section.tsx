"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content/faq";

/**
 * Client component only because the accordion is interactive. The questions
 * and answers are still plain content from `src/content/faq.ts`, and they are
 * rendered into the HTML so search engines and the FAQPage JSON-LD agree.
 */
export function FaqList() {
  return (
    <Accordion
      type="single"
      collapsible
      className="overflow-hidden rounded-xl border border-line bg-surface-raised"
    >
      {faq.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-line px-5 sm:px-7"
        >
          <AccordionTrigger className="py-6 text-left font-display text-base text-ink hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-sm leading-relaxed text-ink-muted">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
