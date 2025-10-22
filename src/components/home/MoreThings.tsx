"use client";

import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";

export default function MoreThings() {
  const { t } = useI18n();
  const items: Array<{ label: string; desc: string; icon: React.ReactNode }> = [
    {
      label: t("more.kbLabel"),
      desc: t("more.kbDesc"),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 6.253v13" />
          <path d="M12 6.253C10.832 5.5 9.5 5 8 5c-1.5 0-2.832.5-4 1.253v13C5.168 18.5 6.5 18 8 18c1.5 0 2.832.5 4 1.253" />
          <path d="M12 6.253C13.168 5.5 14.5 5 16 5c1.5 0 2.832.5 4 1.253v13C18.832 18.5 17.5 18 16 18c-1.5 0-2.832.5-4 1.253" />
        </svg>
      ),
    },
    {
      label: t("more.codeLabel"),
      desc: t("more.codeDesc"),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 9l-4 3 4 3" />
          <path d="M16 15h4" />
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
      ),
    },
    {
      label: t("more.searchLabel"),
      desc: t("more.searchDesc"),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      ),
    },
    {
      label: t("more.memoryLabel"),
      desc: t("more.memoryDesc"),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
        </svg>
      ),
    },
  ];
  return (
    <section id="use-cases" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-2xl font-semibold tracking-tight" delay={0}>{t("more.title")}</Reveal>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, idx) => (
            <Reveal key={it.label} delay={100 + idx * 60} className="h-full">
              <div className="h-full min-h-32 sm:min-h-36 rounded-2xl border border-ui p-5 flex flex-col">
                <div className="mb-2 brand-text">{it.icon}</div>
                <h3 className="text-sm font-semibold">{it.label}</h3>
                <p className="mt-2 text-sm opacity-80 line-clamp-2">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
