"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "../ui/Reveal";
import { useI18n } from "../i18n/I18nProvider";

export default function Community() {
  const { t } = useI18n();
  const [stats, setStats] = useState<{ stars: number; forks: number; contributors: number; plugins: number }>({ stars: 0, forks: 0, contributors: 0, plugins: 0 });
  useEffect(() => {
    fetch("/api/plugins", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const pluginsCount = Object.keys(d?.plugins || {}).length;
        setStats({
          stars: d?.github?.stars ?? 0,
          forks: d?.github?.forks ?? 0,
          contributors: d?.github?.contributors ?? 0,
          plugins: pluginsCount,
        });
      })
      .catch(() => void 0);
  }, []);

  const StatCard = (
    { icon, value, label }:
    { icon: React.ReactNode; value: number | string; label: string }
  ) => (
    <div className="rounded-2xl border border-ui p-6 text-center">
      <div className="flex items-center justify-center mb-2 brand-text">{icon}</div>
      <div className="text-2xl font-semibold">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <h3 className="mt-2 text-sm opacity-80">{label}</h3>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-[var(--brand-soft)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight gradient-title" delay={0}>{t("community.title")}</Reveal>
        <Reveal as="p" className="text-center mt-2 mb-10 text-sm opacity-80" delay={150}>{t("community.subtitle")}</Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Reveal delay={100}>
            {StatCard({
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ),
              value: stats.stars,
              label: t("community.stars"),
            })}
          </Reveal>
          <Reveal delay={180}>
            {StatCard({
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 3v12" />
                  <path d="M18 9v12" />
                  <path d="M6 15l6 6 6-6" />
                </svg>
              ),
              value: stats.forks,
              label: t("community.forks"),
            })}
          </Reveal>
          <Reveal delay={260}>
            {StatCard({
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M16 11c1.66 0 3-1.79 3-4s-1.34-4-3-4-3 1.79-3 4 1.34 4 3 4zM8 11c1.66 0 3-1.79 3-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              ),
              value: stats.contributors,
              label: t("community.contributors"),
            })}
          </Reveal>
          <Reveal delay={340}>
            {StatCard({
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.5 11H17V7.5L12 2 7 7.5V11H3.5L2 13l1.5 2H7v3.5L12 22l5-3.5V15h3.5L22 13l-1.5-2zM9 9l3-3 3 3v4H9V9z" />
                </svg>
              ),
              value: stats.plugins,
              label: t("community.plugins"),
            })}
          </Reveal>
        </div>
        <div className="mt-10 text-center">
          <Reveal as="h3" className="text-base font-semibold" delay={0}>{t("community.contributorsTitle")}</Reveal>
          <Reveal className="mt-4 flex justify-center" animation="fade" delay={120}>
            <Image src="https://contrib.rocks/image?repo=AstrBotDevs/AstrBot" width={800} height={200} alt="AstrBot 贡献者" className="rounded-xl" unoptimized style={{ width: "auto", height: "auto" }} />
          </Reveal>
          <Reveal as="p" className="mt-3 text-sm opacity-80" delay={200}>{t("community.contributorsNote")}</Reveal>
        </div>
      </div>
    </section>
  );
}
