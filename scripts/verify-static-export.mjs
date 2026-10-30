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
  assert.equal(blocks.length, 7);
  const tourLocs = [
    "https://spainwitheva.com/ekskursii/",
    "https://spainwitheva.com/ekskursii/madrid/",
    "https://spainwitheva.com/ekskursii/toledo/",
  ];
  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (tourLocs.includes(loc)) {
      assert.equal(block.includes("hreflang"), false, `${loc} must not have hreflang`);
    }
  }
  for (const url of tourLocs) {
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
    assert.ok(html.includes("[УТОЧНИТЬ: место встречи]"));
    assert.ok(html.includes("лично с Евой +50 €"));
    assert.ok(html.includes("Предоплата (сумма по договорённости) входит в стоимость экскурсии"));
    assert.ok(html.includes("за 14 дней и ранее: полный возврат;"));
    assert.ok(html.includes("за 7–13 дней: возврат 50% предоплаты;"));
    assert.ok(html.includes("менее чем за 7 дней: предоплата не возвращается."));
    assert.ok(html.includes("Можно ли отменить или перенести?"));
    assert.ok(html.includes("5,0 ★ · 40 отзывов в Google"));
    assert.ok(html.includes("Гугл Карты"));
    assert.ok(html.includes(mapsUrl));
    assert.equal(html.includes("Tripster"), false);
    assert.equal(html.includes("Трипстер"), false);
    assert.equal(html.includes("PayPal"), false);
    assert.equal(html.includes("грузинский"), false);
    assert.equal(html.includes("если речь идёт именно о нём"), false);
    assert.equal(html.includes("—"), false);
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

  assert.ok(madrid.includes('что придет особый шарм прогулке'));
  assert.ok(madrid.includes("Мы выбрали маршрут « Душевный Мадрид» и нисколько не пожалели , наоборот - даже дети были в восторге"));
  assert.ok(madrid.includes("Elena Shi"));
  assert.ok(toledo.includes("Мадрид,Толедо с Евой!!!"));
  assert.ok(toledo.includes("фактов,историй"));
  assert.ok(toledo.includes("это не просто экскурсия , это душевная прогулка"));
  assert.ok(toledo.includes("Jeyla Huseynova"));
  assert.ok(toledo.includes("Александр Барабан"));
  assert.equal(madrid.includes("Мадрид,Толедо с Евой!!!"), false);

  assert.ok(home.includes('href="/ekskursii/madrid/"'));
  assert.ok(home.includes('href="/ekskursii/toledo/"'));
  assert.ok(home.includes("Сеговия"));
  assert.ok(home.includes("Аранхуэс"));
  assert.ok(home.includes("Эскориал и Долина Павших"));
  assert.ok(home.includes("Работаем и в других городах Испании."));
  assert.ok(home.includes("5,0 ★ · 40 отзывов в Google"));
  assert.ok(home.includes(mapsUrl));
  assert.equal(english.includes("/ekskursii/madrid/"), false);
  assert.equal(english.includes("/ekskursii/toledo/"), false);

  assert.ok(index.includes('href="/ekskursii/madrid/"'));
  assert.ok(index.includes('href="/ekskursii/toledo/"'));
  assert.equal(index.includes("hreflang="), false);
});

await check(".htaccess", async () => {
  const ht = await readFile(path.join(root, ".htaccess"), "utf8");
  const source = await readFile(path.resolve(root, "..", "public/.htaccess"), "utf8");
  assert.equal(ht, source);
  const pass = ht.indexOf("RewriteCond %{REQUEST_FILENAME} -f [OR]");
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

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Static export SEO checks passed for home pages, tour pages, robots.txt, sitemap.xml and .htaccess.");
