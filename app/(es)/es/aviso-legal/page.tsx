import type { Metadata } from "next";
import { legalMetadata } from "../../../legal-copy";
import { LegalPage } from "../../../legal-page";

export const metadata: Metadata = legalMetadata("es");

export default function Page() {
  return <LegalPage locale="es" />;
}
