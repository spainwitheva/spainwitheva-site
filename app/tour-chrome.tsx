import { AnalyticsAndConsent } from "./analytics-consent";
import { siteContacts, whatsappMessages } from "./site-content";
import { waLink } from "./tours-data";

const headerWa = waLink(whatsappMessages.ru);

export function TourHeader({ index }: { index?: boolean }) {
  return (
    <header className="site-header">
      <a className="logo" href="/" aria-label="SpainWithEva">
        SpainWithEva
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        <a href="/ekskursii/" aria-current={index ? "page" : undefined}>Экскурсии</a>
        <a href="/#spain">Туры по Испании</a>
        <a href="/#camino">Путь Сантьяго</a>
        <a href="/#services">Отдых под ключ</a>
        <a href="/#about">О нас</a>
      </nav>
      <div className="header-tools">
        <details className="language-switcher">
          <summary aria-label="Выбрать язык сайта">
            <span>RU</span><i aria-hidden="true"></i>
          </summary>
          <nav aria-label="Языковые версии сайта">
            <a href="/" className="language-current" aria-current="page">RU <small>Русский</small></a>
            <a href="/uk">UA <small>Українська</small></a>
            <a href="/en">EN <small>English</small></a>
            <a href="/es">ES <small>Español</small></a>
          </nav>
        </details>
        <a className="header-cta" href={headerWa} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>
      <details className="mobile-menu">
        <summary aria-label="Открыть меню"><span></span><span></span></summary>
        <nav aria-label="Мобильная навигация">
          <a href="/ekskursii/">Экскурсии</a>
          <a href="/#spain">Туры по Испании</a>
          <a href="/#camino">Путь Сантьяго</a>
          <a href="/#services">Отдых под ключ</a>
          <a href="/#about">О нас</a>
          <a href={headerWa} target="_blank" rel="noopener noreferrer">Написать в WhatsApp</a>
        </nav>
      </details>
    </header>
  );
}

export function TourFooter() {
  return (
    <footer>
      <a className="logo footer-logo" href="/">SpainWithEva</a>
      <p>Нескучные экскурсии и путешествия по Испании.</p>
      <div className="footer-links">
        <a href="/ekskursii/">Экскурсии</a>
        <a href="/#spain">Туры</a>
        <a href="/#camino">Путь Сантьяго</a>
        <a href="/#about">О нас</a>
        <a href={siteContacts.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
      <div className="footer-legal">
        <small>© 2026 SpainWithEva · Все права защищены</small>
        <AnalyticsAndConsent locale="ru" />
      </div>
    </footer>
  );
}
