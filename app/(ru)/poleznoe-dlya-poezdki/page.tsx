import { legalPaths } from "../../legal-paths";
import {
  GENKI_URL,
  HOLAFLY_URL,
  PARTNERS_H1,
  partnerBlocks,
  partnersJsonLd,
  partnersMetadata,
  partnersUi,
  type PartnerBlock,
} from "../../partners-copy";
import { whatsappMessages } from "../../site-content";
import { TourFooter, TourHeader } from "../../tour-chrome";
import { waLink } from "../../tours-data";
import { umamiPartner, umamiWhatsapp } from "../../umami";

export const metadata = partnersMetadata();

function renderBlock(block: PartnerBlock, index: number, wa: string) {
  switch (block.type) {
    case "h2":
      return <h2 key={index}>{block.text}</h2>;
    case "p":
      return <p key={index}>{block.text}</p>;
    case "ul":
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "holafly":
      return (
        <div className="partner-actions" key={index}>
          <a
            className="button button-primary"
            href={HOLAFLY_URL}
            target="_blank"
            rel="sponsored noopener noreferrer"
            {...umamiPartner("holafly", "poleznoe")}
          >
            {partnersUi.holaflyCta}
          </a>
        </div>
      );
    case "genki":
      return (
        <div className="partner-actions" key={index}>
          <a
            className="button button-primary"
            href={GENKI_URL}
            target="_blank"
            rel="sponsored noopener noreferrer"
            {...umamiPartner("genki", "poleznoe")}
          >
            {partnersUi.genkiCta}
          </a>
        </div>
      );
    case "whatsapp":
      return (
        <div className="partner-actions" key={index}>
          <a
            className="button button-primary"
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            {...umamiWhatsapp("poleznoe")}
          >
            {partnersUi.whatsappCta}
          </a>
        </div>
      );
    case "legal":
      return (
        <p key={index}>
          {partnersUi.legalBefore}
          <a href={legalPaths.ru}>{partnersUi.legalLink}</a>
          {partnersUi.legalAfter}
        </p>
      );
  }
}

export default function PartnersPage() {
  const jsonLd = JSON.stringify(partnersJsonLd()).replace(/</g, "\\u003c");
  const wa = waLink(whatsappMessages.ru);

  return (
    <main className="tp" id="top" lang="ru">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <TourHeader />
      <article className="tp-wrap">
        <nav className="tp-crumbs" aria-label={partnersUi.crumbs}>
          <ol>
            <li>
              <a href="/">{partnersUi.home}</a>
            </li>
            <li aria-current="page">{PARTNERS_H1}</li>
          </ol>
        </nav>
        <h1>{PARTNERS_H1}</h1>
        <div className="article-body">
          {partnerBlocks.map((block, index) => renderBlock(block, index, wa))}
        </div>
      </article>
      <TourFooter />
    </main>
  );
}
