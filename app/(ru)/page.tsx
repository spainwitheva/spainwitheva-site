import type { Metadata } from "next";
import { SpainWithEvaPage } from "../spain-page";
import { localeMetadata } from "../seo";

export const metadata: Metadata = localeMetadata("ru");

export default function Home() {
  return <SpainWithEvaPage locale="ru" />;
}
