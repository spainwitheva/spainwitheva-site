import type { ReactNode } from "react";
import { SiteDocument } from "../site-document";

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
