import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms covering this website and the online coaching offered through it.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalDocumentPage doc={terms} />;
}
