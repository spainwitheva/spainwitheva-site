import type { ReactNode } from "react";
import { legalDocument, legalEmail } from "./legal-copy";
import { LegalFooterNote } from "./legal-footer";
import { legalPaths } from "./legal-paths";
import { localePaths } from "./seo";
import { whatsappMessages } from "./site-content";
import { waLink } from "./tours-data";
import { umamiWhatsapp } from "./umami";
import { translate, type Locale } from "./translations";

const phoneHref = "tel:+13073819880";
const linkTokens = [
  { text: legalEmail, href: `mailto:${legalEmail}` },
  { text: "+1 307 381 9880", href: phoneHref },
  { text: "aepd.es", href: "https://www.aepd.es/" },
];

function linkedText(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let index = 0;
  while (rest.length > 0) {
    let foundAt = -1;
    let found: (typeof linkTokens)[number] | undefined;
    for (const token of linkTokens) {
      const at = rest.indexOf(token.text);
      if (at !== -1 && (foundAt === -1 || at < foundAt)) {
        foundAt = at;
        found = token;
      }
    }
    if (!found || foundAt === -1) {
      nodes.push(rest);
      break;
    }
    if (foundAt > 0) nodes.push(rest.slice(0, foundAt));
    const external = found.href.startsWith("http");
    nodes.push(
      <a
        key={`${keyPrefix}-${index}`}
        href={found.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {found.text}
      </a>,
    );
    rest = rest.slice(foundAt + found.text.length);
    index += 1;
  }
  return nodes;
}

const languageOrder: Locale[] = ["ru", "uk", "en", "es"];
const languageCode: Record<Locale, string> = { ru: "RU", uk: "UA", en: "EN", es: "ES" };
const languageName: Record<Locale, string> = {
  ru: "Русский",
  uk: "Українська",
  en: "English",
  es: "Español",
};

export function LegalPage({ locale }: { locale: Locale }) {
  const copy = legalDocument(locale);
  const home = localePaths[locale];
  const wa = waLink(whatsappMessages[locale]);

  return (
    <main className="tp" lang={locale}>
      <header className="site-header legal-header">
        <a className="logo" href={home} aria-label="SpainWithEva">
          SpainWithEva
        </a>
        <div className="header-tools">
          <details className="language-switcher">
            <summary aria-label={copy.langLabel}>
              <span>{languageCode[locale]}</span><i aria-hidden="true"></i>
            </summary>
            <nav aria-label={copy.versionsLabel}>
              {languageOrder.map((item) => (
                <a
                  key={item}
                  href={legalPaths[item]}
                  className={item === locale ? "language-current" : undefined}
                  aria-current={item === locale ? "page" : undefined}
                  hrefLang={item}
                >
                  {languageCode[item]} <small>{languageName[item]}</small>
                </a>
              ))}
            </nav>
          </details>
          <a className="header-cta" href={wa} target="_blank" rel="noopener noreferrer" {...umamiWhatsapp("sticky")}>
            WhatsApp
          </a>
        </div>
      </header>
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label={copy.crumbs}>
          <ol>
            <li><a href={home}>{copy.home}</a></li>
            <li aria-current="page">{copy.title}</li>
          </ol>
        </nav>
        <h1>{copy.title}</h1>
        <p className="article-date">{copy.updated}</p>
        <div className="article-body">
          {copy.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.blocks.map((block, index) => {
                const key = `${section.heading}-${index}`;
                if (block.type === "ul") {
                  return (
                    <ul key={key}>
                      {block.items.map((item) => (
                        <li key={item}>{linkedText(item, key)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={key}>{linkedText(block.text, key)}</p>;
              })}
            </section>
          ))}
        </div>
      </article>
      <footer>
        <a className="logo footer-logo" href={home}>SpainWithEva</a>
        <p>{translate(locale, "Нескучные экскурсии и путешествия по Испании.")}</p>
        <LegalFooterNote locale={locale} />
      </footer>
    </main>
  );
}
