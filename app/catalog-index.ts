import { madridCatalogTours, madridTours, spainTours } from "./site-content";

/**
 * Titles already shown as cards in «Мадрид» and «Поездки из Мадрида».
 * The Russian home carousel skips these and lists everything else.
 */
export const alreadyOnExcursionCards = new Set([
  "Душевный Мадрид",
  "Изысканный Мадрид",
  "Аристократичный Мадрид",
  "Вкусный Мадрид",
  "Толедо: первая столица Испании",
  "Сеговия: акведук и королевский Алькасар",
]);

export const OTHER_CITIES_ID = "drugie-goroda";

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function catalogAnchor(title: string) {
  return Array.from(title.toLowerCase())
    .map((char) => CYR[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CatalogListItem = {
  id: string;
  city: string;
  title: string;
  text: string;
  duration: string;
  madrid: boolean;
};

const carouselSource = [
  ...madridTours.map(({ title, duration, text }) => ({
    city: "Мадрид",
    title,
    duration,
    text,
  })),
  ...madridCatalogTours,
  ...spainTours,
];

function toItem(tour: (typeof carouselSource)[number]): CatalogListItem {
  return {
    id: catalogAnchor(tour.title),
    city: tour.city,
    title: tour.title,
    text: tour.text,
    duration: tour.duration,
    madrid: tour.city === "Мадрид",
  };
}

const additions = carouselSource
  .filter((tour) => !alreadyOnExcursionCards.has(tour.title))
  .map(toItem);

const seenIds = new Set<string>();
for (const item of additions) {
  if (!item.id || seenIds.has(item.id)) {
    throw new Error(`Bad catalog anchor for «${item.title}»: ${item.id}`);
  }
  seenIds.add(item.id);
}

const byTitle = new Map(additions.map((item) => [item.title, item]));

export const madridCatalogAdditions = additions.filter((item) => item.madrid);

export const otherCitySections = (() => {
  const order: string[] = [];
  const groups = new Map<string, CatalogListItem[]>();
  for (const item of additions) {
    if (item.madrid) continue;
    const list = groups.get(item.city);
    if (list) list.push(item);
    else {
      groups.set(item.city, [item]);
      order.push(item.city);
    }
  }
  return order.map((city) => ({ city, items: groups.get(city)! }));
})();

export const catalogAdditions = additions;

/** Russian home-carousel target. Unknown titles land on the other-cities group. */
export function catalogHrefForHome(title: string) {
  const item = byTitle.get(title);
  return `/ekskursii/#${item ? item.id : OTHER_CITIES_ID}`;
}
