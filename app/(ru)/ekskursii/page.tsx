import { GoogleRatingBadge } from "../../review-strip";
import { TourCardGrid } from "../../tour-cards";
import { TourFooter, TourHeader } from "../../tour-chrome";
import { indexJsonLd, indexMetadata } from "../../tour-seo";
import { evaSurcharge, otherCitiesNote } from "../../tours-data";

export const metadata = indexMetadata();

export default function ExcursionsIndex() {
  const jsonLd = JSON.stringify(indexJsonLd()).replace(/</g, "\\u003c");

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader index />
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><a href="/">Главная</a></li>
            <li aria-current="page">Экскурсии</li>
          </ol>
        </nav>
        <h1>Экскурсии по Мадриду и поездки из Мадрида с русскоязычным гидом</h1>
        <p className="tp-eva-line">
          Цены за гида команды. {evaSurcharge}. У «Душевного Мадрида» и Толедо есть свои страницы, остальные форматы собираем в переписке.
        </p>
        <GoogleRatingBadge />
        <TourCardGrid groupHeading="h2" />
        <p className="home-tours-note">{otherCitiesNote}</p>
      </article>
      <TourFooter />
    </main>
  );
}
