import { GoogleReviewsBlock } from "./review-strip";
import { homeReviews } from "./reviews";
import {
  cardGroups,
  evaSurcharge,
  otherCitiesNote,
  waLink,
  type TourCardData,
} from "./tours-data";

function CardMedia({ card }: { card: TourCardData }) {
  if (card.photo.src) {
    return (
      <img
        src={card.photo.src}
        alt={card.photo.alt}
        width={card.photo.width}
        height={card.photo.height}
        loading="lazy"
        decoding="async"
        style={card.photo.position ? { objectPosition: card.photo.position } : undefined}
      />
    );
  }
  return (
    <span className="tour-fallback">
      <strong>{card.photo.fallback}</strong>
    </span>
  );
}

function TourCard({ card }: { card: TourCardData }) {
  const href = card.href ?? waLink(card.waText);
  const external = !card.href;
  return (
    <article className="tour-link-card">
      <div className="tour-link-media" data-photo-slot={card.id}>
        <CardMedia card={card} />
      </div>
      <div className="tour-link-body">
        <h3>{card.title}</h3>
        <p className="tour-link-why">{card.why}</p>
        <p className="tour-link-meta">{card.meta}</p>
        <a
          className="tour-link-more"
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          Подробнее
        </a>
      </div>
    </article>
  );
}

function GroupBody({ cards }: { cards: TourCardData[] }) {
  return (
    <>
      <p className="tour-group-eva">{evaSurcharge}</p>
      <div className="tour-link-grid">
        {cards.map((card) => (
          <TourCard card={card} key={card.id} />
        ))}
      </div>
    </>
  );
}

export function TourCardGrid({
  groupHeading,
  accordion = false,
}: {
  groupHeading: "h2" | "p";
  accordion?: boolean;
}) {
  const Heading = groupHeading;
  return (
    <div className="tour-groups">
      {cardGroups.map((group, index) => {
        const title = <Heading className="tour-group-title">{group.title}</Heading>;
        if (!accordion) {
          return (
            <div className="tour-group" key={group.title}>
              {title}
              <GroupBody cards={group.cards} />
            </div>
          );
        }
        return (
          <details className="tour-group" key={group.title} open={index === 0 ? true : undefined}>
            <summary>
              <span className="tour-group-title">{group.title}</span>
            </summary>
            <GroupBody cards={group.cards} />
          </details>
        );
      })}
    </div>
  );
}

export function HomeTourStrip() {
  return (
    <section className="home-tours" aria-labelledby="home-tours-title">
      <div className="home-tours-head">
        <h2 id="home-tours-title">Экскурсии</h2>
        <a href="/ekskursii/">Все экскурсии</a>
      </div>
      <TourCardGrid groupHeading="p" accordion />
      <p className="home-tours-note">{otherCitiesNote}</p>
      <GoogleReviewsBlock reviews={homeReviews} headingId="home-reviews-title" className="home-reviews" />
    </section>
  );
}
