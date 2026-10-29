import type { ReactNode } from "react";
import { SiteDocument } from "../site-document";

export default function UkrainianLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="uk">{children}</SiteDocument>;
}
