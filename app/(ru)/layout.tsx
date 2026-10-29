import type { ReactNode } from "react";
import { SiteDocument } from "../site-document";

export default function RussianLayout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="ru">{children}</SiteDocument>;
}
