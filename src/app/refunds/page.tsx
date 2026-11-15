import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { refunds } from "@/content/legal";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.refunds.title,
  description: seo.refunds.description,
  alternates: { canonical: "/refunds" },
};

export default function Page() {
  return <LegalDocumentPage doc={refunds} />;
}
