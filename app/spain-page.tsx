"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnalyticsAndConsent } from "./analytics-consent";
import { Locale, translate } from "./translations";
import { faq, formatPrice, journeyTypes, madridCatalogTours, madridTours, siteContacts, siteMedia, spainRegions, spainTours, whatsappMessages } from "./site-content";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function SpainWithEvaPage({
  locale,
  afterHero,
}: {
  locale: Locale;
  afterHero?: ReactNode;
}) {
  const t = (value: string) => translate(locale, value);
  const whatsappUrl = `https://wa.me/${siteContacts.whatsappNumber}?text=${encodeURIComponent(whatsappMessages[locale])}`;
  const [activeRegion, setActiveRegion] = useState("Все регионы");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCompanyVideo, setShowCompanyVideo] = useState(false);
  const spainCarouselRef = useRef<HTMLDivElement>(null);
  const allSpainTours = [
    ...madridTours.map(({ title, duration, text }) => ({ city: "Мадрид", title, duration, text })),
    ...madridCatalogTours,
    ...spainTours,
  ];
  const matchingSpainTours = activeRegion === "Все регионы"
    ? allSpainTours
    : allSpainTours.filter((tour) => tour.city === activeRegion);
  const visibleSpainTours = matchingSpainTours.length > 0
    ? matchingSpainTours
    : [{
        city: activeRegion,
        title: `${t("Авторская экскурсия")}: ${t(activeRegion)}`,
        duration: t("по запросу"),
        text: t("Подберём местного гида и соберём маршрут под ваш ритм, интересы и даты поездки."),
      }];

  const selectRegion = (region: string) => {
    setActiveRegion(region);
    window.requestAnimationFrame(() => {
      spainCarouselRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    });
  };

  const moveSpainCarousel = (direction: number) => {
    spainCarouselRef.current?.scrollBy({ left: direction * 405, behavior: "smooth" });
  };

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > window.innerHeight * 0.8);
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <main lang={locale === "uk" ? "uk" : locale}>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="SpainWithEva">
          SpainWithEva
        </a>
        <nav className="desktop-nav" aria-label={t("Основная навигация")}>
          <a href="#excursions">{t("Экскурсии")}</a>
          <a href="#spain">{t("Туры по Испании")}</a>
          <a href="#camino">{t("Путь Сантьяго")}</a>
          <a href="#services">{t("Отдых под ключ")}</a>
          <a href="#about">{t("О нас")}</a>
        </nav>
        <div className="header-tools">
          <details className="language-switcher">
            <summary aria-label={t("Выбрать язык сайта")}>
              <span>{locale === "uk" ? "UA" : locale.toUpperCase()}</span><i aria-hidden="true"></i>
            </summary>
            <nav aria-label={t("Языковые версии сайта")}>
              <Link href="/" className={locale === "ru" ? "language-current" : ""} aria-current={locale === "ru" ? "page" : undefined}>RU <small>Русский</small></Link>
              <a href="/uk" className={locale === "uk" ? "language-current" : ""} aria-current={locale === "uk" ? "page" : undefined}>UA <small>Українська</small></a>
              <a href="/en" className={locale === "en" ? "language-current" : ""} aria-current={locale === "en" ? "page" : undefined}>EN <small>English</small></a>
              <a href="/es" className={locale === "es" ? "language-current" : ""} aria-current={locale === "es" ? "page" : undefined}>ES <small>Español</small></a>
            </nav>
          </details>
          <a className="header-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
        <details className="mobile-menu">
          <summary aria-label={t("Открыть меню")}><span></span><span></span></summary>
          <nav aria-label={t("Мобильная навигация")}>
            <a href="#excursions">{t("Экскурсии")}</a>
            <a href="#spain">{t("Туры по Испании")}</a>
            <a href="#camino">{t("Путь Сантьяго")}</a>
            <a href="#services">{t("Отдых под ключ")}</a>
            <a href="#about">{t("О нас")}</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">{t("Написать в WhatsApp")}</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{t("Авторские путешествия по Испании")}</p>
          <h1>{t("Испания, в которую хочется возвращаться")}</h1>
          <p className="hero-lead">
            {t("Нескучные экскурсии, авторские туры и путешествия под ключ от Евы Сытиной и команды SpainWithEva.")}
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#journeys">{t("Выбрать путешествие")}</a>
            <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t("Написать в WhatsApp")}
            </a>
          </div>
          <div className="trust-strip" aria-label="SpainWithEva">
            <span>{t("7 лет в Испании")}</span>
            <i aria-hidden="true"></i>
            <span>{t("Маршруты по всей стране")}</span>
            <i aria-hidden="true"></i>
            <span>Русский · Українська · English · Español</span>
          </div>
        </div>
        <div className="hero-visual">
          <img src={siteMedia.heroImage} alt={t("Ева с чемоданом на одной из исторических улиц Мадрида")} />
          <div className="polaroid" aria-hidden="true">
            <span>CALLE DE LA</span>
            <strong>INSPIRACIÓN</strong>
            <small>España, con alma</small>
          </div>
        </div>
      </section>

      {afterHero}

      <section className="section journeys" id="journeys">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">{t("Какой будет ваша Испания?")}</p>
            <h2>{t("Выберите не экскурсию. Выберите впечатление.")}</h2>
          </div>
          <p>{t("Мы не торопим вас по списку достопримечательностей. Подбираем ритм, маршрут и детали так, чтобы путешествие хотелось вспоминать, а не просто отмечать на карте.")}</p>
        </div>
        <div className="journey-grid">
          {journeyTypes.map((item) => (
            <a className="journey-card" href={item.link} key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.text)}</p>
              <span className="text-link">{t("Узнать подробнее")} <Arrow /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="editorial-feature" id="excursions">
        <div className="feature-image">
          <img src={siteMedia.madridImage} alt={t("Ева проводит индивидуальную прогулку по историческому центру Мадрида")} loading="lazy" />
          <span className="image-caption">Madrid · SpainWithEva</span>
        </div>
        <div className="feature-copy">
          <p className="eyebrow">{t("Мадрид для своих")}</p>
          <h2>{t("Город становится ближе, когда его показывает человек")}</h2>
          <p>{t("Королевские тайны и съёмки «Бумажного дома», старые кондитерские, любимые бары мадридцев и красивые ракурсы — история здесь не отделена от жизни.")}</p>
          <a className="text-link dark-link" href={whatsappUrl} target="_blank" rel="noreferrer">
            {t("Подобрать прогулку по Мадриду")} <Arrow />
          </a>
        </div>
      </section>

      <section className="section tour-section">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">{t("Популярные маршруты")}</p>
            <h2>{t("Начните с Мадрида")}</h2>
          </div>
          <p>{t("Стоимость указана за индивидуальную экскурсию. Детали и доступность подтверждаем перед бронированием.")}</p>
        </div>
        <div className="tour-grid">
          {madridTours.map((tour, index) => (
            <article className="tour-card" key={tour.title}>
              <div className="tour-topline">
                <span>{t(tour.tag)}</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{t(tour.title)}</h3>
              <p>{t(tour.text)}</p>
              <div className="tour-meta">
                <span>{t(tour.duration)}</span>
                <strong>{formatPrice(locale, tour.priceKey)}</strong>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Узнать о маршруте ${tour.title}`}>
                {t("Узнать детали")} <Arrow />
              </a>
            </article>
          ))}
        </div>
        <article className="photo-option">
          <div className="photo-option-intro">
            <p className="eyebrow">{t("Дополнить экскурсию")}</p>
            <h3>{t("Фотосессия во время прогулки по Мадриду")}</h3>
            <p>{t("Фотосъёмка проходит прямо во время экскурсии и длится до трёх часов.")}</p>
          </div>
          <div className="photo-option-details">
            <ul>
              <li>{t("Живые фото на фоне самых аутентичных достопримечательностей города.")}</li>
              <li>{t("Не отвлекайтесь на телефон, а наслаждайтесь прогулкой.")}</li>
              <li>{t("50 фотографий в лёгкой цветокоррекции и авторской обработке.")}</li>
              <li>{t("Готовые фотографии в электронном виде в течение пяти дней.")}</li>
            </ul>
            <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noreferrer">
              {t("Добавить фотосъёмку")}
            </a>
          </div>
        </article>
      </section>

      <section className="spain-section" id="spain">
        <div className="spain-inner">
          <p className="eyebrow light-eyebrow">{t("Не один город — целая страна")}</p>
          <h2>{t("У каждого региона свой характер. Мы покажем Испанию, которую невозможно забыть.")}</h2>
          <div className="region-list" aria-label={t("Выберите регион Испании")}>
            {spainRegions.map((region) => (
              <button
                className={activeRegion === region ? "is-active" : ""}
                type="button"
                key={region}
                aria-pressed={activeRegion === region}
                onMouseEnter={() => selectRegion(region)}
                onFocus={() => selectRegion(region)}
                onClick={() => selectRegion(region)}
              >
                {t(region)}
              </button>
            ))}
          </div>
          <div className="spain-tours-heading">
            <h3>{activeRegion === "Все регионы" ? t("Экскурсии по всей Испании") : `${t("Экскурсии")}: ${t(activeRegion)}`}</h3>
            <p>{t("Это лишь часть маршрутов. Если нужного города нет в списке, мы подберём гида и программу под ваш запрос.")}</p>
          </div>
          <div className="spain-carousel-shell">
            <div className="spain-carousel-controls" aria-label="Управление каруселью экскурсий">
              <button type="button" onClick={() => moveSpainCarousel(-1)} aria-label="Предыдущие экскурсии">←</button>
              <button type="button" onClick={() => moveSpainCarousel(1)} aria-label="Следующие экскурсии">→</button>
            </div>
            <div className="spain-tour-grid" ref={spainCarouselRef} aria-live="polite">
            {visibleSpainTours.map((tour, index) => (
              <article className="spain-tour-card" key={tour.title}>
                <div className="spain-tour-topline">
                  <span>{t(tour.city)}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{t(tour.title)}</h3>
                <p>{t(tour.text)}</p>
                <div className="spain-tour-footer">
                  <span>{t(tour.duration)}</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Узнать подробнее об экскурсии «${tour.title}»`}
                  >
                    {t("Узнать подробнее")} <Arrow />
                  </a>
                </div>
              </article>
            ))}
            </div>
          </div>
          <div className="spain-bottom">
            <p>{t("Соберём маршрут на несколько дней, найдём гидов, жильё, транспорт и те самые места, ради которых поездка становится личной историей.")}</p>
            <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">{t("Обсудить будущий тур")}</a>
          </div>
        </div>
      </section>

      <section className="camino-section" id="camino">
        <div className="camino-copy">
          <p className="eyebrow">{t("Путь Сантьяго")}</p>
          <h2>{t("Вы идёте свой Путь. Остальное мы берём на себя.")}</h2>
          <p>{t("Подберём комфортные этапы, забронируем жильё, организуем перевозку багажа и подготовим понятный маршрут. Можно идти самостоятельно или вместе с Евой.")}</p>
          <ul>
            <li>{t("индивидуальный маршрут под вашу форму и сроки;")}</li>
            <li>{t("логистика, бронирования и поддержка;")}</li>
            <li>{t("личное сопровождение по запросу.")}</li>
          </ul>
          <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">{t("Подобрать Путь")}</a>
        </div>
        <div className="camino-image">
          <img src={siteMedia.caminoImage} alt={t("Ева идёт по Пути Сантьяго в Галисии")} loading="lazy" />
          <span className="shell-mark" aria-hidden="true">✺</span>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">{t("Организация отдыха под ключ")}</p>
            <h2>{t("Один контакт вместо десятков открытых вкладок")}</h2>
          </div>
          <p>{t("Вы рассказываете, каким представляете отпуск. Мы превращаем это в маршрут, бронирования и понятный план каждого дня.")}</p>
        </div>
        <div className="service-line">
          <span>{t("Отели")}</span><i></i><span>{t("Трансферы")}</span><i></i><span>{t("Рестораны")}</span>
          <i></i><span>{t("Билеты")}</span><i></i><span>{t("Экскурсии")}</span><i></i><span>{t("Фотосессии")}</span><i></i><span>{t("Поддержка")}</span>
        </div>
        <div className="service-note">
          <strong>{formatPrice(locale, "conciergePerDay", true)}</strong>
          <p>{t("Финальная стоимость зависит от длительности и сложности маршрута.")}</p>
          <a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">{t("Запросить план путешествия")} <Arrow /></a>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-photo">
          <img src={siteMedia.aboutEvaImage} alt={t("Ева — основательница SpainWithEva")} loading="lazy" />
          <span>Eva · SpainWithEva</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow light-eyebrow">¡Super buenos días!</p>
          <h2>{t("Меня зовут Ева. И я хочу показать вам не открытку, а настоящую Испанию.")}</h2>
          <p>{t('Уже семь лет Испания для меня - и дом, и работа, и бесконечный источник вдохновения. Я - гид, блогер, travel-ведущая и основатель "SpainWithEva". Вместе с командой гидов мы проводим нескучные экскурсии и организуем путешествия по всей стране. Всё легко, вкусно и с вниманием к деталям.')}</p>
          <p>{t("Мы умеем говорить об истории без заученных монологов, знаем, где сделать красивый кадр и когда вместо ещё одного музея лучше сесть на террасе с бокалом вина.")}</p>
          <div className="social-links">
            <a href={siteContacts.instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a>
            <a href={siteContacts.youtube} target="_blank" rel="noreferrer">YouTube <Arrow /></a>
            <a href={siteContacts.telegramChannel} target="_blank" rel="noreferrer">Telegram <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="video-story" aria-labelledby="video-story-title">
        <div className="video-story-copy">
          <p className="eyebrow">{t("История SpainWithEva")}</p>
          <h2 id="video-story-title">{t("Как любовь к Испании стала делом моей жизни")}</h2>
          <p>{t("Когда-то всё началось с желания показывать Испанию такой, какой вижу её я: живой, вкусной, эмоциональной и очень настоящей. Сегодня SpainWithEva объединяет команду, маршруты по всей стране и путешествия, после которых остаются не галочки на карте, а воспоминания. В этом видео я рассказываю, как всё начиналось и что стоит за нашим проектом.")}</p>
          <a
            className="text-link"
            href={siteMedia.companyVideoUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("Смотреть историю на YouTube")} <Arrow />
          </a>
        </div>
        <div className="video-story-media">
          {showCompanyVideo ? (
            <iframe
              src={siteMedia.companyVideoEmbedUrl}
              title="SpainWithEva"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              className="video-facade"
              type="button"
              onClick={() => setShowCompanyVideo(true)}
              aria-label={t("Воспроизвести видео о SpainWithEva")}
            >
              <img
                src={siteMedia.videoCover}
                alt="SpainWithEva"
                loading="lazy"
              />
              <span className="video-play" aria-hidden="true"><i></i></span>
              <span className="video-caption">{t("Смотреть историю")}</span>
            </button>
          )}
        </div>
      </section>

      <section className="section principles">
        <p className="eyebrow centered">{t("Почему с нами легко")}</p>
        <h2>{t("Путешествие без туристического конвейера")}</h2>
        <div className="principle-grid">
          <article><span>01</span><h3>{t("Только ваша компания")}</h3><p>{t("Индивидуальный формат, комфортный темп и внимание к тому, что интересно именно вам.")}</p></article>
          <article><span>02</span><h3>{t("Живые истории")}</h3><p>{t("История, современная жизнь, гастрономия и юмор — без сухого перечисления дат.")}</p></article>
          <article><span>03</span><h3>{t("Испания изнутри")}</h3><p>{t("Проверенные места, локальные советы и команда, которая действительно живёт в стране.")}</p></article>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-title">
          <p className="eyebrow">{t("Частые вопросы")}</p>
          <h2>{t("Чтобы всё было понятно ещё до поездки")}</h2>
        </div>
        <div className="faq-list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{t(item.question)}<span aria-hidden="true">+</span></summary>
              <p>{t(item.answer)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="eyebrow light-eyebrow">{t("Начнём с одного сообщения")}</p>
        <h2>{t("Какую Испанию хотите прожить вы?")}</h2>
        <p>{t("Напишите даты, количество путешественников и то, что вам особенно интересно. Мы предложим подходящий формат и всё спокойно обсудим.")}</p>
        <div className="contact-actions">
          <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">{t("Написать в WhatsApp")}</a>
          <a className="button button-ghost" href={siteContacts.telegramContact} target="_blank" rel="noreferrer">{t("Написать в Telegram")}</a>
        </div>
      </section>

      <footer>
        <a className="logo footer-logo" href="#top">SpainWithEva</a>
        <p>{t("Нескучные экскурсии и путешествия по Испании.")}</p>
        <div className="footer-links">
          <a href="#excursions">{t("Экскурсии")}</a>
          <a href="#spain">{t("Туры")}</a>
          <a href="#camino">{t("Путь Сантьяго")}</a>
          <a href="#about">{t("О нас")}</a>
        </div>
        <div className="footer-legal">
          <small>{t("© 2026 SpainWithEva · Все права защищены")}</small>
          <AnalyticsAndConsent locale={locale} />
        </div>
      </footer>

      <button
        className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
        type="button"
        onClick={scrollToTop}
        aria-label={t("Вернуться к началу страницы")}
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <span>{t("Наверх")}</span>
        <b aria-hidden="true">↑</b>
      </button>
    </main>
  );
}
