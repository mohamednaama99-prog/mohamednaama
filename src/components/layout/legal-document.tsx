import { PageShell } from "@/components/layout/page-shell";
import type { LegalDocument } from "@/content/legal";

export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return (
    <PageShell
      eyebrow="Legal"
      title={doc.title}
      lede={doc.intro}
      meta={`Last updated ${doc.lastUpdated}`}
    >
      <div className="flex max-w-[68ch] flex-col gap-10">
        {doc.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="t-h3">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-ink-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
