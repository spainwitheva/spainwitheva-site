import type { Metadata } from "next";
import { sitePrices } from "./site-content";
import { translate, type Locale } from "./translations";

export const SITE_ORIGIN = "https://spainwitheva.com";

const HERO_IMAGE = `${SITE_ORIGIN}/images/hero-eva-madrid.webp`;
const HERO_ALT = "Ева с чемоданом на одной из исторических улиц Мадрида";

export const localePaths = {
  ru: "/",
  uk: "/uk/",
  en: "/en/",
  es: "/es/",
} as const satisfies Record<Locale, string>;

const pageCopy: Record<
  Locale,
  { title: string; description: string; ogLocale: string }
> = {
  ru: {
    title: "SpainWithEva — экскурсии и авторские туры по Испании",
    description:
      "Нескучные экскурсии в Мадриде и по всей Испании, авторские туры, Путь Сантьяго и организация отдыха под ключ.",
    ogLocale: "ru_RU",
  },
  uk: {
    title: "SpainWithEva | Екскурсії та подорожі Іспанією",
    description:
      "Ненудні приватні екскурсії, авторські тури, Шлях Сантьяго та організація подорожей усією Іспанією.",
    ogLocale: "uk_UA",
  },
  en: {
    title: "SpainWithEva | Private Tours and Travel in Spain",
    description:
      "Private tours, bespoke journeys, the Camino de Santiago and tailor-made travel throughout Spain.",
    ogLocale: "en_US",
  },
  es: {
    title: "SpainWithEva | Visitas privadas y viajes por España",
    description:
      "Visitas privadas, viajes a medida, Camino de Santiago y organización de vacaciones por toda España.",
    ogLocale: "es_ES",
  },
};

export function pageUrl(locale: Locale): string {
  return `${SITE_ORIGIN}${localePaths[locale]}`;
}

export function hreflangLanguages(): Record<string, string> {
  return {
    ru: pageUrl("ru"),
    uk: pageUrl("uk"),
    en: pageUrl("en"),
    es: pageUrl("es"),
    "x-default": pageUrl("ru"),
  };
}

export function localeMetadata(locale: Locale): Metadata {
  const copy = pageCopy[locale];
  const url = pageUrl(locale);

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: hreflangLanguages(),
    },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title: copy.title,
      description: copy.description,
      url,
      locale: copy.ogLocale,
      images: [
        {
          url: HERO_IMAGE,
          alt: translate(locale, HERO_ALT),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [HERO_IMAGE],
    },
    other: {
      "twitter:url": url,
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
  };
}

/**
 * priceRange is the lowest and highest number already published in sitePrices.
 * It is not a new price.
 */
export function businessJsonLd() {
  const amounts = Object.values(sitePrices);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    name: "SpainWithEva",
    url: pageUrl("ru"),
    telephone: "+34 684 76 20 85",
    image: HERO_IMAGE,
    priceRange: `€${min}–€${max}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    sameAs: [
      "https://instagram.com/spainwitheva",
      "https://www.youtube.com/@spainwitheva",
      "https://www.facebook.com/spainwithevaa",
      "https://tiktok.com/@spain.with.eva",
      "https://t.me/spainwitheva",
    ],
  };
}
