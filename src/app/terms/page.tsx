import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { terms } from "@/content/legal";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.terms.title,
  description: seo.terms.description,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalDocumentPage doc={terms} />;
}
