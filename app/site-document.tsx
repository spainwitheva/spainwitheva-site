import type { ReactNode } from "react";
import type { Locale } from "./translations";
import { businessJsonLd } from "./seo";
import "./globals.css";

const consentDefaults = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`;

const tagManagerLoader = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-524KLVGG');
`;

export function SiteDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const jsonLd = JSON.stringify(businessJsonLd()).replace(/</g, "\\u003c");

  return (
    <html lang={locale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
        <script dangerouslySetInnerHTML={{ __html: tagManagerLoader }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-524KLVGG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
