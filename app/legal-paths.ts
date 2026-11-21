import type { Locale } from "./translations";

export const legalPaths = {
  ru: "/pravovaya-informaciya/",
  uk: "/uk/pravova-informatsiia/",
  en: "/en/legal/",
  es: "/es/aviso-legal/",
} as const satisfies Record<Locale, string>;

export const legalLabel: Record<Locale, string> = {
  ru: "Правовая информация",
  uk: "Правова інформація",
  en: "Legal notice",
  es: "Aviso legal",
};
