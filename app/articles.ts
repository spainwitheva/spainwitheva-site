import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { SITE_ORIGIN } from "./seo";

/**
 * Одна статья = один файл в content/stati.
 * Адрес страницы берётся из имени файла: content/stati/<slug>.md → /stati/<slug>/.
 */

export type ArticleImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Article = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  image?: ArticleImage;
  body: string;
};

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const ICONS = {
  icon: "/favicon.png",
  shortcut: "/favicon.png",
} as const;

const INDEX_TITLE = "Статьи | SpainWithEva";
const INDEX_DESCRIPTION =
  "Я Ева. Здесь пишу о Мадриде так, как рассказываю гостям до прогулки: куда идти пешком, где поесть и что спокойно оставить на другой день.";

export function articlePath(slug: string) {
  return `/stati/${slug}/`;
}

export function formatArticleDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return iso;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

function parseFrontmatter(raw: string, fileName: string) {
  if (!raw.startsWith("---\n")) {
    throw new Error(`${fileName}: expected frontmatter`);
  }
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${fileName}: frontmatter is not closed`);
  const data: Record<string, string> = {};
  for (const line of raw.slice(4, end).split("\n")) {
    if (!line.trim()) continue;
    const splitAt = line.indexOf(":");
    if (splitAt === -1) throw new Error(`${fileName}: bad frontmatter line`);
    const key = line.slice(0, splitAt).trim();
    let value = line.slice(splitAt + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: raw.slice(end + "\n---\n".length).trim() };
}

function field(data: Record<string, string>, key: string, fileName: string) {
  const value = data[key];
  if (!value) throw new Error(`${fileName}: missing ${key}`);
  return value;
}

function parseArticle(fileName: string, raw: string): Article {
  const slug = fileName.replace(/\.md$/, "");
  const { data, body } = parseFrontmatter(raw, fileName);
  const heading = /^# (.+)$/m.exec(body);
  if (!heading) throw new Error(`${fileName}: missing an h1`);
  const title = heading[1].trim();
  const rest = body.slice(heading.index + heading[0].length).replace(/^\n+/, "");
  const date = field(data, "date", fileName);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${fileName}: date must be YYYY-MM-DD`);
  }
  let image: ArticleImage | undefined;
  if (data.image) {
    const width = Number(field(data, "imageWidth", fileName));
    const height = Number(field(data, "imageHeight", fileName));
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new Error(`${fileName}: image dimensions must be numbers`);
    }
    image = {
      src: data.image,
      alt: field(data, "imageAlt", fileName),
      width,
      height,
    };
  }
  return {
    slug,
    title,
    seoTitle: field(data, "seoTitle", fileName),
    description: field(data, "description", fileName),
    date,
    image,
    body: rest,
  };
}

let cached: Article[] | undefined;

export function getArticles(): Article[] {
  if (cached) return cached;
  const dir = path.join(process.cwd(), "content", "stati");
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort();
  cached = files
    .map((name) => parseArticle(name, readFileSync(path.join(dir, name), "utf8")))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug, "ru")));
  return cached;
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function articlesIndexMetadata(): Metadata {
  const url = `${SITE_ORIGIN}/stati/`;
  const image = `${SITE_ORIGIN}/images/hero-eva-madrid.webp`;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title: INDEX_TITLE,
      description: INDEX_DESCRIPTION,
      url,
      locale: "ru_RU",
      images: [{ url: image, alt: "Ева на исторической улице Мадрида" }],
    },
    twitter: {
      card: "summary_large_image",
      title: INDEX_TITLE,
      description: INDEX_DESCRIPTION,
      images: [image],
    },
    other: { "twitter:url": url },
    icons: ICONS,
  };
}

export function articleMetadata(article: Article): Metadata {
  const url = `${SITE_ORIGIN}${articlePath(article.slug)}`;
  const images = article.image
    ? [{ url: `${SITE_ORIGIN}${article.image.src}`, alt: article.image.alt }]
    : undefined;

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "SpainWithEva",
      title: article.seoTitle,
      description: article.description,
      url,
      locale: "ru_RU",
      publishedTime: article.date,
      authors: ["Eva Sytina"],
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: article.seoTitle,
      description: article.description,
      images: images?.map((image) => image.url),
    },
    other: { "twitter:url": url },
    icons: ICONS,
  };
}

export function articlesIndexJsonLd(articles: Article[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Статьи",
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.title,
          url: `${SITE_ORIGIN}${articlePath(article.slug)}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Статьи", item: `${SITE_ORIGIN}/stati/` },
        ],
      },
    ],
  };
}

export function articleJsonLd(article: Article) {
  const url = `${SITE_ORIGIN}${articlePath(article.slug)}`;
  const node: Record<string, unknown> = {
    "@type": "Article",
    headline: article.seoTitle,
    description: article.description,
    inLanguage: "ru",
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Person", name: "Eva Sytina" },
    publisher: {
      "@type": "Organization",
      name: "SpainWithEva",
      url: `${SITE_ORIGIN}/`,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
  if (article.image) node.image = `${SITE_ORIGIN}${article.image.src}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      node,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Статьи", item: `${SITE_ORIGIN}/stati/` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}

export const articlesIntro = INDEX_DESCRIPTION;
