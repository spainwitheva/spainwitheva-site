import type { Metadata } from "next";
import { SITE_ORIGIN } from "./seo";

/**
 * Russian travel-essentials page. Not an article: it stays out of content/stati.
 * Partner URLs and the promo code live here so the page component stays layout.
 */

export const PARTNERS_PATH = "/poleznoe-dlya-poezdki/";
export const PARTNERS_URL = `${SITE_ORIGIN}${PARTNERS_PATH}`;

export const HOLAFLY_URL =
  "https://holafly.sjv.io/c/8159179/3856277/24764?subId1=site";
export const GENKI_URL = "https://genki.world/with/spainwitheva";
export const PARTNERS_H1 = "Полезное для поездки в Испанию";
export const PARTNERS_TITLE =
  "Полезное для поездки в Испанию: связь и страховка | SpainWithEva";
export const PARTNERS_DESCRIPTION =
  "Как в поездке в Испанию решить интернет и медицинскую страховку. Честно и коротко, от Евы.";

export const partnersUi = {
  crumbs: "Хлебные крошки",
  home: "Главная",
  holaflyCta: "Купить eSIM Holafly по партнёрской ссылке",
  genkiCta: "Оформить Genki Traveler по партнёрской ссылке",
  whatsappCta: "Написать в WhatsApp",
  legalBefore:
    "Подробнее о том, как устроены партнёрские ссылки на сайте, можно прочитать в ",
  legalLink: "правовой информации",
  legalAfter: ".",
};

export type PartnerBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "holafly" }
  | { type: "genki" }
  | { type: "whatsapp" }
  | { type: "legal" };

export const partnerBlocks: PartnerBlock[] = [
  {
    type: "p",
    text: "Я Ева, живу в Мадриде и вожу гостей. Перед вылетом меня то и дело спрашивают про интернет и страховку, поэтому собрала самое нужное.",
  },
  { type: "h2", text: "Интернет в поездке" },
  {
    type: "p",
    text: "Для короткой поездки проще всего eSIM: ставишь её в телефон ещё дома и включаешь уже по прилёте.",
  },
  {
    type: "p",
    text: "Промокод SPAINWITHEVA: скидка 5% на eSIM для путешествий.",
  },
  { type: "holafly" },
  { type: "h2", text: "Страховка для поездки" },
  {
    type: "p",
    text: "Genki Traveler, это медицинская страховка для путешествий: подписка на месяц и покрытие неожиданной болезни и травмы до 1 000 000 €. На сайте цена «от 52,50 € в месяц».",
  },
  {
    type: "p",
    text: "Карты России и Беларуси Genki не принимает.",
  },
  { type: "genki" },
  { type: "h2", text: "Если хочешь, я покажу Испанию сама" },
  {
    type: "p",
    text: "Если собираешься в Мадрид, Толедо или в поездку по Испании, напиши в WhatsApp: пойдём со мной или с моими коллегами. Гиды говорят на русском, украинском и английском, дату и формат подберём.",
  },
  { type: "whatsapp" },
  { type: "legal" },
];

export function partnersMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: PARTNERS_TITLE,
    description: PARTNERS_DESCRIPTION,
    alternates: { canonical: PARTNERS_URL },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title: PARTNERS_TITLE,
      description: PARTNERS_DESCRIPTION,
      url: PARTNERS_URL,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary",
      title: PARTNERS_TITLE,
      description: PARTNERS_DESCRIPTION,
    },
    other: { "twitter:url": PARTNERS_URL },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
  };
}

export function partnersJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PARTNERS_TITLE,
    description: PARTNERS_DESCRIPTION,
    url: PARTNERS_URL,
  };
}
