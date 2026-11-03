import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { refunds } from "@/content/legal";

export const metadata: Metadata = {
  title: "Refunds & Cancellation",
  description: "How cancellation and refunds are handled for online coaching.",
  alternates: { canonical: "/refunds" },
};

export default function Page() {
  return <LegalDocumentPage doc={refunds} />;
}
