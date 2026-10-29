import type { Metadata } from "next";
import { SpainWithEvaPage } from "../../spain-page";
import { localeMetadata } from "../../seo";

export const metadata: Metadata = localeMetadata("en");

export default function EnglishHome() {
  return <SpainWithEvaPage locale="en" />;
}
