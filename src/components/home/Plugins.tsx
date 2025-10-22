"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";
import { PuzzlePieceIcon, EllipsisHorizontalIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Plugins() {
  const { t } = useI18n();
  const [plugins, setPlugins] = useState<Array<{ key: string; name: string; desc: string; stars?: number; repo?: string }>>([]);
  const [pluginCount, setPluginCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const fetchLocal = () => {
      setLoading(true);
      fetch("/api/plugins", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => {
          type PluginItem = { desc: string; stars?: number; repo?: string };
          const pluginsMap = (data?.plugins || {}) as Record<string, PluginItem>;
          const entries = Object.entries(pluginsMap) as Array<[string, PluginItem]>;
          setPluginCount(entries.length);
          for (let i = entries.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
          }
          const pick = entries.slice(0, 9);
          const mapped = pick.map(([key, v]) => ({
            key,
            name: key.replace(/_/g, " "),
            desc: v.desc,
            stars: v.stars,
            repo: v.repo,
          }));
          setPlugins(mapped);
        })
        .catch(() => {
          setPlugins([]);
          setPluginCount(0);
        })
        .finally(() => setLoading(false));
    };
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasFetched) {
        setHasFetched(true);
        fetchLocal();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [hasFetched]);
  return (
    <section ref={sectionRef} className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 gradient-title" delay={0}>
          {t("plugins.title")}
          <span className="ml-3 align-middle inline-flex items-center rounded-full border border-ui px-3 py-1.5 text-base sm:text-lg leading-none">{pluginCount}</span>
        </Reveal>
        <Reveal as="p" className="text-center mt-2 mb-10 sm:mb-12 text-sm opacity-80" delay={150}>{t("plugins.subtitle")}</Reveal>
        <div id="plugins-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {loading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center py-14 sm:py-16">
              <div className="loader-ring" aria-label="loading" />
            </div>
          ) : (
            <>
              {plugins.slice(0, 8).map((p, idx) => (
                <Reveal
                  key={p.key}
                  as="a"
                  href={p.repo}
                  target="_blank"
                  className="block relative overflow-hidden rounded-2xl border border-ui p-4 sm:p-5 hover:bg-[var(--brand-soft)] transition"
                  delay={100 + idx * 60}
                >
                  <div className="absolute bottom-2 right-2 opacity-15 brand-text pointer-events-none select-none z-0">
                    <PuzzlePieceIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-sm font-semibold line-clamp-1">{p.name}</h4>
                    <p className="mt-2 text-sm opacity-80 line-clamp-2">{p.desc}</p>
                    {typeof p.stars === "number" && (
                      <div className="mt-3 text-xs opacity-80 inline-flex items-center gap-1 brand-text">
                        <svg className="w-3.5 h-3.5 brand-text" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 17.3l-5.4 3 1-5.8-4.4-4.3 6-.9L12 3l2.8 5.3 6 .9-4.4 4.3 1 5.8z" />
                        </svg>
                        {p.stars}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
              <Reveal
                as="a"
                href="https://plugins.astrbot.app"
                target="_blank"
                rel="noreferrer"
                className="group block relative overflow-hidden rounded-2xl border border-ui p-4 sm:p-5 hover:bg-[var(--brand-soft)] transition flex items-center justify-center"
                delay={100 + 8 * 60}
              >
                <div className="absolute bottom-2 right-2 opacity-15 brand-text pointer-events-none select-none z-0">
                  <EllipsisHorizontalIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                <span className="relative z-10 flex items-center gap-2 text-base sm:text-lg font-semibold brand-text">
                  {t("plugins.more")} 
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
