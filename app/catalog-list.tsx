import { cityChips, madridCatalogAdditions, OTHER_CITIES_ID } from "./catalog-index";
import { cardGroups, waLink, type TourCardData } from "./tours-data";

function inquiry(title: string) {
  return `Здравствуйте! Интересует экскурсия: ${title}`;
}

const museumsWa = inquiry("музеи и стадион Мадрида");

function SlimRows({ cards }: { cards: TourCardData[] }) {
  return (
    <ul className="slim-rows">
      {cards.map((card) => {
        const href = card.href ?? waLink(card.waText);
        const external = !card.href;
        return (
          <li key={card.id}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="slim-name">{card.title}</span>
              <span className="slim-meta">{card.meta}</span>
              <span className="slim-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function MuseumsLine() {
  return (
    <div className="museum-block">
      <div className="museum-head">
        <p>Музеи и стадион</p>
        <a href={waLink(museumsWa)} target="_blank" rel="noopener noreferrer">
          WhatsApp <span aria-hidden="true">↗</span>
        </a>
      </div>
      <ul className="museum-names">
        {madridCatalogAdditions.map((item) => (
          <li id={item.id} key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

function OtherCities() {
  return (
    <details className="tour-group" id={OTHER_CITIES_ID}>
      <summary>
        <h2 className="tour-group-title">Другие города Испании</h2>
      </summary>
      <div className="city-board">
        <div className="chip-row">
          {cityChips.map((chip) => (
            <label className="chip" key={chip.id}>
              <input type="radio" name="spain-city" value={chip.id} />
              {chip.label}
            </label>
          ))}
        </div>
        {cityChips.map((chip) => (
          <div className="city-panel" data-city={chip.id} key={chip.id}>
            <p className="city-note">цена по запросу</p>
            <ul className="city-names">
              {chip.items.map((item) => (
                <li id={item.id} key={item.id}>
                  <a href={waLink(inquiry(item.title))} target="_blank" rel="noopener noreferrer">
                    <span>{item.title}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

export function ExcursionCatalog() {
  return (
    <div className="tour-groups catalog-groups">
      {cardGroups.map((group, index) => (
        <details className="tour-group" key={group.title} open={index === 0 ? true : undefined}>
          <summary>
            <h2 className="tour-group-title">{group.title}</h2>
          </summary>
          <SlimRows cards={group.cards} />
          {index === 0 ? <MuseumsLine /> : null}
        </details>
      ))}
      <OtherCities />
    </div>
  );
}
