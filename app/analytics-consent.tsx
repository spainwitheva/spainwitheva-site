"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./translations";

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | IArguments>;
    gtag: (...args: unknown[]) => void;
  }
}

type ConsentChoice = "all" | "necessary";

const STORAGE_KEY = "spainwitheva-cookie-consent-v1";
const MEASUREMENT_ID = "G-NDEVRQR9YH";

const copy: Record<Locale, {
  title: string;
  text: string;
  accept: string;
  reject: string;
  settings: string;
}> = {
  ru: {
    title: "Можно немного cookies?",
    text: "Необходимые файлы помогают сайту работать. Аналитические и рекламные включатся только с вашего согласия и помогут нам понять, какие путешествия действительно интересны гостям сайта.",
    accept: "Принять все",
    reject: "Только необходимые",
    settings: "Настройки cookies",
  },
  uk: {
    title: "Можна трохи cookies?",
    text: "Необхідні файли допомагають сайту працювати. Аналітичні та рекламні ввімкнуться лише за вашою згодою і допоможуть нам зрозуміти, які подорожі справді цікаві гостям сайту.",
    accept: "Прийняти всі",
    reject: "Лише необхідні",
    settings: "Налаштування cookies",
  },
  en: {
    title: "May we use a few cookies?",
    text: "Necessary cookies keep the site working. Analytics and advertising cookies will only be enabled with your permission and help us understand which journeys visitors genuinely care about.",
    accept: "Accept all",
    reject: "Necessary only",
    settings: "Cookie settings",
  },
  es: {
    title: "¿Podemos usar algunas cookies?",
    text: "Las cookies necesarias permiten que la web funcione. Las analíticas y publicitarias solo se activarán con tu permiso y nos ayudarán a saber qué viajes interesan de verdad a nuestros visitantes.",
    accept: "Aceptar todas",
    reject: "Solo necesarias",
    settings: "Configurar cookies",
  },
};

function updateGoogleConsent(choice: ConsentChoice) {
  const granted = choice === "all" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: granted,
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
  });
  window.dataLayer?.push({
    event: "cookie_consent_update",
    consent_choice: choice,
  });
}

function sendEvent(eventName: string, parameters: Record<string, unknown>) {
  window.dataLayer?.push({ event: eventName, ...parameters });
  window.gtag?.("event", eventName, {
    ...parameters,
    send_to: MEASUREMENT_ID,
  });
}

export function AnalyticsAndConsent({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const labels = copy[locale];

  useEffect(() => {
    let openTimer: number | undefined;
    try {
      const savedChoice = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
      if (savedChoice === "all" || savedChoice === "necessary") {
        updateGoogleConsent(savedChoice);
      } else {
        openTimer = window.setTimeout(() => setIsOpen(true), 0);
      }
    } catch {
      openTimer = window.setTimeout(() => setIsOpen(true), 0);
    }
    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.href;
      const common = {
        page_language: locale,
        link_text: link.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || "",
        link_url: href,
        page_path: window.location.pathname,
      };

      if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        sendEvent("contact_click", { ...common, contact_method: "whatsapp" });
      } else if (/t\.me\/spainwitheva_admin/i.test(href)) {
        sendEvent("contact_click", { ...common, contact_method: "telegram" });
      } else if (/instagram\.com|youtube\.com|t\.me/i.test(href)) {
        sendEvent("social_click", {
          ...common,
          social_network: /instagram/i.test(href) ? "instagram" : /youtube/i.test(href) ? "youtube" : "telegram",
        });
      } else if (link.closest(".language-switcher")) {
        sendEvent("language_change", {
          ...common,
          selected_language: link.textContent?.trim().slice(0, 2).toLowerCase(),
        });
      } else if (link.matches(".button, .header-cta, .text-link")) {
        sendEvent("cta_click", common);
      }
    };

    document.addEventListener("click", trackClick, true);
    return () => document.removeEventListener("click", trackClick, true);
  }, [locale]);

  const saveChoice = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Consent still applies for the current page if storage is unavailable.
    }
    updateGoogleConsent(choice);
    setIsOpen(false);
  };

  return (
    <>
      <button className="cookie-settings-link" type="button" onClick={() => setIsOpen(true)}>
        {labels.settings}
      </button>

      {isOpen && (
        <section className="cookie-banner" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
          <div className="cookie-copy">
            <h2 id="cookie-title">{labels.title}</h2>
            <p>{labels.text}</p>
          </div>
          <div className="cookie-actions">
            <button className="cookie-button cookie-button-primary" type="button" onClick={() => saveChoice("all")}>
              {labels.accept}
            </button>
            <button className="cookie-button cookie-button-secondary" type="button" onClick={() => saveChoice("necessary")}>
              {labels.reject}
            </button>
          </div>
        </section>
      )}
    </>
  );
}
