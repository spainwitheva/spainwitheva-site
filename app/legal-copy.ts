import type { Metadata } from "next";
import { SITE_ORIGIN } from "./seo";
import { legalPaths } from "./legal-paths";
import type { Locale } from "./translations";

export const legalEmail = "hello.travelwitheva@gmail.com";
const legalPhone = "+1 307 381 9880";

const owner =
  "Travel With Eva LLC";

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: Block[];
};

export type LegalDocument = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  home: string;
  crumbs: string;
  langLabel: string;
  versionsLabel: string;
  sections: LegalSection[];
};

const ogLocale: Record<Locale, string> = {
  ru: "ru_RU",
  uk: "uk_UA",
  en: "en_US",
  es: "es_ES",
};

const documents: Record<Locale, LegalDocument> = {
  ru: {
    metaTitle: "Правовая информация | SpainWithEva",
    metaDescription: "Правовая информация и сведения об обработке персональных данных сайта SpainWithEva.",
    title: "Правовая информация",
    updated: "Обновлено 25 ноября 2026 года.",
    home: "Главная",
    crumbs: "Хлебные крошки",
    langLabel: "Выбрать язык сайта",
    versionsLabel: "Языковые версии сайта",
    sections: [
      {
        heading: "1. Правовые сведения",
        blocks: [
          {
            type: "p",
            text: `Сайт spainwitheva.com принадлежит компании ${owner} (общество с ограниченной ответственностью), зарегистрированной в штате Вайоминг, США.`,
          },
          {
            type: "ul",
            items: [
              "Регистрационный номер Вайоминга: 2026-001974330.",
              "EIN: 98-1938382.",
              "Дата регистрации: 11 мая 2026 года.",
              "Юридический адрес: 30 N Gould St, Ste N, Sheridan, WY 82801, United States.",
              `Телефон: ${legalPhone}.`,
              `Электронная почта: ${legalEmail}.`,
            ],
          },
          {
            type: "p",
            text: "Деятельность: индивидуальное планирование путешествий, культурные туры, экскурсии с гидом, составление маршрутов, координация поездок по Испании и создание материалов о путешествиях. Бренды: SpainWithEva и Travel With Eva.",
          },
          {
            type: "p",
            text: "Сайт рассказывает об этих услугах и позволяет написать нам, чтобы обсудить и заказать поездку.",
          },
          {
            type: "p",
            text: `Тексты, фотографии и видео на сайте принадлежат ${owner}. Их нельзя копировать и использовать без разрешения правообладателя.`,
          },
          {
            type: "p",
            text: "На сайте есть ссылки на сторонние ресурсы. Мы не отвечаем за содержание этих сайтов и за их правила.",
          },
        ],
      },
      {
        heading: "2. Конфиденциальность",
        blocks: [
          {
            type: "p",
            text: `Оператор персональных данных: ${owner}. По вопросам данных пишите на ${legalEmail}.`,
          },
          {
            type: "p",
            text: "Какие данные мы получаем. Только то, что вы сами нам сообщаете в WhatsApp, по электронной почте, в Telegram или в Instagram, чтобы спланировать и заказать экскурсию: имя, контакт, даты, число людей и пожелания.",
          },
          {
            type: "p",
            text: "Зачем. Чтобы ответить вам, спланировать и провести экскурсию, а также выставить счёт.",
          },
          {
            type: "p",
            text: "Основание. Преддоговорные меры и договор, а также юридические обязанности.",
          },
          {
            type: "p",
            text: "Срок хранения. Столько, сколько нужно для бронирования и для исполнения юридических и налоговых обязанностей.",
          },
          {
            type: "p",
            text: "Кому передаём. Мы не продаём данные. Данные получают только те поставщики, без которых услугу не оказать, например WhatsApp/Meta, Google и платёжные сервисы. Возможна передача в США при наличии надлежащих гарантий.",
          },
          {
            type: "p",
            text: `Ваши права. Вы можете запросить доступ, исправление, удаление, возражение, ограничение обработки и переносимость данных по адресу ${legalEmail}. Вы также вправе подать жалобу в Agencia Española de Protección de Datos: aepd.es.`,
          },
        ],
      },
      {
        heading: "3. Файлы cookie и аналитика",
        blocks: [
          {
            type: "p",
            text: "Сайт не использует рекламные и отслеживающие cookie. Мы пользуемся Umami, сервисом аналитики без cookie. Он считает посещения в обобщённом виде, без персональных данных и без cookie. Сервис размещён в ЕС.",
          },
          {
            type: "p",
            text: "Внешние ссылки (WhatsApp, Instagram, Google Maps и сайты партнёров) работают по собственным правилам этих сервисов.",
          },
        ],
      },
      {
        heading: "4. Партнёрские ссылки",
        blocks: [
          {
            type: "p",
            text: "На сайте могут быть партнёрские ссылки на услуги других компаний, например на eSIM и туристическую страховку. Если вы переходите по такой ссылке и оформляете услугу, мы можем получить комиссию. На цену для вас это не влияет. Партнёрские ссылки на страницах отдельно обозначены. Мы не продаём эти услуги сами и не отвечаем за условия, наличие, покрытие и поддержку партнёра. Перед оплатой проверяйте актуальную информацию на его сайте. Партнёрские ссылки открываются с атрибутом rel=\"sponsored\".",
          },
        ],
      },
    ],
  },
  uk: {
    metaTitle: "Правова інформація | SpainWithEva",
    metaDescription: "Правова інформація та відомості про обробку персональних даних сайту SpainWithEva.",
    title: "Правова інформація",
    updated: "Оновлено 25 листопада 2026 року.",
    home: "Головна",
    crumbs: "Навігаційний ланцюжок",
    langLabel: "Обрати мову сайту",
    versionsLabel: "Мовні версії сайту",
    sections: [
      {
        heading: "1. Правові відомості",
        blocks: [
          {
            type: "p",
            text: `Сайт spainwitheva.com належить компанії ${owner} (товариство з обмеженою відповідальністю), зареєстрованій у штаті Вайомінг, США.`,
          },
          {
            type: "ul",
            items: [
              "Реєстраційний номер Вайомінгу: 2026-001974330.",
              "EIN: 98-1938382.",
              "Дата реєстрації: 11 травня 2026 року.",
              "Юридична адреса: 30 N Gould St, Ste N, Sheridan, WY 82801, United States.",
              `Телефон: ${legalPhone}.`,
              `Електронна пошта: ${legalEmail}.`,
            ],
          },
          {
            type: "p",
            text: "Діяльність: індивідуальне планування подорожей, культурні тури, екскурсії з гідом, складання маршрутів, координація поїздок Іспанією та створення матеріалів про подорожі. Бренди: SpainWithEva і Travel With Eva.",
          },
          {
            type: "p",
            text: "Сайт розповідає про ці послуги і дає можливість написати нам, щоб обговорити та замовити поїздку.",
          },
          {
            type: "p",
            text: `Тексти, фотографії та відео на сайті належать ${owner}. Їх не можна копіювати й використовувати без дозволу правовласника.`,
          },
          {
            type: "p",
            text: "На сайті є посилання на сторонні ресурси. Ми не відповідаємо за зміст цих сайтів і за їхні правила.",
          },
        ],
      },
      {
        heading: "2. Конфіденційність",
        blocks: [
          {
            type: "p",
            text: `Оператор персональних даних: ${owner}. З питань даних пишіть на ${legalEmail}.`,
          },
          {
            type: "p",
            text: "Які дані ми отримуємо. Лише те, що ви самі нам повідомляєте у WhatsApp, електронною поштою, у Telegram або в Instagram, щоб спланувати й замовити екскурсію: ім’я, контакт, дати, кількість людей і побажання.",
          },
          {
            type: "p",
            text: "Навіщо. Щоб відповісти вам, спланувати й провести екскурсію, а також виставити рахунок.",
          },
          {
            type: "p",
            text: "Підстава. Переддоговірні заходи і договір, а також юридичні обов’язки.",
          },
          {
            type: "p",
            text: "Строк зберігання. Стільки, скільки потрібно для бронювання і для виконання юридичних і податкових обов’язків.",
          },
          {
            type: "p",
            text: "Кому передаємо. Ми не продаємо дані. Дані отримують лише ті постачальники, без яких послугу не надати, наприклад WhatsApp/Meta, Google і платіжні сервіси. Можлива передача до США за наявності належних гарантій.",
          },
          {
            type: "p",
            text: `Ваші права. Ви можете запитати доступ, виправлення, видалення, заперечення, обмеження обробки і переносимість даних за адресою ${legalEmail}. Ви також маєте право подати скаргу до Agencia Española de Protección de Datos: aepd.es.`,
          },
        ],
      },
      {
        heading: "3. Файли cookie й аналітика",
        blocks: [
          {
            type: "p",
            text: "Сайт не використовує рекламні та відстежувальні cookie. Ми користуємося Umami, сервісом аналітики без cookie. Він рахує відвідування в узагальненому вигляді, без персональних даних і без cookie. Сервіс розміщено в ЄС.",
          },
          {
            type: "p",
            text: "Зовнішні посилання (WhatsApp, Instagram, Google Maps і сайти партнерів) працюють за власними правилами цих сервісів.",
          },
        ],
      },
      {
        heading: "4. Партнерські посилання",
        blocks: [
          {
            type: "p",
            text: "На сайті можуть бути партнерські посилання на послуги інших компаній, наприклад на eSIM і туристичне страхування. Якщо ви переходите за таким посиланням і оформлюєте послугу, ми можемо отримати комісію. На ціну для вас це не впливає. Партнерські посилання на сторінках окремо позначені. Ми самі ці послуги не продаємо і не відповідаємо за умови, наявність, покриття та підтримку партнера. Перед оплатою перевіряйте актуальну інформацію на його сайті. Партнерські посилання відкриваються з атрибутом rel=\"sponsored\".",
          },
        ],
      },
    ],
  },
  en: {
    metaTitle: "Legal notice and privacy | SpainWithEva",
    metaDescription: "Legal notice and privacy information for the SpainWithEva website.",
    title: "Legal notice and privacy",
    updated: "Last updated: 25 November 2026.",
    home: "Home",
    crumbs: "Breadcrumb",
    langLabel: "Choose the site language",
    versionsLabel: "Language versions",
    sections: [
      {
        heading: "1. Legal notice",
        blocks: [
          {
            type: "p",
            text: `The website spainwitheva.com is owned by ${owner} (Limited Liability Company), registered in Wyoming, USA.`,
          },
          {
            type: "ul",
            items: [
              "Wyoming Filing Number: 2026-001974330.",
              "EIN: 98-1938382.",
              "Date of organization: May 11, 2026.",
              "Registered address: 30 N Gould St, Ste N, Sheridan, WY 82801, United States.",
              `Phone: ${legalPhone}.`,
              `Email: ${legalEmail}.`,
            ],
          },
          {
            type: "p",
            text: "Activity: customized travel planning, cultural tours, guided excursions, itinerary design, travel coordination services in Spain, and travel-related content creation. Brands: SpainWithEva and Travel With Eva.",
          },
          {
            type: "p",
            text: "The site presents these services and lets you write to us to discuss and book a trip.",
          },
          {
            type: "p",
            text: `The texts, photos and videos on the site belong to ${owner}. They may not be copied or used without the owner's permission.`,
          },
          {
            type: "p",
            text: "The site contains links to external websites. We are not responsible for the content of those websites or for their policies.",
          },
        ],
      },
      {
        heading: "2. Privacy",
        blocks: [
          {
            type: "p",
            text: `Controller: ${owner}. For data requests, write to ${legalEmail}.`,
          },
          {
            type: "p",
            text: "What data we receive. Only what you send us yourself by WhatsApp, email, Telegram or Instagram in order to plan and book a tour: name, contact details, dates, number of people and wishes.",
          },
          {
            type: "p",
            text: "Purpose. To reply to you, to plan and carry out the tour, and to issue invoices.",
          },
          {
            type: "p",
            text: "Legal basis. Pre-contractual measures and the contract, and legal obligations.",
          },
          {
            type: "p",
            text: "Retention. For as long as needed for the booking and for legal and tax obligations.",
          },
          {
            type: "p",
            text: "Recipients. We do not sell data. Data is shared only with providers needed for the service, for example WhatsApp/Meta, Google and payment providers. International transfers to the USA may take place with appropriate safeguards.",
          },
          {
            type: "p",
            text: `Your rights. You may request access, rectification, erasure, objection, restriction and portability by writing to ${legalEmail}. You may also lodge a complaint with the Agencia Española de Protección de Datos at aepd.es.`,
          },
        ],
      },
      {
        heading: "3. Cookies and analytics",
        blocks: [
          {
            type: "p",
            text: "The site does not use advertising or tracking cookies. We use Umami, a cookieless analytics service. It counts visits in aggregate, without personal data and without cookies. It is hosted in the EU.",
          },
          {
            type: "p",
            text: "External links (WhatsApp, Instagram, Google Maps and partner websites) follow the policies of those services.",
          },
        ],
      },
      {
        heading: "4. Partner links",
        blocks: [
          {
            type: "p",
            text: "The site may contain partner links to services from other companies, for example a travel eSIM and travel insurance. If you follow such a link and purchase the service, we may receive a commission. This does not change the price you pay. Partner links are marked separately on the page. We do not sell these services ourselves and we are not responsible for the partner's terms, availability, coverage or support. Before you pay, check the current information on the partner's website. Partner links open with the rel=\"sponsored\" attribute.",
          },
        ],
      },
    ],
  },
  es: {
    metaTitle: "Aviso legal y privacidad | SpainWithEva",
    metaDescription: "Aviso legal y política de privacidad del sitio SpainWithEva.",
    title: "Aviso legal y privacidad",
    updated: "Última actualización: 25 de noviembre de 2026.",
    home: "Inicio",
    crumbs: "Ruta de navegación",
    langLabel: "Elegir el idioma del sitio",
    versionsLabel: "Versiones lingüísticas",
    sections: [
      {
        heading: "1. Aviso legal",
        blocks: [
          {
            type: "p",
            text: `El sitio spainwitheva.com es titularidad de ${owner} (Limited Liability Company, sociedad de responsabilidad limitada), constituida en el Estado de Wyoming, Estados Unidos.`,
          },
          {
            type: "ul",
            items: [
              "Número de registro de Wyoming (Wyoming Filing Number): 2026-001974330.",
              "EIN: 98-1938382.",
              "Fecha de constitución: 11 de mayo de 2026.",
              "Domicilio social: 30 N Gould St, Ste N, Sheridan, WY 82801, United States.",
              `Teléfono: ${legalPhone}.`,
              `Correo electrónico: ${legalEmail}.`,
            ],
          },
          {
            type: "p",
            text: "Actividad: planificación de viajes a medida, tours culturales, excursiones guiadas, diseño de itinerarios, servicios de coordinación de viajes en España y creación de contenidos relacionados con los viajes. Marcas: SpainWithEva y Travel With Eva.",
          },
          {
            type: "p",
            text: "El sitio informa sobre estos servicios y permite escribirnos para consultar y contratar un viaje.",
          },
          {
            type: "p",
            text: `Los textos, las fotografías y los vídeos del sitio son propiedad de ${owner}. Queda prohibida su reproducción y su uso sin autorización del titular.`,
          },
          {
            type: "p",
            text: "El sitio incluye enlaces a páginas de terceros. No nos responsabilizamos del contenido de esos sitios ni de sus políticas.",
          },
        ],
      },
      {
        heading: "2. Privacidad",
        blocks: [
          {
            type: "p",
            text: `Responsable del tratamiento: ${owner}. Para cualquier cuestión sobre datos personales: ${legalEmail}.`,
          },
          {
            type: "p",
            text: "Datos que tratamos. Únicamente los que usted nos facilita por WhatsApp, correo electrónico, Telegram o Instagram para planificar y reservar una excursión: nombre, contacto, fechas, número de personas y preferencias.",
          },
          {
            type: "p",
            text: "Finalidad. Responderle, planificar y realizar la excursión, y emitir la factura.",
          },
          {
            type: "p",
            text: "Base jurídica. Medidas precontractuales y ejecución del contrato, así como el cumplimiento de obligaciones legales.",
          },
          {
            type: "p",
            text: "Conservación. Durante el tiempo necesario para la reserva y para el cumplimiento de las obligaciones legales y fiscales.",
          },
          {
            type: "p",
            text: "Destinatarios. No vendemos los datos personales. Solo acceden a ellos los prestadores necesarios para el servicio, por ejemplo WhatsApp/Meta, Google y los proveedores de pago. Pueden producirse transferencias internacionales a Estados Unidos con las garantías adecuadas.",
          },
          {
            type: "p",
            text: `Derechos. Puede solicitar el acceso, la rectificación, la supresión, la oposición, la limitación del tratamiento y la portabilidad escribiendo a ${legalEmail}. También puede presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).`,
          },
        ],
      },
      {
        heading: "3. Cookies y analítica",
        blocks: [
          {
            type: "p",
            text: "El sitio no utiliza cookies publicitarias ni de seguimiento. Utilizamos Umami, un servicio de analítica sin cookies. Cuenta las visitas de forma agregada, sin datos personales y sin cookies. El servicio está alojado en la Unión Europea.",
          },
          {
            type: "p",
            text: "Los enlaces externos (WhatsApp, Instagram, Google Maps y los sitios de los colaboradores) se rigen por las políticas propias de esos servicios.",
          },
        ],
      },
      {
        heading: "4. Enlaces de afiliados",
        blocks: [
          {
            type: "p",
            text: "El sitio puede incluir enlaces de afiliados a servicios de otras empresas, por ejemplo una eSIM de viaje y un seguro de viaje. Si usted accede por uno de esos enlaces y contrata el servicio, podemos recibir una comisión. El precio para usted no cambia. Los enlaces de afiliados aparecen señalados en la página. No vendemos estos servicios nosotros y no respondemos de las condiciones, la disponibilidad, la cobertura ni la atención del colaborador. Antes de pagar, compruebe la información actual en el sitio del colaborador. Los enlaces de afiliados se abren con el atributo rel=\"sponsored\".",
          },
        ],
      },
    ],
  },
};

export function legalDocument(locale: Locale) {
  return documents[locale];
}

export function legalPageUrl(locale: Locale) {
  return `${SITE_ORIGIN}${legalPaths[locale]}`;
}

export function legalMetadata(locale: Locale): Metadata {
  const copy = documents[locale];
  const url = legalPageUrl(locale);
  const languages = {
    ru: legalPageUrl("ru"),
    uk: legalPageUrl("uk"),
    en: legalPageUrl("en"),
    es: legalPageUrl("es"),
    "x-default": legalPageUrl("ru"),
  };

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: copy.metaTitle,
    description: copy.metaDescription,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: "SpainWithEva",
      title: copy.metaTitle,
      description: copy.metaDescription,
      url,
      locale: ogLocale[locale],
    },
  };
}
