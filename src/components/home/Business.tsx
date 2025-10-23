"use client";

import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";

export default function Business() {
  const { t } = useI18n();
  return (
    <section id="business" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-2xl font-semibold tracking-tight flex items-center justify-center" delay={0}>
          {t("business.title")}
        </Reveal>
        <Reveal as="p" className="text-center mt-2 mb-8 text-sm opacity-80" delay={150}>
          {t("business.subtitle")}
        </Reveal>
        <Reveal className="flex items-center justify-center" delay={300}>
          <a
            href="mailto:community@astrbot.app"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full btn-brand text-sm font-medium hover:opacity-90 transition"
            aria-label={t("business.contact")}
          >
            {/* envelope icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 20.25 19.5H3.75A2.25 2.25 0 0 1 1.5 17.25V6.75Zm2.977-.75a.75.75 0 0 0-.477 1.33l7.5 6a.75.75 0 0 0 .938 0l7.5-6A.75.75 0 0 0 19.773 6H4.477Z" />
            </svg>
            <span>{t("business.contact")}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
