import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/layout/legal-document";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What this website collects, why, and what happens to it.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalDocumentPage doc={privacy} />;
}
