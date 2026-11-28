import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve(import.meta.dirname, "..", "out");

// Next renders the React prop as hrefLang. HTML treats that as hreflang, and
// the files uploaded to Hostinger use the lowercase attribute name.
async function normalizeHreflang(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalizeHreflang(fullPath);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;
    const html = await readFile(fullPath, "utf8");
    if (!html.includes("hrefLang=")) continue;
    await writeFile(fullPath, html.replaceAll("hrefLang=", "hreflang="));
  }
}

await normalizeHreflang(root);

const pages = [
  {
    file: "index.html",
    lang: "ru",
    url: "https://spainwitheva.com/",
    ogLocale: "ru_RU",
    title: "SpainWithEva — экскурсии и авторские туры по Испании",
    description:
      "Нескучные экскурсии в Мадриде и по всей Испании, авторские туры, Путь Сантьяго и организация отдыха под ключ.",
    prices: ["от 200 €", "от 450 €", "от 100 € / день поездки"],
  },
  {
    file: "uk/index.html",
    lang: "uk",
    url: "https://spainwitheva.com/uk/",
    ogLocale: "uk_UA",
    title: "SpainWithEva | Екскурсії та подорожі Іспанією",
    description:
      "Ненудні приватні екскурсії, авторські тури, Шлях Сантьяго та організація подорожей усією Іспанією.",
    prices: ["від 200 €", "від 450 €", "від 100 € / день подорожі"],
  },
  {
    file: "en/index.html",
    lang: "en",
    url: "https://spainwitheva.com/en/",
    ogLocale: "en_US",
    title: "SpainWithEva | Private Tours and Travel in Spain",
    description:
      "Private tours, bespoke journeys, the Camino de Santiago and tailor-made travel throughout Spain.",
    prices: ["from €200", "from €450", "from €100 / travel day"],
  },
  {
    file: "es/index.html",
    lang: "es",
    url: "https://spainwitheva.com/es/",
    ogLocale: "es_ES",
    title: "SpainWithEva | Visitas privadas y viajes por España",
    description:
      "Visitas privadas, viajes a medida, Camino de Santiago y organización de vacaciones por toda España.",
    prices: ["desde 200 €", "desde 450 €", "desde 100 € / día de viaje"],
  },
];

const hreflang = {
  ru: "https://spainwitheva.com/",
  uk: "https://spainwitheva.com/uk/",
  en: "https://spainwitheva.com/en/",
  es: "https://spainwitheva.com/es/",
  "x-default": "https://spainwitheva.com/",
};

const sameAs = [
  "https://instagram.com/spainwitheva",
  "https://www.youtube.com/@spainwitheva",
  "https://www.facebook.com/spainwithevaa",
  "https://tiktok.com/@spain.with.eva",
  "https://t.me/spainwitheva",
  "https://maps.google.com/?cid=10197345996895462953",
];

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attributes(source) {
  const attrs = {};
  const attrRe = /([^\s=/>]+)(?:=(["'])([\s\S]*?)\2)?/g;
  for (const match of source.matchAll(attrRe)) {
    attrs[match[1].toLowerCase()] = match[3] === undefined ? "" : decode(match[3]);
  }
  return attrs;
}

function tags(html, name) {
  const re = new RegExp(`<${name}\\b([^>]*)>`, "gi");
  return [...html.matchAll(re)].map((match) => attributes(match[1]));
}

function metaContent(html, key, attr) {
  const found = tags(html, "meta").filter((item) => item[attr] === key);
  assert.equal(found.length, 1, `expected one meta ${attr}=${key}`);
  return found[0].content;
}

const failures = [];

async function check(label, fn) {
  try {
    await fn();
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
}

for (const page of pages) {
  const html = await readFile(path.join(root, page.file), "utf8");
  const label = page.file;

  await check(label, () => {
    const htmlTag = html.match(/<html\b([^>]*)>/i);
    assert.ok(htmlTag, "missing <html>");
    assert.equal(attributes(htmlTag[1]).lang, page.lang);
  });

  await check(label, () => {
    assert.doesNotMatch(html, /codex-preview/i);
  });

  await check(`${label} canonical`, () => {
    const canonical = tags(html, "link").filter((item) => item.rel === "canonical");
    assert.equal(canonical.length, 1);
    assert.equal(canonical[0].href, page.url);
  });

  await check(`${label} hreflang`, () => {
    assert.equal(html.includes("hrefLang="), false);
    const alternates = tags(html, "link").filter((item) => item.rel === "alternate");
    const byLang = Object.fromEntries(
      alternates.map((item) => [item.hreflang, item.href]),
    );
    assert.deepEqual(byLang, hreflang);
    for (const lang of Object.keys(hreflang)) {
      assert.ok(html.includes(`hreflang="${lang}"`), `missing literal hreflang ${lang}`);
    }
  });

  await check(`${label} open graph`, () => {
    assert.equal(metaContent(html, "og:title", "property"), page.title);
    assert.equal(metaContent(html, "og:description", "property"), page.description);
    assert.equal(metaContent(html, "og:url", "property"), page.url);
    assert.equal(metaContent(html, "og:locale", "property"), page.ogLocale);
    assert.equal(
      metaContent(html, "og:image", "property"),
      "https://spainwitheva.com/images/hero-eva-madrid.webp",
    );
  });

  await check(`${label} twitter`, () => {
    assert.equal(metaContent(html, "twitter:card", "name"), "summary_large_image");
    assert.equal(metaContent(html, "twitter:title", "name"), page.title);
    assert.equal(metaContent(html, "twitter:description", "name"), page.description);
    assert.equal(metaContent(html, "twitter:url", "name"), page.url);
    assert.equal(
      metaContent(html, "twitter:image", "name"),
      "https://spainwitheva.com/images/hero-eva-madrid.webp",
    );
  });

  await check(`${label} title`, () => {
    const title = html.match(/<title>([^<]*)<\/title>/);
    assert.ok(title, "missing <title>");
    assert.equal(decode(title[1]), page.title);
  });

  await check(`${label} json-ld`, () => {
    const script = html.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    assert.ok(script, "missing JSON-LD");
    const data = JSON.parse(script[1]);
    const types = Array.isArray(data["@type"]) ? data["@type"] : [data["@type"]];
    assert.ok(types.includes("TravelAgency"));
    assert.ok(types.includes("LocalBusiness"));
    assert.equal(data.name, "SpainWithEva");
    assert.equal(data.url, "https://spainwitheva.com/");
    assert.equal(data.telephone, "+34 684 76 20 85");
    assert.equal(data.priceRange, "€100–€450");
    assert.equal(data.address.addressLocality, "Madrid");
    assert.equal(data.address.addressCountry, "ES");
    assert.equal(data.areaServed.name, "Spain");
    assert.deepEqual(data.sameAs, sameAs);
    assert.equal(data.aggregateRating, undefined);
    assert.equal(data.review, undefined);
    assert.equal(data.reviewRating, undefined);
  });

  await check(`${label} prices`, () => {
    for (const price of page.prices) {
      assert.ok(html.includes(price), `missing visible price ${price}`);
    }
  });
}

await check("robots.txt", async () => {
  const robots = await readFile(path.join(root, "robots.txt"), "utf8");
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//);
  assert.doesNotMatch(robots, /Disallow:\s*\/\S/);
  assert.match(robots, /Sitemap:\s*https:\/\/spainwitheva\.com\/sitemap\.xml/);
});

await check("sitemap.xml", async () => {
  const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
  for (const url of [
    "https://spainwitheva.com/",
    "https://spainwitheva.com/uk/",
    "https://spainwitheva.com/en/",
    "https://spainwitheva.com/es/",
  ]) {
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `missing loc ${url}`);
  }
  for (const [lang, href] of Object.entries(hreflang)) {
    assert.ok(
      sitemap.includes(`hreflang="${lang}"`),
      `missing hreflang ${lang}`,
    );
    assert.ok(sitemap.includes(`href="${href}"`), `missing href ${href}`);
  }
  const blocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  assert.equal(blocks.length, 16);
  const legalLocs = [
    "https://spainwitheva.com/pravovaya-informaciya/",
    "https://spainwitheva.com/uk/pravova-informatsiia/",
    "https://spainwitheva.com/en/legal/",
    "https://spainwitheva.com/es/aviso-legal/",
  ];
  for (const url of legalLocs) {
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `missing loc ${url}`);
  }
  const singleLanguageLocs = [
    "https://spainwitheva.com/ekskursii/",
    "https://spainwitheva.com/ekskursii/madrid/",
    "https://spainwitheva.com/ekskursii/toledo/",
    "https://spainwitheva.com/ekskursii/segovia/",
    "https://spainwitheva.com/stati/",
    "https://spainwitheva.com/stati/chto-posmotret-v-madride-za-1-2-dnya/",
    "https://spainwitheva.com/stati/chto-posmotret-v-toledo-za-den/",
    "https://spainwitheva.com/poleznoe-dlya-poezdki/",
  ];
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (singleLanguageLocs.includes(loc)) {
      assert.equal(block.includes("hreflang"), false, `${loc} must not have hreflang`);
    }
    if (legalLocs.includes(loc)) {
      assert.ok(block.includes("<priority>0.2</priority>"), `${loc} priority`);
      assert.ok(block.includes('hreflang="ru"'), `${loc} hreflang`);
    }
  }
  for (const url of singleLanguageLocs) {
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `missing loc ${url}`);
  }
});

const mapsUrl = "https://maps.google.com/?cid=10197345996895462953";

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => JSON.parse(match[1]),
  );
}

function walk(value, visit) {
  if (!value || typeof value !== "object") return;
  visit(value);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach((item) => walk(item, visit));
    else walk(child, visit);
  }
}

function assertNoReviewMarkup(data, label) {
  walk(data, (node) => {
    assert.equal(node.aggregateRating, undefined, `${label} aggregateRating`);
    assert.equal(node.review, undefined, `${label} review`);
    assert.equal(node.reviewRating, undefined, `${label} reviewRating`);
  });
}

await check("tour pages", async () => {
  const madrid = await readFile(path.join(root, "ekskursii/madrid/index.html"), "utf8");
  const toledo = await readFile(path.join(root, "ekskursii/toledo/index.html"), "utf8");
  const segovia = await readFile(path.join(root, "ekskursii/segovia/index.html"), "utf8");
  const index = await readFile(path.join(root, "ekskursii/index.html"), "utf8");
  const home = await readFile(path.join(root, "index.html"), "utf8");
  const english = await readFile(path.join(root, "en/index.html"), "utf8");

  for (const [html, title, canonical] of [
    [madrid, "Индивидуальная экскурсия по Мадриду с русскоязычным гидом | SpainWithEva", "https://spainwitheva.com/ekskursii/madrid/"],
    [toledo, "Индивидуальная экскурсия в Толедо из Мадрида на русском | SpainWithEva", "https://spainwitheva.com/ekskursii/toledo/"],
    [index, "Экскурсии по Мадриду и поездки из Мадрида с русскоязычным гидом | SpainWithEva", "https://spainwitheva.com/ekskursii/"],
  ]) {
    const found = html.match(/<title>([^<]*)<\/title>/);
    assert.equal(decode(found[1]), title);
    const canonicalLink = tags(html, "link").filter((item) => item.rel === "canonical");
    assert.equal(canonicalLink.length, 1);
    assert.equal(canonicalLink[0].href, canonical);
    assert.equal(html.includes("hreflang="), false, canonical);
    assert.equal(metaContent(html, "og:url", "property"), canonical);
    assert.equal(metaContent(html, "og:title", "property"), title);
  }

  assert.equal(metaContent(madrid, "og:image", "property"), "https://spainwitheva.com/images/tours/madrid/almudena-palace-outside.webp");
  assert.equal(metaContent(toledo, "og:image", "property"), "https://spainwitheva.com/images/tours/toledo/alcazar-panorama.webp");
  assert.ok(madrid.includes('width="1600"'));
  assert.ok(toledo.includes('width="1600"'));
  assert.ok(madrid.includes("/images/eva/portrait.webp"));
  assert.ok(toledo.includes("/images/eva/portrait.webp"));
  assert.equal(madrid.includes("[УТОЧНИТЬ: фото"), false);
  assert.equal(toledo.includes("[УТОЧНИТЬ: фото"), false);
  for (const [html, label] of [[madrid, "madrid"], [toledo, "toledo"]]) {
    let imageBytes = 0;
    const seen = new Set();
    for (const match of html.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/gi)) {
      const url = decode(match[1]);
      if (!url.startsWith("/images/tours/") && !url.startsWith("/images/eva/")) continue;
      if (seen.has(url)) continue;
      seen.add(url);
      imageBytes += statSync(path.join(root, url)).size;
    }
    assert.ok(imageBytes < 1_500_000, `${label} images ${imageBytes}`);
  }

  assert.ok(madrid.includes("Королевский дворец (снаружи)"));
  assert.ok(madrid.includes("Заходим ли внутрь Королевского дворца?"));
  assert.ok(madrid.includes("Экскурсию внутри дворца можно заказать дополнительно."));
  assert.ok(madrid.includes("Пласа Майор"));
  assert.ok(madrid.includes("Сан-Мигель"));
  assert.ok(madrid.includes("от 200 €"));
  assert.ok(madrid.includes("Изысканный Мадрид"));
  assert.ok(madrid.includes("Вкусный Мадрид"));
  assert.ok(madrid.includes("Мадрид в бокале"));
  assert.ok(madrid.includes("Аристократичный Мадрид"));
  assert.ok(madrid.includes("Королевский дворец внутри"));
  assert.equal(madrid.includes("Сибелес"), false);
  assert.equal(madrid.includes("Cibeles"), false);

  assert.ok(toledo.includes("от 450 € + билеты на поезд"));
  assert.ok(toledo.includes("около 30 минут"));
  assert.ok(toledo.includes("17:00"));
  assert.ok(toledo.includes("Замок Алькасар"));
  assert.ok(toledo.includes("Эль Греко"));
  assert.equal(toledo.includes("+ расходы"), false);
  assert.equal(toledo.includes("405"), false);

  for (const html of [madrid, toledo]) {
    assert.ok(html.includes("Место встречи согласуем в WhatsApp"));
    assert.equal(html.includes("[УТОЧНИТЬ"), false);
    assert.equal(html.includes("лично с Евой +50 €"), false);
    assert.equal(html.includes("Лично с Евой +50 €"), false);
    assert.equal(html.includes("за гида команды"), false);
    assert.ok(html.includes("Предоплата (сумма по договорённости) входит в стоимость экскурсии"));
    assert.ok(html.includes("за 14 дней и ранее: полный возврат;"));
    assert.ok(html.includes("за 7–13 дней: возврат 50% предоплаты;"));
    assert.ok(html.includes("менее чем за 7 дней: предоплата не возвращается."));
    assert.ok(html.includes("Можно ли отменить или перенести?"));
    assert.equal(html.includes("Отзывы в Google"), false);
    assert.equal(html.includes("5,0 · 40 отзывов в Google Картах"), false);
    assert.equal(html.includes("читать целиком"), false);
    assert.equal(html.includes("Оценка 5 из 5"), false);
    assert.equal(html.includes("review-card"), false);
    assert.ok(html.includes("★ 5,0 · 40 отзывов в Google"));
    const reviewsLink = html.match(
      /<a\b[^>]*class="google-badge"[^>]*href="https:\/\/maps\.app\.goo\.gl\/YqFXduUcaWz6ovzn9"[^>]*>/,
    );
    assert.ok(reviewsLink, "missing Google reviews link");
    assert.match(reviewsLink[0], /target="_blank"/);
    assert.match(reviewsLink[0], /rel="noopener"/);
    assert.ok(html.includes(mapsUrl));
    assert.equal(html.includes("Tripster"), false);
    assert.equal(html.includes("Трипстер"), false);
    assert.equal(html.includes("PayPal"), false);
    assert.equal(html.includes("грузинский"), false);
    assert.equal(html.includes("если речь идёт именно о нём"), false);
    const withoutQuoteMark = html
      .replaceAll("— Elena Shi, Google", "")
      .replaceAll("— Jeyla Huseynova, Google", "");
    assert.equal(withoutQuoteMark.includes("—"), false);
    const blocks = jsonLdBlocks(html);
    assert.ok(blocks.length >= 2);
    for (const block of blocks) assertNoReviewMarkup(block, "tour");
    const graph = blocks.find((block) => Array.isArray(block["@graph"]))["@graph"];
    const product = graph.find((node) => node["@type"] === "Product");
    const trip = graph.find((node) => node["@type"] === "TouristTrip");
    const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");
    const faq = graph.find((node) => node["@type"] === "FAQPage");
    assert.ok(product.offers.price === "200" || product.offers.price === "450");
    assert.equal(product.offers.priceCurrency, "EUR");
    assert.equal(product.offers.priceSpecification.price, product.offers.price);
    assert.ok(trip.itinerary.itemListElement.length >= 6);
    assert.equal(crumbs.itemListElement.length, 3);
    assert.ok(faq.mainEntity.length >= 3 && faq.mainEntity.length <= 5);
  }

  const madridLd = jsonLdBlocks(madrid).find((block) => Array.isArray(block["@graph"]));
  const toledoLd = jsonLdBlocks(toledo).find((block) => Array.isArray(block["@graph"]));
  assert.equal(madridLd["@graph"].find((node) => node["@type"] === "Product").offers.price, "200");
  assert.equal(toledoLd["@graph"].find((node) => node["@type"] === "Product").offers.price, "450");

  assert.equal(madrid.includes("что придет особый шарм прогулке"), false);
  assert.equal(madrid.includes("обязательно обратимся снова."), false);
  assert.ok(madrid.includes("Прекрасно провели время, узнали много интересных фактов о Мадриде, которые не прочтёшь нигде."));
  assert.ok(madrid.includes("— Elena Shi, Google"));
  assert.ok(madrid.includes("Душевный Мадрид"));
  assert.equal(madrid.includes("«Душевный Мадрид»"), false);
  assert.equal(madrid.includes("Dariya Vlasova"), false);
  assert.equal(madrid.includes("«Мадрид»</span>"), false);
  assert.equal(madrid.includes("Обязательно с Евой :)"), false);
  assert.equal(madrid.includes("Jeyla Huseynova"), false);
  assert.equal(madrid.includes("Roman Pyshkin"), false);
  assert.equal(madrid.includes("Мы выбрали маршрут"), false);
  assert.equal(madrid.includes("Мадрид,Толедо с Евой!!!"), false);
  assert.ok(toledo.includes("— Jeyla Huseynova, Google"));
  assert.equal(toledo.includes("«Мадрид и Толедо»"), false);
  assert.equal(toledo.includes("Madrid + Toledo"), false);
  assert.equal(toledo.includes("фактов,историй"), false);
  assert.equal(toledo.includes("Интересно,  душевно"), false);
  assert.ok(toledo.includes("Интересно, душевно, множество интересных фактов, историй, о которых мало кто расскажет"));
  assert.equal(toledo.includes("Теперь Испания только с Евой 👌👌"), false);
  assert.equal(toledo.includes("Elena Shi"), false);
  assert.equal(toledo.includes("Александр Барабан"), false);
  assert.equal(toledo.includes("Мадрид,Толедо с Евой!!!"), false);

  const segoviaTitle = "Индивидуальная экскурсия в Сеговию из Мадрида на русском | SpainWithEva";
  const segoviaCanonical = "https://spainwitheva.com/ekskursii/segovia/";
  assert.equal(decode(segovia.match(/<title>([^<]*)<\/title>/)[1]), segoviaTitle);
  assert.equal(metaContent(segovia, "description", "name"), "Индивидуальная экскурсия в Сеговию из Мадрида на русском. Выезд в 10:30, обратно в 17:00, от 450 €. Алькасар, средневековые улицы и римский акведук.");
  assert.equal(metaContent(segovia, "og:url", "property"), segoviaCanonical);
  assert.equal(metaContent(segovia, "og:image", "property"), "https://spainwitheva.com/images/tours/segovia/segovia-eva-alcazar-wall.webp");
  assert.equal(metaContent(segovia, "og:image:alt", "property"), "Ева на стене Алькасара в Сеговии");
  assert.equal(segovia.includes("hreflang="), false);
  assert.ok(segovia.includes("<h1>Индивидуальная экскурсия в Сеговию из Мадрида на русском</h1>"));
  assert.ok(segovia.includes("от 450 €"));
  assert.equal(segovia.includes("лично с Евой +50 €"), false);
  assert.ok(segovia.includes("Оплачивается отдельно"));
  assert.ok(segovia.includes("Я, ваш гид на русском, и подготовленный маршрут."));
  assert.ok(segovia.includes("Билеты на поезд или трансфер, вход в Алькасар, обед и вино оплачиваются отдельно, за вас и за гида."));
  assert.ok(segovia.includes("Покажу вам Сеговию сама, на русском."));
  assert.equal(segovia.includes("тебе"), false);
  assert.equal(segovia.includes("твой"), false);
  assert.equal(segovia.includes("Попробуй"), false);
  assert.ok(segovia.includes(">только ваша компания<"));
  assert.equal(segovia.includes("Только ваша компания, без чужих людей."), false);
  assert.equal(segovia.includes("Формат культурный и исторический"), false);
  assert.equal(segovia.includes("не туристическ"), false);
  assert.ok(segovia.includes("Говорят, этот замок вдохновил Уолта Диснея."));
  assert.ok(segovia.includes("один из лучше всего сохранившихся римских акведуков"));
  assert.ok(segovia.includes("шефа Оскара, которого знает вся Испания"));
  assert.equal(segovia.includes("ресторан"), false);
  assert.ok(segovia.includes("Кочинильо, молочный поросёнок и блюда региона"));
  assert.equal(segovia.includes("крупнейш"), false);
  assert.equal(segovia.includes("самый большой"), false);
  assert.equal(segovia.includes("—"), false);
  assert.ok(segovia.includes(encodeURIComponent("Привет! Хочу индивидуальную экскурсию в Сеговию из Мадрида. Дата: , нас будет: ")));
  assert.ok(segovia.includes('data-umami-event="whatsapp"'));
  assert.ok(segovia.includes('data-umami-event-tour="segovia"'));
  assert.ok(segovia.includes('data-umami-event-place="tour-page"'));
  assert.equal(segovia.includes("Jeyla Huseynova"), false);
  assert.equal(segovia.includes("Elena Shi"), false);
  assert.equal(segovia.includes("★ 5,0"), false);
  assert.ok(segovia.includes("/images/tours/segovia/segovia-eva-alcazar-wall.webp"));
  assert.ok(segovia.includes('alt="Ева на стене Алькасара в Сеговии"'));
  const heroTag = segovia.match(/<img\b[^>]*src="\/images\/tours\/segovia\/segovia-eva-alcazar-wall.webp"[^>]*>/);
  assert.ok(heroTag, "missing hero img");
  assert.match(heroTag[0], /loading="eager"/);
  assert.match(heroTag[0], /object-position:\s*center 40%/);
  for (const src of [
    "/images/tours/segovia/segovia-aqueduct-arches.webp",
    "/images/tours/segovia/segovia-aqueduct-plaza.webp",
    "/images/tours/segovia/segovia-alcazar-hill.webp",
    "/images/tours/segovia/segovia-eva-alcazar-battlements.webp",
    "/images/tours/segovia/segovia-chef-oscar-cochinillo.webp",
    "/images/tours/segovia/segovia-eva-lunch-wine.webp",
    "/images/tours/segovia/segovia-group-alcazar.webp",
  ]) {
    const tag = segovia.match(new RegExp(`<img\\b[^>]*src="${src}"[^>]*>`));
    assert.ok(tag, src);
    assert.match(tag[0], /loading="lazy"/);
  }
  assert.equal(segovia.includes("/images/tours/cards/segovia-aqueduct.webp"), false);
  assert.ok(segovia.includes("/images/eva/portrait.webp"));
  const segoviaLd = jsonLdBlocks(segovia).find((block) => Array.isArray(block["@graph"]));
  assertNoReviewMarkup(segoviaLd, "segovia");
  const segoviaGraph = segoviaLd["@graph"];
  const segoviaProduct = segoviaGraph.find((node) => node["@type"] === "Product");
  const segoviaTrip = segoviaGraph.find((node) => node["@type"] === "TouristTrip");
  const segoviaCrumbs = segoviaGraph.find((node) => node["@type"] === "BreadcrumbList");
  const segoviaFaq = segoviaGraph.find((node) => node["@type"] === "FAQPage");
  assert.equal(segoviaProduct.offers["@type"], "Offer");
  assert.equal(segoviaProduct.offers.price, "450");
  assert.equal(segoviaProduct.offers.priceCurrency, "EUR");
  assert.equal(
    segoviaProduct.offers.description,
    "от 450 € за работу гида Евы. Билеты на поезд или трансфер, вход в Алькасар, обед и вино оплачиваются отдельно.",
  );
  assert.equal(segoviaTrip["@type"], "TouristTrip");
  assert.equal(segoviaTrip.image, "https://spainwitheva.com/images/tours/segovia/segovia-eva-alcazar-wall.webp");
  assert.equal(segoviaProduct.image, segoviaTrip.image);
  assert.equal(segoviaTrip.itinerary.itemListElement.length, 6);
  assert.equal(segoviaCrumbs.itemListElement[2].name, "Сеговия");
  assert.equal(segoviaCrumbs.itemListElement[2].item, segoviaCanonical);
  assert.equal(segoviaFaq.mainEntity.length, 4);
  assert.ok(madrid.includes('href="/ekskursii/segovia/"'));
  assert.ok(toledo.includes('href="/ekskursii/segovia/"'));

  assert.ok(home.includes('href="/ekskursii/madrid/"'));
  assert.ok(home.includes('href="/ekskursii/toledo/"'));
  assert.ok(home.includes('href="/ekskursii/segovia/"'));
  const homeCards = [...home.matchAll(/<article class="tour-link-card">([\s\S]*?)<\/article>/g)].map((match) => match[1]);
  const segoviaCard = homeCards.find((card) => card.includes("<h3>Сеговия</h3>"));
  const toledoCard = homeCards.find((card) => card.includes("<h3>Толедо</h3>"));
  assert.ok(segoviaCard, "missing Segovia home card");
  assert.equal(segoviaCard.includes("лично с Евой +50 €"), false);
  assert.ok(segoviaCard.includes("от 450 €"));
  assert.equal(toledoCard.includes("лично с Евой +50 €"), false);
  assert.equal(home.includes("лично с Евой +50 €"), false);
  assert.equal(index.includes("лично с Евой +50 €"), false);
  assert.ok(home.includes('href="/stati/"'));
  assert.equal((home.match(/href="\/poleznoe-dlya-poezdki\/"/g) || []).length, 1);
  assert.ok(madrid.includes('href="/stati/"'));
  assert.equal((madrid.match(/href="\/poleznoe-dlya-poezdki\/"/g) || []).length, 1);
  assert.ok(home.includes("Сеговия"));
  assert.ok(home.includes("Аранхуэс"));
  assert.ok(home.includes("Эскориал и Долина Павших"));
  assert.ok(home.includes("Работаем и в других городах Испании."));
  assert.equal(home.includes("Отзывы в Google"), false);
  assert.equal(home.includes("5,0 · 40 отзывов в Google Картах"), false);
  assert.equal(home.includes("5,0 ★ · 40 отзывов в Google"), false);
  assert.equal(home.includes("review-card"), false);
  assert.equal(home.includes("читать целиком"), false);
  assert.ok(home.includes("★ 5,0 · 40 отзывов в Google"));
  const homeBadge = home.match(
    /<a\b[^>]*class="google-badge"[^>]*href="https:\/\/maps\.app\.goo\.gl\/YqFXduUcaWz6ovzn9"[^>]*>★ 5,0 · 40 отзывов в Google<\/a>/,
  );
  assert.ok(homeBadge, "missing home Google rating pill");
  assert.match(homeBadge[0], /target="_blank"/);
  assert.match(homeBadge[0], /rel="noopener"/);
  assert.equal(home.includes("Elena Shi"), false);
  assert.equal(home.includes("Jeyla Huseynova"), false);
  assert.equal(home.includes("Dariya Vlasova"), false);
  assert.equal(home.includes("Svetlana Patseva"), false);
  assert.equal(home.includes("Inna Dorn"), false);
  assert.equal(home.includes("Александр Барабан"), false);
  assert.equal(home.includes("Отличный гид!  Очень живописные места"), false);
  assert.equal(home.includes("Ева ты лучшая !!!!"), false);
  assert.equal(home.includes("настолько познавательной! …"), false);
  assert.equal(home.includes("«Гастротур по Мадриду и Валенсия»"), false);
  assert.equal(home.includes("«Мадрид и Толедо»"), false);
  assert.equal(home.includes("«Мадрид»"), false);
  assert.equal(home.includes("gastro Madrid + Valencia"), false);
  assert.equal(home.includes("Madrid + Toledo"), false);
  assert.equal(home.includes("Roman Pyshkin"), false);
  assert.equal(home.includes("Ekaterina Ivashchenko"), false);
  assert.equal(home.includes("Anastasija Morozova"), false);
  assert.ok(home.includes(mapsUrl));
  assert.equal(home.includes('"aggregateRating"'), false);
  assert.equal(home.includes('"reviewRating"'), false);
  assert.equal(english.includes("/ekskursii/madrid/"), false);
  assert.equal(english.includes("/ekskursii/toledo/"), false);
  assert.equal(english.includes("/ekskursii/segovia/"), false);
  for (const file of ["en/index.html", "uk/index.html", "es/index.html"]) {
    const html = file === "en/index.html" ? english : await readFile(path.join(root, file), "utf8");
    assert.equal(html.includes('href="/stati/"'), false, file);
    assert.equal(html.includes("/poleznoe-dlya-poezdki/"), false, file);
    assert.equal(html.includes("Отзывы в Google"), false, file);
    assert.equal(html.includes("Elena Shi"), false, file);
  }

  assert.ok(index.includes('href="/ekskursii/madrid/"'));
  assert.ok(index.includes('href="/ekskursii/toledo/"'));
  assert.ok(index.includes('href="/ekskursii/segovia/"'));
  assert.equal(index.includes("hreflang="), false);
  assert.ok(index.includes("по всей Испании"));
  assert.ok(index.includes("Другие города Испании"));
  assert.ok(index.includes("Стадион и музей Real Madrid"));
  assert.ok(index.includes("Puy du Fou: история оживает"));
  assert.ok(index.includes("Обзорная Барселона"));
  assert.ok(index.includes("Валенсия на пересечении эпох"));
  assert.ok(index.includes("цена по запросу"));
  assert.equal(index.includes("Готический квартал, Пасео-де-Грасия"), false);
  assert.equal(index.includes("Севиль"), false);
  assert.equal(index.includes('class="tour-fallback"'), false);
  const catalogHrefs = [...index.matchAll(/href="([^"]+)"/g)]
    .map((match) => decode(match[1]))
    .filter((href) => href.includes("wa.me") || href.startsWith("/ekskursii/"))
    .map((href) => decodeURIComponent(href));
  assert.ok(
    catalogHrefs.some((href) => href.includes("Здравствуйте! Интересует экскурсия: Обзорная Барселона")),
    "missing Barcelona WhatsApp inquiry",
  );
  assert.ok(
    catalogHrefs.some((href) => href.startsWith("https://wa.me/34684762085?text=")),
    "missing WhatsApp catalog link",
  );
  const indexLd = jsonLdBlocks(index).find((block) => Array.isArray(block["@graph"]));
  assertNoReviewMarkup(indexLd, "catalog index");
  const itemList = indexLd["@graph"].find((node) => node["@type"] === "ItemList");
  assert.equal(itemList.itemListElement[0].name, "Душевный Мадрид");
  assert.equal(itemList.itemListElement[0].url, "https://spainwitheva.com/ekskursii/madrid/");
  assert.equal(itemList.itemListElement[1].name, "Толедо");
  assert.equal(itemList.itemListElement[1].url, "https://spainwitheva.com/ekskursii/toledo/");
  assert.equal(itemList.itemListElement[2].name, "Сеговия");
  assert.equal(itemList.itemListElement[2].url, "https://spainwitheva.com/ekskursii/segovia/");
  assert.ok(itemList.itemListElement.length > 2);
  assert.ok(itemList.itemListElement.some((item) => item.name === "Стадион и музей Real Madrid"));
  assert.equal(home.includes('href="/ekskursii/#'), true);
  assert.equal(english.includes('href="/ekskursii/#'), false);
  for (const file of ["uk/index.html", "es/index.html"]) {
    const html = await readFile(path.join(root, file), "utf8");
    assert.equal(html.includes('href="/ekskursii/#'), false, file);
  }
});

await check("article pages", async () => {
  const index = await readFile(path.join(root, "stati/index.html"), "utf8");
  const article = await readFile(
    path.join(root, "stati/chto-posmotret-v-madride-za-1-2-dnya/index.html"),
    "utf8",
  );
  const title = "Что посмотреть в Мадриде за 1–2 дня: маршрут Евы";
  const description =
    "Пеший маршрут по Мадриду на 1–2 дня от гида Евы: куда идти по центру, где поесть без туристических ловушек и что оставить на второй день.";
  const canonical = "https://spainwitheva.com/stati/chto-posmotret-v-madride-za-1-2-dnya/";

  assert.equal(decode(article.match(/<title>([^<]*)<\/title>/)[1]), title);
  assert.equal(metaContent(article, "description", "name"), description);
  const canonicalLink = tags(article, "link").filter((item) => item.rel === "canonical");
  assert.equal(canonicalLink.length, 1);
  assert.equal(canonicalLink[0].href, canonical);
  assert.equal(metaContent(article, "og:title", "property"), title);
  assert.equal(metaContent(article, "og:description", "property"), description);
  assert.equal(metaContent(article, "og:url", "property"), canonical);
  assert.equal(metaContent(article, "og:type", "property"), "article");
  assert.match(article, /<html[^>]*\slang=["']ru["']/i);
  assert.ok(article.includes("<h1>Что посмотреть в Мадриде за 1–2 дня</h1>"));
  assert.ok(article.includes('href="/ekskursii/madrid/"'));
  assert.ok(article.includes('href="/ekskursii/segovia/"'));
  assert.equal(article.includes('href="/ekskursii/segovia/" target='), false);
  assert.equal(article.includes('href="/ekskursii/madrid/" target='), false);
  assert.ok(article.includes('href="https://www.parroquiadesantacruz.com/" target="_blank" rel="noopener noreferrer"'));
  assert.ok(article.includes('href="https://www.casaalberto.es/" target="_blank" rel="noopener noreferrer"'));
  assert.ok(article.includes('href="/stati/"'));
  assert.ok(article.includes("Написать в WhatsApp"));
  assert.ok(article.includes('class="tp-cta"'));
  const hero = "https://spainwitheva.com/images/articles/madrid-balcony-plaza-mayor.webp";
  const heroAlt = "Гости с Евой на балконе над Пласа Майор в Мадриде";
  assert.equal(metaContent(article, "og:image", "property"), hero);
  assert.equal(metaContent(article, "og:image:alt", "property"), heroAlt);
  assert.ok(article.includes('loading="eager"'));
  assert.ok(/fetchpriority="high"/i.test(article));
  assert.equal(/<img\b[^>]*loading="lazy"/i.test(article), false);
  assert.ok(article.includes("/images/articles/madrid-balcony-plaza-mayor.webp"));
  assert.ok(article.includes(`alt="${heroAlt}"`));
  assert.ok(article.includes("Их сделала семья Руис де Луна"));
  assert.ok(article.includes('href="/poleznoe-dlya-poezdki/"'));
  assert.ok(
    article.includes(
      "Если ещё собираешь поездку и думаешь про интернет в телефоне или страховку",
    ),
  );
  assert.equal(article.includes("holafly"), false);
  assert.equal(article.includes("genki.world"), false);
  assert.equal(article.includes("не для публикации"), false);
  assert.equal(article.includes("SEO-заголовок"), false);

  const graph = jsonLdBlocks(article).find((block) => Array.isArray(block["@graph"]))["@graph"];
  const articleLd = graph.find((node) => node["@type"] === "Article");
  const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");
  assert.equal(articleLd.headline, title);
  assert.equal(articleLd.description, description);
  assert.equal(articleLd.inLanguage, "ru");
  assert.equal(articleLd.author.name, "Eva Sytina");
  assert.equal(articleLd.publisher.name, "SpainWithEva");
  assert.equal(articleLd.image, hero);
  assert.equal(crumbs["@type"], "BreadcrumbList");
  assert.equal(crumbs.itemListElement.length, 3);
  assert.equal(crumbs.itemListElement[1].name, "Статьи");

  assert.ok(index.includes("<h1>Статьи</h1>"));
  assert.ok(index.includes("Что посмотреть в Мадриде за 1–2 дня"));
  assert.ok(index.includes(description));
  assert.ok(index.includes('href="/stati/chto-posmotret-v-madride-za-1-2-dnya/"'));
  assert.ok(index.includes("/images/articles/madrid-balcony-plaza-mayor.webp"));
  assert.ok(index.includes(heroAlt));
  assert.ok(index.includes('loading="lazy"'));
  assert.ok(index.includes("11 ноября 2026"));
  assert.match(index, /<html[^>]*\slang=["']ru["']/i);

  const toledo = await readFile(
    path.join(root, "stati/chto-posmotret-v-toledo-za-den/index.html"),
    "utf8",
  );
  const toledoTitle = "Что посмотреть в Толедо за один день: маршрут гида Евы";
  const toledoDescription =
    "Пеший маршрут по Толедо на один день от гида Евы: с чего начать, где пить кофе и есть без туристических ловушек и что успеть из Мадрида.";
  const toledoCanonical = "https://spainwitheva.com/stati/chto-posmotret-v-toledo-za-den/";
  const toledoHero = "https://spainwitheva.com/images/articles/toledo-alcazar-hill.webp";
  const toledoHeroAlt = "Толедо и Алькасар на холме над рекой Тахо";

  assert.equal(decode(toledo.match(/<title>([^<]*)<\/title>/)[1]), toledoTitle);
  assert.equal(metaContent(toledo, "description", "name"), toledoDescription);
  const toledoCanonicalLink = tags(toledo, "link").filter((item) => item.rel === "canonical");
  assert.equal(toledoCanonicalLink.length, 1);
  assert.equal(toledoCanonicalLink[0].href, toledoCanonical);
  assert.equal(metaContent(toledo, "og:title", "property"), toledoTitle);
  assert.equal(metaContent(toledo, "og:description", "property"), toledoDescription);
  assert.equal(metaContent(toledo, "og:url", "property"), toledoCanonical);
  assert.equal(metaContent(toledo, "og:type", "property"), "article");
  assert.equal(metaContent(toledo, "og:image", "property"), toledoHero);
  assert.equal(metaContent(toledo, "og:image:alt", "property"), toledoHeroAlt);
  assert.match(toledo, /<html[^>]*\slang=["']ru["']/i);
  assert.ok(toledo.includes("<h1>Что посмотреть в Толедо за один день</h1>"));
  assert.ok(toledo.includes('href="/ekskursii/toledo/"'));
  assert.equal(toledo.includes('href="/ekskursii/toledo/" target='), false);
  assert.equal(toledo.includes("[Ссылка:"), false);
  assert.equal(toledo.includes("[Кнопка WhatsApp]"), false);
  assert.equal(toledo.includes("panorama-alkasar"), false);
  assert.ok(toledo.includes("Написать в WhatsApp"));
  assert.ok(toledo.includes('class="tp-cta"'));
  assert.ok(toledo.includes('loading="eager"'));
  assert.ok(/fetchpriority="high"/i.test(toledo));
  assert.equal((toledo.match(/loading="lazy"/g) || []).length, 4);
  for (const [src, alt] of [
    ["/images/articles/toledo-eva-street-cathedral.webp", "Ева на узкой улице у собора в Толедо"],
    ["/images/articles/toledo-eva-narrow-street.webp", "Ева в самом узком переулке Толедо"],
    ["/images/articles/toledo-eva-hat.webp", "Ева в шляпе на берегу Тахо, на заднем плане монастырь"],
    ["/images/articles/toledo-eva-terrace.webp", "Ева на смотровой площадке с видом на колокольню собора"],
  ]) {
    assert.ok(toledo.includes(src), src);
    assert.ok(toledo.includes(`alt="${alt}"`), alt);
    const file = path.join(root, src);
    assert.ok(statSync(file).size < 150 * 1024, `${src} is ${statSync(file).size}`);
  }
  assert.ok(statSync(path.join(root, "/images/articles/toledo-alcazar-hill.webp")).size < 150 * 1024);
  assert.ok(toledo.includes("18 ноября 2026"));
  assert.equal(toledo.includes("\u2014"), false);
  assert.ok(toledo.includes("в узких улицах плохо работает навигатор и связь"));
  assert.ok(toledo.includes('href="/poleznoe-dlya-poezdki/"'));
  assert.ok(
    toledo.includes("Если перед выездом из Мадрида или перед прилётом в Испанию"),
  );
  assert.equal(toledo.includes("holafly"), false);
  assert.equal(toledo.includes("genki.world"), false);

  const toledoGraph = jsonLdBlocks(toledo).find((block) => Array.isArray(block["@graph"]))["@graph"];
  const toledoLd = toledoGraph.find((node) => node["@type"] === "Article");
  const toledoCrumbs = toledoGraph.find((node) => node["@type"] === "BreadcrumbList");
  assert.equal(toledoLd.headline, toledoTitle);
  assert.equal(toledoLd.description, toledoDescription);
  assert.equal(toledoLd.inLanguage, "ru");
  assert.equal(toledoLd.datePublished, "2026-11-18");
  assert.equal(toledoLd.author.name, "Eva Sytina");
  assert.equal(toledoLd.publisher.name, "SpainWithEva");
  assert.equal(toledoLd.image, toledoHero);
  assert.equal(toledoCrumbs.itemListElement.length, 3);
  assert.equal(toledoCrumbs.itemListElement[2].name, "Что посмотреть в Толедо за один день");
  assert.equal(toledoCrumbs.itemListElement[2].item, toledoCanonical);

  assert.ok(index.includes("Что посмотреть в Толедо за один день"));
  assert.ok(index.includes(toledoDescription));
  assert.ok(index.includes('href="/stati/chto-posmotret-v-toledo-za-den/"'));
  assert.ok(index.includes("/images/articles/toledo-alcazar-hill.webp"));
  assert.ok(index.includes(toledoHeroAlt));
  assert.ok(index.includes("18 ноября 2026"));
});

await check("partners page", async () => {
  const html = await readFile(path.join(root, "poleznoe-dlya-poezdki/index.html"), "utf8");
  const title = "Полезное для поездки в Испанию: связь и страховка | SpainWithEva";
  const description =
    "Как в поездке в Испанию решить интернет и медицинскую страховку. Честно и коротко, от Евы.";
  const canonical = "https://spainwitheva.com/poleznoe-dlya-poezdki/";
  const holafly = "https://holafly.sjv.io/c/8159179/3856277/24764?subId1=site";
  const genki = "https://genki.world/with/spainwitheva";

  assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)[1]), title);
  assert.equal(metaContent(html, "description", "name"), description);
  const canonicalLink = tags(html, "link").filter((item) => item.rel === "canonical");
  assert.equal(canonicalLink.length, 1);
  assert.equal(canonicalLink[0].href, canonical);
  assert.equal(metaContent(html, "og:title", "property"), title);
  assert.equal(metaContent(html, "og:description", "property"), description);
  assert.equal(metaContent(html, "og:url", "property"), canonical);
  assert.equal(html.includes("hreflang="), false);
  assert.equal(html.includes("hrefLang="), false);
  assert.match(html, /<html[^>]*\slang=["']ru["']/i);
  assert.ok(html.includes("<h1>Полезное для поездки в Испанию</h1>"));
  assert.ok(html.includes("Главная"));
  assert.ok(description.length <= 160, `description is ${description.length}`);
  assert.equal(
    html.includes(
      "Ссылки на Holafly и Genki на этой странице партнёрские: если ты оформляешь услугу по ним, я могу получить комиссию, на цену для тебя это не влияет.",
    ),
    false,
  );
  assert.equal(html.includes("partner-note"), false);
  assert.ok(html.includes("Промокод SPAINWITHEVA: скидка 5% на eSIM для путешествий."));
  assert.equal(html.includes("Промокод: SPAINWITHEVA"), false);
  assert.equal(html.includes("partner-code"), false);
  assert.ok(html.includes("Карты России и Беларуси Genki не принимает."));
  assert.equal(html.includes("франшиза"), false);
  assert.equal(html.includes("Orange"), false);
  assert.equal(html.includes("роуминг"), false);
  assert.ok(html.includes("скидка 5% на eSIM для путешествий"));
  assert.ok(html.includes("SPAINWITHEVA"));
  assert.equal(html.includes("10%"), false);
  assert.equal(html.includes("Holafly Plans"), false);
  assert.equal(html.includes("несколько раз"), false);
  assert.equal(html.includes("HOLAFLY_TRACKING_LINK"), false);
  assert.ok(html.includes('href="/pravovaya-informaciya/"'));
  assert.equal((html.match(/href="\/poleznoe-dlya-poezdki\/"/g) || []).length, 1);

  function partnerTag(href) {
    const escaped = href.replace(/[?]/g, "\\?");
    const match = html.match(new RegExp(`<a\\b[^>]*href="${escaped}"[^>]*>`, "i"));
    assert.ok(match, href);
    return match[0];
  }
  for (const [href, partner] of [
    [holafly, "holafly"],
    [genki, "genki"],
  ]) {
    const tag = partnerTag(href);
    assert.match(tag, /target="_blank"/);
    assert.match(tag, /rel="sponsored noopener noreferrer"/);
    assert.match(tag, /data-umami-event="partner"/);
    assert.match(tag, new RegExp(`data-umami-event-partner="${partner}"`));
    assert.match(tag, /data-umami-event-place="poleznoe"/);
  }

  const waTags = [...html.matchAll(/<a\b[^>]*href="https:\/\/wa\.me\/34684762085[^"]*"[^>]*>/g)].map(
    (match) => match[0],
  );
  const pageWa = waTags.find((tag) => tag.includes('data-umami-event-place="poleznoe"'));
  assert.ok(pageWa, "missing WhatsApp link on the partners page");
  assert.match(pageWa, /data-umami-event="whatsapp"/);
  assert.equal(pageWa.includes("sponsored"), false);

  const ld = jsonLdBlocks(html);
  const page = ld.find((block) => block["@type"] === "WebPage");
  assert.ok(page, "missing WebPage JSON-LD");
  assert.equal(page.name, title);
  assert.equal(page.description, description);
  assert.equal(page.url, canonical);
  for (const block of ld) {
    walk(block, (node) => {
      const type = node["@type"];
      const types = Array.isArray(type) ? type : type ? [type] : [];
      assert.equal(types.includes("FAQPage"), false);
      assert.equal(types.includes("Product"), false);
      assert.equal(types.includes("Offer"), false);
    });
  }
});

await check("legal affiliate notice", async () => {
  const pages = [
    [
      "pravovaya-informaciya/index.html",
      "Обновлено 25 ноября 2026 года.",
      "21 ноября 2026",
      "4. Партнёрские ссылки",
      "сайты партнёров",
    ],
    [
      "uk/pravova-informatsiia/index.html",
      "Оновлено 25 листопада 2026 року.",
      "21 листопада 2026",
      "4. Партнерські посилання",
      "сайти партнерів",
    ],
    [
      "en/legal/index.html",
      "Last updated: 25 November 2026.",
      "21 November 2026",
      "4. Partner links",
      "partner websites",
    ],
    [
      "es/aviso-legal/index.html",
      "Última actualización: 25 de noviembre de 2026.",
      "21 de noviembre de 2026",
      "4. Enlaces de afiliados",
      "sitios de los colaboradores",
    ],
  ];
  for (const [file, updated, oldDate, heading, cookie] of pages) {
    const html = await readFile(path.join(root, file), "utf8");
    assert.ok(html.includes(updated), `${file} updated`);
    assert.equal(html.includes(oldDate), false, `${file} old date`);
    assert.ok(html.includes(heading), `${file} heading`);
    assert.ok(html.includes(cookie), `${file} cookie note`);
    assert.ok(decode(html).includes('rel="sponsored"'), `${file} rel=sponsored`);
    assert.ok(html.includes("мы можем получить комиссию") || html.includes("ми можемо отримати комісію") || html.includes("we may receive a commission") || html.includes("podemos recibir una comisión"), `${file} commission`);
  }
});

await check(".htaccess", async () => {
  const ht = await readFile(path.join(root, ".htaccess"), "utf8");
  const source = await readFile(path.resolve(root, "..", "public/.htaccess"), "utf8");
  assert.equal(ht, source);
  const wwwRule = ht.indexOf("RewriteCond %{HTTP_HOST} ^www\\.spainwitheva\\.com$ [NC]");
  const cartRule = ht.indexOf("RewriteCond %{QUERY_STRING} (^|&)add-to-cart= [NC]");
  const pass = ht.indexOf("RewriteCond %{REQUEST_FILENAME} -f [OR]");
  assert.ok(wwwRule !== -1 && cartRule !== -1 && wwwRule < pass && cartRule < pass);
  assert.ok(ht.includes("RewriteRule ^(.*)$ https://spainwitheva.com/$1 [R=301,L]"));
  const madridRule = ht.indexOf("RewriteRule ^product/dushevnyj-madrid- /ekskursii/madrid/");
  const toledoRule = ht.indexOf("RewriteRule ^product/toledo-pervaya-stolicza-ispanii- /ekskursii/toledo/");
  const generic = ht.indexOf("RewriteRule ^(product|product-category|shop|category)/ / [R=301,L,NC]");
  assert.ok(pass !== -1 && pass < madridRule && pass < toledoRule);
  assert.ok(madridRule !== -1 && madridRule < generic);
  assert.ok(toledoRule !== -1 && toledoRule < generic);
  assert.ok(ht.includes("RewriteRule ^dushevnyj-madrid-zcbf0v/?$ /ekskursii/madrid/"));
  assert.ok(ht.includes("RewriteRule ^ekskursii-po-madridu-pogruzhenie-v-serdcze-ispanskoj-stoliczy/?$ /ekskursii/madrid/"));
  assert.ok(ht.includes("RewriteRule ^product/aristokratichnyj-madrid/?$ /ekskursii/madrid/"));
  assert.ok(ht.includes("RewriteRule ^toledo-pervaya-stolica-ispanii-zlltdn/?$ /ekskursii/toledo/"));
  const catchAll = ht.split("# 6)")[1];
  assert.equal(catchAll.includes("dushevnyj-madrid-zcbf0v"), false);
  assert.equal(catchAll.includes("ekskursii-po-madridu-pogruzhenie-v-serdcze-ispanskoj-stoliczy"), false);
  assert.equal(catchAll.includes("toledo-pervaya-stolica-ispanii-zlltdn"), false);
});

function assetBytes(html) {
  const files = new Map();
  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const url = decode(match[1]).split("?")[0];
    if (!url.startsWith("/_next/")) continue;
    if (!url.endsWith(".js") && !url.endsWith(".css")) continue;
    const file = path.join(root, url);
    files.set(url, statSync(file).size);
  }
  let js = 0;
  let css = 0;
  for (const [url, size] of files) {
    if (url.endsWith(".css")) css += size;
    else js += size;
  }
  return { js, css };
}

await check("page sizes", async () => {
  const files = [
    "index.html",
    "ekskursii/index.html",
    "ekskursii/madrid/index.html",
    "ekskursii/toledo/index.html",
    "ekskursii/segovia/index.html",
    "stati/index.html",
    "stati/chto-posmotret-v-madride-za-1-2-dnya/index.html",
    "stati/chto-posmotret-v-toledo-za-den/index.html",
    "poleznoe-dlya-poezdki/index.html",
  ];
  const report = {};
  for (const file of files) {
    const full = path.join(root, file);
    const html = await readFile(full);
    const assets = assetBytes(html.toString("utf8"));
    report[file] = {
      html: html.length,
      htmlGzip: gzipSync(html).length,
      js: assets.js,
      css: assets.css,
    };
    assert.ok(html.length < 180000, `${file} HTML is ${html.length}`);
  }
  console.log(JSON.stringify(report, null, 2));
});

await check("no unfinished placeholders", async () => {
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!entry.name.endsWith(".html") && !entry.name.endsWith(".js")) continue;
      const text = await readFile(full, "utf8");
      assert.equal(text.includes("[УТОЧНИТЬ"), false, full);
    }
  }
  await walk(root);
  const home = await readFile(path.join(root, "index.html"), "utf8");
  const catalog = await readFile(path.join(root, "ekskursii/index.html"), "utf8");
  assert.ok(home.includes("/images/tours/cards/izyskannyj-madrid.webp"));
  assert.ok(home.includes("/images/tours/cards/vkusnyj-madrid.webp"));
  assert.ok(home.includes("/images/tours/cards/madrid-v-bokale.webp"));
  assert.ok(home.includes("/images/tours/cards/aristokratichnyj-madrid.webp"));
  assert.ok(home.includes("/images/tours/cards/segovia-aqueduct-plaza.webp"));
  assert.ok(home.includes('alt="Римский акведук на площади в Сеговии"'));
  assert.ok(home.includes("/images/tours/cards/aranjuez-card.webp"));
  assert.ok(home.includes("/images/tours/cards/escorial-card.webp"));
  assert.ok(home.includes('alt="Ева в шляпе перед аркадами Королевского дворца в Аранхуэсе"'));
  assert.ok(home.includes('alt="Ева во дворе монастыря Эскориал, на фоне базилики"'));
  assert.ok(home.includes('width="1200"'));
  assert.ok(home.includes('height="800"'));
  assert.equal(home.includes('class="tour-fallback"'), false);
  assert.ok(home.includes('loading="lazy"'));
  assert.equal(catalog.includes("/images/tours/cards/"), false);
  assert.equal(catalog.includes('class="tour-fallback"'), false);
});

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Static export SEO checks passed for home pages, tour pages, articles, the partners page, legal pages, robots.txt, sitemap.xml and .htaccess.");
