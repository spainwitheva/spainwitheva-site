import type { Metadata } from "next";
import { SpainWithEvaPage } from "../../spain-page";
import { localeMetadata } from "../../seo";

export const metadata: Metadata = localeMetadata("es");

export default function SpanishHome() {
  return <SpainWithEvaPage locale="es" />;
}
