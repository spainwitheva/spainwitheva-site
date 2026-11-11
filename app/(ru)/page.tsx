import type { Metadata } from "next";
import { SpainWithEvaPage } from "../spain-page";
import { localeMetadata } from "../seo";
import { HomeTourStrip } from "../tour-cards";

export const metadata: Metadata = localeMetadata("ru");

export default function Home() {
  return <SpainWithEvaPage locale="ru" afterHero={<HomeTourStrip />} />;
}
