import {
  madridCatalogAdditions,
  OTHER_CITIES_ID,
  otherCitySections,
  type CatalogListItem,
} from "./catalog-index";
import { waLink } from "./tours-data";

function inquiry(title: string) {
  return `Здравствуйте! Интересует экскурсия: ${title}`;
}

function meta(item: CatalogListItem) {
  if (item.madrid) return item.duration;
  return `${item.duration} · Цена по запросу`;
}

export function CatalogRows({ items }: { items: CatalogListItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="catalog-rows">
      {items.map((item) => (
        <li className="catalog-row" id={item.id} key={item.id}>
          <div className="catalog-copy">
            <p className="catalog-name">{item.title}</p>
            <p className="catalog-text">{item.text}</p>
            <p className="catalog-meta">{meta(item)}</p>
          </div>
          <a
            className="catalog-wa"
            href={waLink(inquiry(item.title))}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </li>
      ))}
    </ul>
  );
}

export function MadridCatalogRows() {
  return <CatalogRows items={madridCatalogAdditions} />;
}

export function OtherCitiesGroup() {
  return (
    <details className="tour-group" id={OTHER_CITIES_ID}>
      <summary>
        <h2 className="tour-group-title">Другие города Испании</h2>
      </summary>
      {otherCitySections.map((section) => (
        <section key={section.city}>
          <h3 className="catalog-city">{section.city}</h3>
          <CatalogRows items={section.items} />
        </section>
      ))}
    </details>
  );
}
