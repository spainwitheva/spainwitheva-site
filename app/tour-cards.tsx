import { GoogleRatingBadge } from "./review-strip";
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
  return <span className="tour-ph">{card.photo.gap}</span>;
}

function CardBody({ card, linked }: { card: TourCardData; linked: boolean }) {
  return (
    <>
      <div className="tour-link-media">
        <CardMedia card={card} />
      </div>
      <div className="tour-link-body">
        <h3>{card.title}</h3>
        <p className="tour-link-why">{card.why}</p>
        <p className="tour-link-meta">{card.meta}</p>
        <p className="tour-link-eva">{evaSurcharge}</p>
        {linked ? <span className="tour-link-more">Подробнее</span> : (
          <a className="button button-primary tour-wa" href={waLink(card.waText)} target="_blank" rel="noopener noreferrer">
            Написать в WhatsApp
          </a>
        )}
      </div>
    </>
  );
}

function TourCard({ card }: { card: TourCardData }) {
  if (card.href) {
    return (
      <a className="tour-link-card" href={card.href}>
        <CardBody card={card} linked />
      </a>
    );
  }
  return (
    <article className="tour-plain-card">
      <CardBody card={card} linked={false} />
    </article>
  );
}

export function TourCardGrid({ groupHeading }: { groupHeading: "h2" | "p" }) {
  const Heading = groupHeading;
  return (
    <div className="tour-groups">
      {cardGroups.map((group) => (
        <div key={group.title}>
          <Heading className="tour-group-title">{group.title}</Heading>
          <div className="tour-link-grid">
            {group.cards.map((card) => (
              <TourCard card={card} key={card.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeTourStrip() {
  return (
    <section className="home-tours" aria-labelledby="home-tours-title">
      <div className="home-tours-head">
        <h2 id="home-tours-title">Экскурсии</h2>
        <GoogleRatingBadge />
        <a href="/ekskursii/">Все экскурсии</a>
      </div>
      <TourCardGrid groupHeading="p" />
      <p className="home-tours-note">{otherCitiesNote}</p>
    </section>
  );
}
