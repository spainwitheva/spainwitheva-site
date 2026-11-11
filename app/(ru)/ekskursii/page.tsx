import { MadridCatalogRows, OtherCitiesGroup } from "../../catalog-list";
import { GoogleRatingBadge } from "../../review-strip";
import { TourCardGrid } from "../../tour-cards";
import { TourFooter, TourHeader } from "../../tour-chrome";
import { indexJsonLd, indexMetadata } from "../../tour-seo";
import { evaSurcharge } from "../../tours-data";

export const metadata = indexMetadata();

const openHashedGroup =
  "(()=>{var id=location.hash.slice(1);if(!id)return;var el=document.getElementById(decodeURIComponent(id));if(!el)return;for(var n=el;n;n=n.parentElement){if(n.tagName==='DETAILS')n.open=true;}el.scrollIntoView();})();";

export default function ExcursionsIndex() {
  const jsonLd = JSON.stringify(indexJsonLd()).replace(/</g, "\\u003c");

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader index />
      <article className="tp-catalog">
        <nav className="tp-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><a href="/">Главная</a></li>
            <li aria-current="page">Экскурсии</li>
          </ol>
        </nav>
        <h1>Экскурсии по Мадриду, поездки из Мадрида и по всей Испании с русскоязычным гидом</h1>
        <p className="tp-eva-line">
          Цены за гида команды. {evaSurcharge}. У «Душевного Мадрида» и Толедо есть свои страницы, остальные форматы собираем в переписке.
        </p>
        <GoogleRatingBadge />
        <TourCardGrid
          groupHeading="h2"
          accordion
          firstGroupExtra={<MadridCatalogRows />}
          after={<OtherCitiesGroup />}
        />
      </article>
      <TourFooter />
      <script dangerouslySetInnerHTML={{ __html: openHashedGroup }} />
    </main>
  );
}
