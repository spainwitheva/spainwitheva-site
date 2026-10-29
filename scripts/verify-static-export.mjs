import assert from "node:assert/strict";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  const locs = sitemap.match(/<loc>/g) ?? [];
  assert.equal(locs.length, 4);
});

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Static export SEO checks passed for /, /uk/, /en/, /es/, robots.txt and sitemap.xml.");
