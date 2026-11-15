import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { privacy } from "@/content/legal";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.privacy.title,
  description: seo.privacy.description,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalDocumentPage doc={privacy} />;
}
