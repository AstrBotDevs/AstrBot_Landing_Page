"use client";

import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";

export default function GetStarted() {
  const { t } = useI18n();
  return (
    <section id="get-started" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-2xl font-semibold tracking-tight" delay={0}>
          <span className="flex items-center justify-center gap-2">
            <span>{t("getStarted.title")}</span>
          </span>
        </Reveal>
        <Reveal as="p" className="text-center mt-2 mb-8 text-sm opacity-80" delay={150}>{t("getStarted.subtitle")}</Reveal>
        <Reveal className="flex items-center justify-center" delay={300}>
          <a href="https://docs.astrbot.app/what-is-astrbot.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-11 px-5 rounded-full btn-brand text-sm font-medium hover:opacity-90 transition">{t("getStarted.doc")}</a>
        </Reveal>
      </div>
    </section>
  );
}
