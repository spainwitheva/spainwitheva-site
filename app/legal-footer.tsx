import { AnalyticsAndConsent } from "./analytics-consent";
import { legalLabel, legalPaths } from "./legal-paths";
import { translate, type Locale } from "./translations";

export function LegalFooterNote({ locale }: { locale: Locale }) {
  return (
    <div className="footer-legal">
      <small>{translate(locale, "© 2026 SpainWithEva · Все права защищены")}</small>
      <a href={legalPaths[locale]}>{legalLabel[locale]}</a>
      <AnalyticsAndConsent locale={locale} />
    </div>
  );
}
