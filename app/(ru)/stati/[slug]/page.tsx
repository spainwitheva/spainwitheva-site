import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "../../../article-body";
import {
  articleJsonLd,
  articleMetadata,
  formatArticleDate,
  getArticle,
  getArticles,
} from "../../../articles";
import { whatsappMessages } from "../../../site-content";
import { TourFooter, TourHeader } from "../../../tour-chrome";
import { waLink } from "../../../tours-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return articleMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const jsonLd = JSON.stringify(articleJsonLd(article)).replace(/</g, "\\u003c");
  const wa = waLink(whatsappMessages.ru);

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader />
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><a href="/">Главная</a></li>
            <li><a href="/stati/">Статьи</a></li>
            <li aria-current="page">{article.title}</li>
          </ol>
        </nav>

        <h1>{article.title}</h1>
        <p className="article-date">
          <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
        </p>

        {article.image ? (
          <figure className="tp-frame tp-hero article-hero">
            <img
              src={article.image.src}
              alt={article.image.alt}
              width={article.image.width}
              height={article.image.height}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ) : null}

        <div className="article-body">
          <ArticleBody markdown={article.body} />
        </div>

        <section className="tp-cta">
          <h2>Написать Еве</h2>
          <p>Дата, сколько вас будет, и что хочется увидеть. Ответим и соберём день.</p>
          <a className="button button-primary" href={wa} target="_blank" rel="noopener noreferrer">
            Написать в WhatsApp
          </a>
        </section>
        <p className="article-back">
          <a href="/stati/">Все статьи</a>
        </p>
      </article>
      <TourFooter />
    </main>
  );
}
