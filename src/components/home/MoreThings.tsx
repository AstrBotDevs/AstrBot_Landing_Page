"use client";

import Reveal from "../ui/Reveal";
import { useI18n } from "../i18n/I18nProvider";
import { CalendarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { makeRandomBanner } from "../utils/randomBanner";

type NewsItem = { url: string; title: string; lastmod?: string };

export default function MoreThings() {
  const { t } = useI18n();
  const [items, setItems] = React.useState<NewsItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const r = await fetch("/api/news", { cache: "no-store" });
        const j = await r.json();
        if (!alive) return;
        if (Array.isArray(j?.items)) setItems(j.items as NewsItem[]);
        else setError("Invalid response");
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "fetch_failed");
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, []);

  const list = React.useMemo(() => items?.slice(0, 4) ?? [], [items]);
  const banners = React.useMemo(() => {
    if (!list.length) return [] as string[];
    return list.map((it) => makeRandomBanner(it.url || it.title, 800, 140));
  }, [list]);

  return (
    <section id="news" className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-2xl font-semibold tracking-tight" delay={0}>
          {t("more.title")}
        </Reveal>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items === null && (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="group block h-full rounded-2xl border border-ui p-5 skeleton-card"
                aria-hidden
              >
                <div className="animate-pulse">
                  <div className="-mx-5 -mt-5 mb-4">
                    <div className="h-24 w-full rounded-t-2xl skeleton-line" />
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full skeleton-circle" />
                    <div className="h-3 w-20 rounded skeleton-line" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded skeleton-line" />
                    <div className="h-4 w-3/4 rounded skeleton-line" />
                  </div>
                </div>
              </div>
            ))
          )}

          {items && list.map((it, idx) => {
            const dateStr = it.lastmod ? new Date(it.lastmod).toLocaleDateString() : "";
            return (
              <Reveal key={it.url} delay={100 + idx * 60} className="h-full">
                <a
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-2xl border border-ui p-5 hover:bg-black/[.04] dark:hover:bg-white/[.04] transition-colors"
                >
                  <div className="-mx-5 -mt-5 mb-4 relative h-24 rounded-t-2xl overflow-hidden">
                    {banners[idx] && (
                      <Image
                        src={banners[idx]}
                        alt={it.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={false}
                      />
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm group-hover:backdrop-blur-md transition-all duration-300 group-hover:bg-white/15 dark:group-hover:bg-black/25"
                    />
                  </div>
                  <div className="mb-3 brand-text flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    {dateStr && <span className="text-xs opacity-70">{dateStr}</span>}
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:underline underline-offset-4">
                    {it.title}
                  </h3>
                </a>
              </Reveal>
            );
          })}

          {items && items.length === 0 && !error && (
            <div className="col-span-full text-center text-sm opacity-80">{t("common.noData") || "No news yet"}</div>
          )}

          {error && (
            <div className="col-span-full text-center text-sm text-red-500">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
}
