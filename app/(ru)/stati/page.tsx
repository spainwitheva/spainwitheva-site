import {
  articlePath,
  articlesIndexJsonLd,
  articlesIndexMetadata,
  articlesIntro,
  formatArticleDate,
  getArticles,
} from "../../articles";
import { TourFooter, TourHeader } from "../../tour-chrome";

export const metadata = articlesIndexMetadata();

export default function ArticlesIndex() {
  const articles = getArticles();
  const jsonLd = JSON.stringify(articlesIndexJsonLd(articles)).replace(/</g, "\\u003c");

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader articles />
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><a href="/">Главная</a></li>
            <li aria-current="page">Статьи</li>
          </ol>
        </nav>
        <h1>Статьи</h1>
        <p className="tp-eva-line">{articlesIntro}</p>
        <div className="article-list">
          {articles.map((article) => (
            <a className="article-card" href={articlePath(article.slug)} key={article.slug}>
              {article.image ? (
                <img
                  src={article.image.src}
                  alt={article.image.alt}
                  width={article.image.width}
                  height={article.image.height}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <span className="article-card-body">
                <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </span>
            </a>
          ))}
        </div>
      </article>
      <TourFooter />
    </main>
  );
}
