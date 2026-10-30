import { siteContacts } from "./site-content";
import type { GoogleReview } from "./reviews";
import { madridPageReviews, toledoReviews } from "./reviews";

/**
 * Факты каталога владельца, октябрь 2026.
 * Цены ниже за гида команды. Лично с Евой +50 €.
 * Плейсхолдеры [УТОЧНИТЬ: ...] остаются только там, где факта нет:
 * место встречи и свои фото. Отзывы берутся из reviews.ts.
 */

export const evaSurcharge = "лично с Евой +50 €";
export const otherCitiesNote = "Работаем и в других городах Испании.";
export const privateGroup = "Только ваша компания, без чужих людей.";
export const cultureNote = "Формат культурный и исторический, без современных политических тем.";
export const priceIncludes = "Работа гида и подготовленный маршрут.";
export const paidByGuests =
  "Еда, напитки, входные билеты и транспорт. Гости оплачивают это отдельно, за себя и за гида.";

export const meetingGap = "[УТОЧНИТЬ: место встречи]";
export const meetingAnswer = `Место встречи обсудим в WhatsApp, когда выберем дату. ${meetingGap}`;

export const bookingTerms = {
  title: "Условия бронирования",
  lead: "Предоплата (сумма по договорённости) входит в стоимость экскурсии и закрепляет за вами выбранные дату и время.",
  cancelTitle: "При отмене:",
  points: [
    "за 14 дней и ранее: полный возврат;",
    "за 7–13 дней: возврат 50% предоплаты;",
    "менее чем за 7 дней: предоплата не возвращается.",
  ],
  reschedule: "Если планы изменятся, постараемся перенести экскурсию на другую удобную дату.",
  ourCancel: "При отмене с нашей стороны вернём всю оплату.",
  faqQuestion: "Можно ли отменить или перенести?",
  faqAnswer:
    "Да. Предоплата (сумма по договорённости) входит в стоимость и закрепляет дату. За 14 дней и ранее вернём её полностью, за 7–13 дней вернём 50% предоплаты, менее чем за 7 дней предоплата не возвращается. Дату постараемся перенести. Если отменим мы, вернём всю оплату.",
};

export function waLink(text: string) {
  return `https://wa.me/${siteContacts.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export type TourPhoto = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  /** CSS object-position, used when a frame crops the photo. */
  position?: string;
  gap?: string;
};

export const evaPortrait: TourPhoto = {
  src: "/images/eva/portrait.webp",
  alt: "Ева",
  width: 800,
  height: 1067,
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FormatLine = {
  title: string;
  text: string;
  waText: string;
};

export type TourCardData = {
  id: string;
  title: string;
  why: string;
  meta: string;
  photo: TourPhoto;
  href?: string;
  waText: string;
};

export type TourPageData = {
  slug: string;
  path: string;
  crumb: string;
  h1: string;
  evaLine: string;
  cardTitle: string;
  duration: string;
  group: string;
  priceLabel: string;
  priceAmount: string;
  offerDescription: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  ogImageAlt: string;
  schemaImage?: string;
  waText: string;
  hero: TourPhoto;
  photos: TourPhoto[];
  photoNote?: string;
  sees: string[];
  how: string[];
  separateNote?: string;
  faqs: FaqItem[];
  formats?: FormatLine[];
  extras?: string;
  evaLines: string[];
  reviews: GoogleReview[];
  related: Array<{ href: string; title: string; meta: string }>;
};

const madridWa = "Привет! Хочу индивидуальную экскурсию «Душевный Мадрид». Дата: , нас будет: ";
const toledoWa = "Привет! Хочу индивидуальную экскурсию в Толедо из Мадрида. Дата: , нас будет: ";

function formatWa(title: string) {
  return `Привет! Хочу экскурсию «${title}». Дата: , нас будет: `;
}

const photoGap = (label: string): TourPhoto => ({
  alt: "",
  gap: `[УТОЧНИТЬ: фото, ${label}]`,
});

export const tourPages: TourPageData[] = [
  {
    slug: "madrid",
    path: "/ekskursii/madrid/",
    crumb: "Душевный Мадрид",
    h1: "Индивидуальная экскурсия по Мадриду с русскоязычным гидом",
    evaLine:
      "Покажу вам исторический центр так, как хожу по нему сама: Королевский дворец снаружи, Пласа Майор, старые улочки и рынок Сан-Мигель.",
    cardTitle: "Душевный Мадрид",
    duration: "около 3 часов, пешком",
    group: "только ваша компания",
    priceLabel: "от 200 €",
    priceAmount: "200",
    offerDescription:
      "от 200 € за гида команды, около 3 часов. Лично с Евой +50 €. Еда, напитки, билеты и транспорт оплачиваются отдельно.",
    metaTitle: "Индивидуальная экскурсия по Мадриду с русскоязычным гидом | SpainWithEva",
    metaDescription:
      "Душевный Мадрид: пешая прогулка по историческому центру, около 3 часов, от 200 €. Королевский дворец снаружи, Пласа Майор, старые улочки, рынок Сан-Мигель.",
    ogImage: "https://spainwitheva.com/images/tours/madrid/almudena-palace-outside.webp",
    ogImageAlt: "Гости экскурсии у собора Альмудена и Королевского дворца снаружи",
    schemaImage: "https://spainwitheva.com/images/tours/madrid/almudena-palace-outside.webp",
    waText: madridWa,
    hero: {
      src: "/images/tours/madrid/almudena-palace-outside.webp",
      alt: "Гости экскурсии у собора Альмудена и Королевского дворца снаружи",
      width: 1600,
      height: 900,
    },
    photos: [
      {
        src: "/images/tours/madrid/plaza-mayor.webp",
        alt: "Гости экскурсии на Пласа Майор",
        width: 800,
        height: 1422,
      },
      {
        src: "/images/tours/madrid/old-street.webp",
        alt: "Гости экскурсии в старой улочке у Пласа Майор",
        width: 800,
        height: 1067,
      },
      {
        src: "/images/tours/madrid/san-miguel-outside.webp",
        alt: "Гости экскурсии у рынка Сан-Мигель",
        width: 800,
        height: 1172,
      },
      {
        src: "/images/tours/madrid/street-by-plaza-mayor.webp",
        alt: "Гости экскурсии на улице у Пласа Майор",
        width: 800,
        height: 1067,
      },
      {
        src: "/images/tours/madrid/san-miguel-inside.webp",
        alt: "Гости экскурсии внутри рынка Сан-Мигель",
        width: 800,
        height: 1067,
      },
      {
        src: "/images/tours/madrid/plaza-mayor-balcony.webp",
        alt: "Гости экскурсии на фоне Пласа Майор",
        width: 800,
        height: 1067,
      },
    ],
    sees: [
      "Королевский дворец (снаружи)",
      "Пласа Майор",
      "Старые улочки",
      "Рынок Сан-Мигель",
      "Истории города",
      "Атмосферные места",
    ],
    how: [
      "Это пешая прогулка по историческому центру, около 3 часов.",
      "Покажу Королевский дворец снаружи, Пласа Майор, старые улочки и рынок Сан-Мигель. По дороге расскажу истории города и задержимся в атмосферных местах.",
      "Внутрь дворца на этой прогулке не заходим.",
      "Так я показываю не туристическую Испанию: спокойным шагом и своими историями.",
      `Место встречи обсудим в WhatsApp. ${meetingGap}`,
    ],
    faqs: [
      {
        question: "Заходим ли внутрь Королевского дворца?",
        answer:
          "Нет. На этой прогулке смотрим Королевский дворец снаружи. Экскурсию внутри дворца можно заказать дополнительно.",
      },
      {
        question: "Сколько стоит и что входит в цену?",
        answer:
          "Около 3 часов, пешком, от 200 € за гида команды. Лично с Евой +50 €. В цену входят работа гида и подготовленный маршрут. Еду, напитки, входные билеты и транспорт гости оплачивают отдельно, за себя и за гида.",
      },
      {
        question: bookingTerms.faqQuestion,
        answer: bookingTerms.faqAnswer,
      },
      {
        question: "Где встречаемся?",
        answer: meetingAnswer,
      },
    ],
    formats: [
      {
        title: "Изысканный Мадрид",
        text: "Саламанка, район «старых денег», 3 часа, от 200 €.",
        waText: formatWa("Изысканный Мадрид"),
      },
      {
        title: "Вкусный Мадрид",
        text: "Винная библиотека, сыры, авторские коктейли и тапас, лучше вечером, 4 часа, от 250 €.",
        waText: formatWa("Вкусный Мадрид"),
      },
      {
        title: "Мадрид в бокале",
        text: "Вермут в столетней бодеге, тайный бар 1920-х, коктейль от миксолога, места Хемингуэя и Синатры, финал на крыше, 4 часа, от 250 €.",
        waText: formatWa("Мадрид в бокале"),
      },
      {
        title: "Аристократичный Мадрид",
        text: "Полный день: Душевный и Изысканный, с обедом (еда отдельно), от 450 €.",
        waText: formatWa("Аристократичный Мадрид"),
      },
    ],
    extras:
      "Дополнительно: Королевский дворец внутри, музеи Прадо, Рейна София и Тиссен (от 200 € + билеты), стадион Бернабеу, урок фламенко (200 €), фотосъёмка на прогулке (50 обработанных фото за 5 дней).",
    evaLines: [
      "Я Ева, живу в Мадриде и вожу по нему сама.",
      "Историю рассказываю вживую, с паузами на красивое и вкусное.",
    ],
    reviews: madridPageReviews,
    related: [
      {
        href: "/ekskursii/toledo/",
        title: "Толедо",
        meta: "полный день · от 450 € + билеты на поезд",
      },
    ],
  },
  {
    slug: "toledo",
    path: "/ekskursii/toledo/",
    crumb: "Толедо",
    h1: "Индивидуальная экскурсия в Толедо из Мадрида на русском",
    evaLine: "Покажу вам первую столицу Испании. Около 17:00 будем обратно в Мадриде.",
    cardTitle: "Толедо",
    duration: "полный день, обратно около 17:00",
    group: "только ваша компания",
    priceLabel: "от 450 € + билеты на поезд",
    priceAmount: "450",
    offerDescription:
      "от 450 € за гида команды плюс билеты на поезд или трансфер. Лично с Евой +50 €. Еда, напитки и входные билеты оплачиваются отдельно.",
    metaTitle: "Индивидуальная экскурсия в Толедо из Мадрида на русском | SpainWithEva",
    metaDescription:
      "Поездка в Толедо на целый день с русскоязычным гидом. От 450 € плюс билеты на поезд, обратно в Мадрид около 17:00. Замок Алькасар, собор, дом-музей Эль Греко.",
    ogImage: "https://spainwitheva.com/images/tours/toledo/alcazar-panorama.webp",
    ogImageAlt: "Панорама Толедо с замком Алькасар",
    schemaImage: "https://spainwitheva.com/images/tours/toledo/alcazar-panorama.webp",
    waText: toledoWa,
    hero: {
      src: "/images/tours/toledo/alcazar-panorama.webp",
      alt: "Панорама Толедо: замок Алькасар над старым городом",
      width: 1600,
      height: 1000,
      position: "center 40%",
    },
    photos: [
      {
        src: "/images/tours/toledo/panorama-guests.webp",
        alt: "Гости экскурсии на смотровой площадке над Толедо",
        width: 800,
        height: 1067,
      },
      {
        src: "/images/tours/toledo/eva-by-wall.webp",
        alt: "Ева у стены старого Толедо",
        width: 800,
        height: 1422,
      },
      {
        src: "/images/tours/toledo/panorama-group.webp",
        alt: "Гости экскурсии на фоне панорамы Толедо",
        width: 800,
        height: 1422,
      },
      {
        src: "/images/tours/toledo/alcazar-tower.webp",
        alt: "У башни замка Алькасар",
        width: 800,
        height: 1067,
      },
    ],
    sees: [
      "Замок Алькасар",
      "Старые улицы",
      "Остановка на самый вкусный кофе в Испании",
      "Главный средневековый собор",
      "Дом-музей Эль Греко",
      "Хороший обед",
    ],
    how: [
      "Это выезд из Мадрида на целый день. Около 17:00 возвращаемся в Мадрид.",
      "До Толедо около 30 минут на скоростном поезде в одну сторону. Если удобнее с водителем, трансфер посчитаю по запросу. Билеты и трансфер оплачиваются отдельно, за вас и за гида.",
      "Смотрим замок Алькасар, где жили Габсбурги, старые улицы, главный средневековый собор и дом-музей Эль Греко. По пути остановка на самый вкусный кофе в Испании и хороший обед. Еда и напитки оплачиваются отдельно.",
      `Место встречи обсудим в WhatsApp. ${meetingGap}`,
    ],
    separateNote:
      "Билеты на скоростной поезд или трансфер с водителем тоже оплачивают гости. Цену трансфера называю по запросу.",
    faqs: [
      {
        question: "Сколько стоит и что входит в цену?",
        answer:
          "Полный день, от 450 € за гида команды плюс билеты на поезд. Лично с Евой +50 €. В цену входят работа гида и подготовленный маршрут. Еду, напитки, входные билеты и транспорт, включая поезд или трансфер, гости оплачивают отдельно, за себя и за гида.",
      },
      {
        question: "Как добираемся и во сколько обратно?",
        answer:
          "На скоростном поезде около 30 минут в одну сторону. Можно с водителем, цену трансфера посчитаю по запросу. Билеты и трансфер оплачиваются отдельно. В Мадрид возвращаемся около 17:00.",
      },
      {
        question: bookingTerms.faqQuestion,
        answer: bookingTerms.faqAnswer,
      },
      {
        question: "Где встречаемся?",
        answer: meetingAnswer,
      },
    ],
    evaLines: [
      "Я Ева. Этот выезд в Толедо веду сама.",
      "К 17:00 возвращаемся в Мадрид.",
    ],
    reviews: toledoReviews,
    related: [
      {
        href: "/ekskursii/madrid/",
        title: "Душевный Мадрид",
        meta: "около 3 часов · от 200 €",
      },
    ],
  },
];

export function getTour(slug: string) {
  return tourPages.find((tour) => tour.slug === slug);
}

const soulful = tourPages[0];
const toledo = tourPages[1];

export const cardGroups: Array<{ title: string; cards: TourCardData[] }> = [
  {
    title: "Мадрид",
    cards: [
      {
        id: "madrid",
        title: "Душевный Мадрид",
        why: "Королевский дворец снаружи, Пласа Майор, старые улочки, рынок Сан-Мигель.",
        meta: "3 часа · от 200 €",
        photo: soulful.hero,
        href: soulful.path,
        waText: madridWa,
      },
      {
        id: "salamanca",
        title: "Изысканный Мадрид",
        why: "Саламанка и район «старых денег».",
        meta: "3 часа · от 200 €",
        photo: photoGap("Изысканный Мадрид"),
        waText: formatWa("Изысканный Мадрид"),
      },
      {
        id: "tasty",
        title: "Вкусный Мадрид",
        why: "Вина, сыры, коктейли и тапас, лучше вечером.",
        meta: "4 часа · от 250 €",
        photo: photoGap("Вкусный Мадрид"),
        waText: formatWa("Вкусный Мадрид"),
      },
      {
        id: "glass",
        title: "Мадрид в бокале",
        why: "Вермут, бар 1920-х, Хемингуэй, Синатра, финал на крыше.",
        meta: "4 часа · от 250 €",
        photo: photoGap("Мадрид в бокале"),
        waText: formatWa("Мадрид в бокале"),
      },
      {
        id: "aristocratic",
        title: "Аристократичный Мадрид",
        why: "Душевный и Изысканный за один день, с обедом.",
        meta: "полный день · от 450 €",
        photo: photoGap("Аристократичный Мадрид"),
        waText: formatWa("Аристократичный Мадрид"),
      },
    ],
  },
  {
    title: "Поездки из Мадрида",
    cards: [
      {
        id: "toledo",
        title: "Толедо",
        why: "Первая столица Испании: Алькасар, собор и Эль Греко.",
        meta: "полный день · от 450 € + билеты на поезд",
        photo: toledo.hero,
        href: toledo.path,
        waText: toledoWa,
      },
      {
        id: "segovia",
        title: "Сеговия",
        why: "Акведук, королевский Алькасар и старый город.",
        meta: "полный день · от 450 € + билеты на поезд",
        photo: photoGap("Сеговия"),
        waText: formatWa("Сеговия"),
      },
      {
        id: "aranjuez",
        title: "Аранхуэс",
        why: "Летняя королевская резиденция.",
        meta: "полный день · от 450 € + билеты на поезд",
        photo: photoGap("Аранхуэс"),
        waText: formatWa("Аранхуэс"),
      },
      {
        id: "escorial",
        title: "Эскориал и Долина Павших",
        why: "Выезд из Мадрида на целый день.",
        meta: "полный день · от 450 € + билеты на поезд",
        photo: photoGap("Эскориал и Долина Павших"),
        waText: formatWa("Эскориал и Долина Павших"),
      },
    ],
  },
];

function wordCount(parts: string[]) {
  return parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function collectGaps(value: unknown, found = new Set<string>()): string[] {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\[УТОЧНИТЬ:[^\]]+\]/g)) found.add(match[0]);
    return [...found];
  }
  if (Array.isArray(value)) {
    for (const item of value) collectGaps(item, found);
    return [...found];
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectGaps(item, found);
  }
  return [...found];
}

for (const tour of tourPages) {
  const words = wordCount(tour.how);
  if (words > 150) {
    throw new Error(`${tour.slug} how-it-goes is ${words} words`);
  }
  if (tour.sees.length < 6 || tour.sees.length > 8) {
    throw new Error(`${tour.slug} sees has ${tour.sees.length} items`);
  }
}
