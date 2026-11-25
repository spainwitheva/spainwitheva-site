import { catalogAnchor } from "./catalog-index";

export type UmamiPlace =
  | "hero"
  | "tour-card"
  | "tour-page"
  | "article"
  | "footer"
  | "sticky"
  | "poleznoe";

type UmamiEvent = "whatsapp" | "telegram" | "instagram" | "google-reviews" | "partner";

export type UmamiPartnerName = "holafly" | "genki";

export type UmamiPartnerPlace = "poleznoe" | "partners-page" | "article" | "footer";

export type UmamiAttrs = {
  "data-umami-event": UmamiEvent;
  "data-umami-event-place"?: UmamiPlace | UmamiPartnerPlace;
  "data-umami-event-tour"?: string;
  "data-umami-event-partner"?: UmamiPartnerName;
};

const tourSlugs: Record<string, string> = {
  "Душевный Мадрид": "madrid",
  "Изысканный Мадрид": "izyskannyj-madrid",
  "Вкусный Мадрид": "vkusnyj-madrid",
  "Мадрид в бокале": "madrid-v-bokale",
  "Аристократичный Мадрид": "aristokratichnyj-madrid",
  "Толедо": "toledo",
  "Толедо: первая столица Испании": "toledo",
  "Сеговия": "segovia",
  "Сеговия: акведук и королевский Алькасар": "segovia",
  "Аранхуэс": "aranjuez",
  "Эскориал и Долина Павших": "escorial",
  "музеи и стадион Мадрида": "museums",
  madrid: "madrid",
  salamanca: "izyskannyj-madrid",
  tasty: "vkusnyj-madrid",
  glass: "madrid-v-bokale",
  aristocratic: "aristokratichnyj-madrid",
  toledo: "toledo",
  segovia: "segovia",
  aranjuez: "aranjuez",
  escorial: "escorial",
};

export function tourEventSlug(name: string) {
  return tourSlugs[name] ?? catalogAnchor(name);
}

export function articleTourSlug(slug: string) {
  if (slug.includes("toledo")) return "toledo";
  if (slug.includes("madrid")) return "madrid";
  return undefined;
}

export function umamiWhatsapp(place: UmamiPlace, tour?: string): UmamiAttrs {
  return {
    "data-umami-event": "whatsapp",
    "data-umami-event-place": place,
    ...(tour ? { "data-umami-event-tour": tour } : {}),
  };
}

export function umamiOutbound(event: Exclude<UmamiEvent, "whatsapp" | "partner">): UmamiAttrs {
  return { "data-umami-event": event };
}

export function umamiPartner(partner: UmamiPartnerName, place: UmamiPartnerPlace): UmamiAttrs {
  return {
    "data-umami-event": "partner",
    "data-umami-event-partner": partner,
    "data-umami-event-place": place,
  };
}

export function umamiForHref(
  href: string,
  options?: { place?: UmamiPlace; tour?: string },
): UmamiAttrs | Record<string, never> {
  if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
    return umamiWhatsapp(options?.place ?? "article", options?.tour);
  }
  if (/instagram\.com/i.test(href)) return umamiOutbound("instagram");
  if (/(?:t\.me|telegram\.me|telegram\.org)\//i.test(href)) return umamiOutbound("telegram");
  return {};
}
