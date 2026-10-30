import type { Metadata } from "next";
import { SITE_ORIGIN } from "./seo";
import type { TourPageData } from "./tours-data";

const ICONS = {
  icon: "/favicon.png",
  shortcut: "/favicon.png",
} as const;

export function tourMetadata(tour: TourPageData): Metadata {
  const url = `${SITE_ORIGIN}${tour.path}`;

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: tour.metaTitle,
    description: tour.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title: tour.metaTitle,
      description: tour.metaDescription,
      url,
      locale: "ru_RU",
      images: [{ url: tour.ogImage, alt: tour.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: tour.metaTitle,
      description: tour.metaDescription,
      images: [tour.ogImage],
    },
    other: {
      "twitter:url": url,
    },
    icons: ICONS,
  };
}

export function indexMetadata(): Metadata {
  const title = "Экскурсии по Мадриду и поездки из Мадрида с русскоязычным гидом | SpainWithEva";
  const description =
    "Индивидуальные экскурсии с гидом SpainWithEva: Душевный Мадрид от 200 €, Толедо от 450 € плюс билеты на поезд. Лично с Евой +50 €.";
  const url = `${SITE_ORIGIN}/ekskursii/`;
  const image = "https://spainwitheva.com/images/hero-eva-madrid.webp";

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title,
      description,
      url,
      locale: "ru_RU",
      images: [{ url: image, alt: "Ева на исторической улице Мадрида" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: { "twitter:url": url },
    icons: ICONS,
  };
}

export function tourJsonLd(tour: TourPageData) {
  const url = `${SITE_ORIGIN}${tour.path}`;
  const product: Record<string, unknown> = {
    "@type": "Product",
    name: tour.h1,
    alternateName: tour.cardTitle,
    description: tour.metaDescription,
    url,
    inLanguage: "ru",
    brand: { "@type": "Brand", name: "SpainWithEva" },
    offers: {
      "@type": "Offer",
      price: tour.priceAmount,
      priceCurrency: "EUR",
      url,
      description: tour.offerDescription,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: tour.priceAmount,
        priceCurrency: "EUR",
      },
    },
  };
  if (tour.schemaImage) product.image = tour.schemaImage;

  return {
    "@context": "https://schema.org",
    "@graph": [
      product,
      {
        "@type": "TouristTrip",
        name: tour.h1,
        description: tour.metaDescription,
        url,
        touristType: "Индивидуальная экскурсия",
        provider: {
          "@type": "TravelAgency",
          name: "SpainWithEva",
          url: `${SITE_ORIGIN}/`,
          telephone: "+34 684 76 20 85",
        },
        itinerary: {
          "@type": "ItemList",
          itemListElement: tour.sees.map((name, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Экскурсии", item: `${SITE_ORIGIN}/ekskursii/` },
          { "@type": "ListItem", position: 3, name: tour.crumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tour.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function indexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Экскурсии SpainWithEva",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Душевный Мадрид",
            url: `${SITE_ORIGIN}/ekskursii/madrid/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Толедо",
            url: `${SITE_ORIGIN}/ekskursii/toledo/`,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Экскурсии", item: `${SITE_ORIGIN}/ekskursii/` },
        ],
      },
    ],
  };
}
