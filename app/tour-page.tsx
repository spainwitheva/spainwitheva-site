import { ReviewStrip } from "./review-strip";
import { TourFooter, TourHeader } from "./tour-chrome";
import { tourJsonLd } from "./tour-seo";
import {
  bookingTerms,
  cultureNote,
  evaPortrait,
  evaSurcharge,
  paidByGuests,
  priceIncludes,
  privateGroup,
  waLink,
  type TourPageData,
  type TourPhoto,
} from "./tours-data";

function Frame({ photo, eager }: { photo: TourPhoto; eager?: boolean }) {
  if (photo.src) {
    return (
      <figure className={eager ? "tp-frame tp-hero" : "tp-frame"}>
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : undefined}
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
      </figure>
    );
  }
  return (
    <figure className="tp-frame tp-ph">
      <span>{photo.gap}</span>
    </figure>
  );
}

function TextBlock({ texts }: { texts: string[] }) {
  return texts.map((text) => (
    <p key={text} className={text.includes("[УТОЧНИТЬ:") ? "tp-gap" : undefined}>
      {text}
    </p>
  ));
}

export function TourPageView({ tour }: { tour: TourPageData }) {
  const jsonLd = JSON.stringify(tourJsonLd(tour)).replace(/</g, "\\u003c");
  const wa = waLink(tour.waText);

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader />
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><a href="/">Главная</a></li>
            <li><a href="/ekskursii/">Экскурсии</a></li>
            <li aria-current="page">{tour.crumb}</li>
          </ol>
        </nav>

        <h1>{tour.h1}</h1>
        <p className="tp-eva-line">{tour.evaLine}</p>

        <div className="tp-bar">
          <ul className="tp-facts">
            <li><span>Длительность</span><strong>{tour.duration}</strong></li>
            <li><span>Формат</span><strong>{tour.group}</strong></li>
            <li>
              <span>Цена</span>
              <strong>{tour.priceLabel}</strong>
              <small>{evaSurcharge}</small>
            </li>
          </ul>
          <a className="button button-primary" href={wa} target="_blank" rel="noopener noreferrer">
            Написать в WhatsApp
          </a>
        </div>
        <p className="tp-note">{privateGroup}</p>
        <p className="tp-note">{cultureNote}</p>

        <div className="tp-gallery">
          <Frame photo={tour.hero} eager />
          <div className="tp-film">
            {tour.photos.map((photo) => (
              <Frame photo={photo} key={photo.src ?? photo.gap} />
            ))}
          </div>
          {tour.photoNote ? <p className="tp-gap">{tour.photoNote}</p> : null}
        </div>

        <section className="tp-block">
          <h2>Что увидим</h2>
          <ul className="tp-sees">
            {tour.sees.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="tp-block">
          <h2>Как проходит</h2>
          <TextBlock texts={tour.how} />
        </section>

        <section className="tp-block">
          <div className="tp-split">
            <div>
              <h2>Входит</h2>
              <p>{priceIncludes}</p>
            </div>
            <div>
              <h2>Оплачивается отдельно</h2>
              <p>{paidByGuests}</p>
              {tour.separateNote ? <p>{tour.separateNote}</p> : null}
            </div>
          </div>
        </section>

        <section className="tp-block tp-terms">
          <h2>{bookingTerms.title}</h2>
          <p>{bookingTerms.lead}</p>
          <p>{bookingTerms.cancelTitle}</p>
          <ul>
            {bookingTerms.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p>{bookingTerms.reschedule}</p>
          <p>{bookingTerms.ourCancel}</p>
        </section>

        <section className="tp-block tp-eva">
          <h2>Ваш гид Ева</h2>
          <img
            src={evaPortrait.src}
            alt={evaPortrait.alt}
            width={evaPortrait.width}
            height={evaPortrait.height}
            loading="lazy"
            decoding="async"
          />
          <div>
            {tour.evaLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <a href="/#about">Обо мне</a>
          </div>
        </section>

        <ReviewStrip reviews={tour.reviews} />

        <section className="tp-block">
          <h2>Вопросы</h2>
          <div className="faq-list">
            {tour.faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {tour.formats ? (
          <section className="tp-block">
            <h2>Другие форматы по Мадриду</h2>
            <p className="tp-note">Цены за гида команды. {evaSurcharge}.</p>
            <ul className="tp-formats">
              {tour.formats.map((format) => (
                <li key={format.title}>
                  <strong>{format.title}.</strong> {format.text}{" "}
                  <a href={waLink(format.waText)} target="_blank" rel="noopener noreferrer">Написать</a>
                </li>
              ))}
            </ul>
            {tour.extras ? <p className="tp-extras">{tour.extras}</p> : null}
          </section>
        ) : null}

        <section className="tp-cta">
          <h2>Написать Еве</h2>
          <p>Дата, сколько вас будет, и что хочется увидеть. Ответим и соберём день.</p>
          <a className="button button-primary" href={wa} target="_blank" rel="noopener noreferrer">
            Написать в WhatsApp
          </a>
        </section>

        <nav className="tp-block" aria-label="Другие экскурсии">
          <h2>Другие экскурсии</h2>
          <ul className="tp-related">
            {tour.related.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.title}</a>
                <span>{item.meta}</span>
              </li>
            ))}
            <li>
              <a href="/ekskursii/">Все экскурсии</a>
            </li>
          </ul>
        </nav>
      </article>
      <TourFooter />
    </main>
  );
}
