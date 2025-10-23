"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";
import { PuzzlePieceIcon, ArrowRightIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import CardSwap, { Card } from "../ui/CardSwap";

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
    <section ref={sectionRef} className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="lg:pr-6">
            <Reveal as="h2" className="text-left text-3xl sm:text-4xl font-semibold tracking-tight mb-4 gradient-title" delay={0}>
              {t("plugins.title")}
              <span className="ml-3 align-middle inline-flex items-center rounded-full border border-ui px-3 py-1.5 text-base sm:text-lg leading-none">{pluginCount}</span>
            </Reveal>
            <Reveal as="p" className="text-left mt-1 sm:mt-2 text-sm opacity-80" delay={150}>{t("plugins.subtitle")}</Reveal>
            <Reveal as="a" href="https://plugins.astrbot.app" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 mt-3 text-sm font-medium brand-text hover:opacity-90 transition" delay={220}>
              {t("plugins.moreCta")} <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" />
            </Reveal>
          </div>
          <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] lg:justify-self-end w-full">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loader-ring" aria-label="loading" />
            </div>
          ) : plugins.length > 0 ? (
            <>
              <CardSwap
                width={520}
                height={180}
                cardDistance={54}
                verticalDistance={54}
                delay={5200}
                pauseOnHover
                onCardClick={(idx) => {
                  const maxPlugins = Math.min(8, plugins.length);
                  const shown = plugins.slice(0, maxPlugins);
                  if (idx < maxPlugins) {
                    const p = shown[idx];
                    if (p?.repo) window.open(p.repo, '_blank', 'noopener,noreferrer');
                  } else {
                    window.open('https://plugins.astrbot.app', '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {plugins.slice(0, Math.min(8, plugins.length)).map((p) => (
                  <Card key={p.key} className="group p-5 sm:p-6 cursor-pointer">
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-semibold leading-snug line-clamp-1">{p.name}</h4>
                        {typeof p.stars === 'number' && (
                          <div className="text-xs opacity-80 inline-flex items-center gap-1 brand-text">
                            <svg className="w-3.5 h-3.5 brand-text" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M12 17.3l-5.4 3 1-5.8-4.4-4.3 6-.9L12 3l2.8 5.3 6 .9-4.4 4.3 1 5.8z" />
                            </svg>
                            {p.stars}
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-sm opacity-80 line-clamp-3 min-h-[3.4rem]">{p.desc}</p>
                      {p.repo && (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-5 inline-flex items-center gap-1 text-sm font-medium brand-text hover:opacity-90 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('plugins.view')} <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" />
                        </a>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-15 brand-text pointer-events-none select-none z-0">
                      <PuzzlePieceIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                  </Card>
                ))}
                {/** 更多插件卡片 */}
                <Card key="more-card" className="group p-5 sm:p-6 cursor-pointer" onClick={() => window.open('https://plugins.astrbot.app', '_blank', 'noopener,noreferrer')}>
                  <div className="relative z-10">
                    <h4 className="text-base font-semibold leading-snug line-clamp-1">{t('plugins.more')}</h4>
                    <p className="mt-3 text-sm opacity-80 line-clamp-3 min-h-[3.4rem]">{t('plugins.subtitle')}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium brand-text">
                      {t('plugins.view')} <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" />
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-15 brand-text pointer-events-none select-none z-0">
                    <EllipsisHorizontalIcon className="w-16 h-16 sm:w-20 sm:h-20" />
                  </div>
                </Card>
              </CardSwap>
            </>
          ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
