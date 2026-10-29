import type { Metadata } from "next";
import { SpainWithEvaPage } from "../../spain-page";
import { localeMetadata } from "../../seo";

export const metadata: Metadata = localeMetadata("uk");

export default function UkrainianHome() {
  return <SpainWithEvaPage locale="uk" />;
}
