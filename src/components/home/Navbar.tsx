"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { t, setLocale, locale } = useI18n();
  const navRef = useRef<HTMLElement | null>(null);
  const langRef = useRef<HTMLLIElement | null>(null);
  const moreRef = useRef<HTMLLIElement | null>(null);
  const [openLangMobile, setOpenLangMobile] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [releaseVersion, setReleaseVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/plugins", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.release && data.release.version) {
          setReleaseVersion(data.release.version);
        }
      })
      .catch(() => setReleaseVersion(null));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !isDark;
    setIsDark(next);
    root.classList.toggle("dark", next);
    try {
      root.setAttribute("data-theme", next ? "dark" : "light");
    } catch {}
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldDark = saved ? saved === "dark" : prefersDark;
      setIsDark(shouldDark);
      const root = document.documentElement;
      root.classList.toggle("dark", shouldDark);
      root.setAttribute("data-theme", shouldDark ? "dark" : "light");
    } catch {}
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (openLang && langRef.current && !langRef.current.contains(target)) setOpenLang(false);
      if (openMenu && navRef.current && !navRef.current.contains(target)) setOpenMenu(false);
      if (openMore && moreRef.current && !moreRef.current.contains(target)) setOpenMore(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openLang, openMenu, openMore]);

  const langLabel = locale === "en-US" ? "English" : locale === "ja-JP" ? "日本語" : "简体中文";

  return (
    <nav ref={navRef} className="relative sticky top-0 z-50 backdrop-blur bg-background/80 border-b border-ui">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.webp" alt="AstrBot" width={32} height={32} />
          <span className="text-lg sm:text-xl font-semibold tracking-tight font-lexend">AstrBot</span>
          {releaseVersion && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--brand-soft)] text-[var(--brand)] border border-[var(--brand)]/20">
              {releaseVersion}
            </span>
          )}
        </div>
        <ul className="hidden md:flex items-center gap-3 text-sm">
          <li>
            <a href="https://docs.astrbot.app" className="inline-flex items-center h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition duration-200">
              {t("nav.quickStart")}
            </a>
          </li>
          
          <li>
            <a
              href="https://github.com/AstrBotDevs/AstrBot"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui opacity-80 hover:opacity-100 transition duration-200"
              aria-label={t("nav.github")}
              title="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.77.08-.76.08-.76 1.22.09 1.86 1.26 1.86 1.26 1.08 1.87 2.83 1.33 3.52 1.02.11-.8.42-1.33.76-1.64-2.67-.31-5.47-1.37-5.47-6.08 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.55.12-3.22 0 0 1.01-.33 3.31 1.26.96-.27 1.98-.4 3-.41 1.02 0 2.04.14 3 .41 2.3-1.59 3.31-1.26 3.31-1.26.66 1.67.24 2.91.12 3.22.77.86 1.24 1.96 1.24 3.3 0 4.72-2.8 5.77-5.47 6.08.43.38.81 1.1.81 2.22 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.82.57C20.56 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0Z" />
              </svg>
            </a>
          </li>
          <li>
            <button onClick={toggleTheme} aria-label="切换深浅模式" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui" style={{ lineHeight: 1 }}>
              <span className="grid place-items-center">
                <svg className="w-4 h-4 brand-text col-start-1 row-start-1 transition-opacity duration-200" style={{opacity: isDark ? 0 : 1}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <svg className="w-4 h-4 brand-text col-start-1 row-start-1 transition-opacity duration-200" style={{opacity: isDark ? 1 : 0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </span>
            </button>
          </li>
          <li ref={langRef} className="relative">
            <button aria-expanded={openLang} onClick={() => setOpenLang((v) => !v)} className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition-colors duration-200 text-[var(--foreground)]">
              <span className="current-language">{langLabel}</span>
              <ChevronDownIcon aria-hidden className={`w-4 h-4 transition-transform duration-200 ${openLang ? 'rotate-180' : ''}`} />
            </button>
            {openLang && (
              <ul className="absolute right-0 mt-5 w-28 rounded-lg border border-ui bg-background shadow-lg origin-top-right animate-dropdown">
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("zh-CN"); setOpenLang(false); }}>简体中文</li>
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("en-US"); setOpenLang(false); }}>English</li>
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("ja-JP"); setOpenLang(false); }}>日本語</li>
              </ul>
            )}
          </li>
          <li ref={moreRef} className="relative">
            <button
              aria-expanded={openMore}
              onClick={() => setOpenMore((v) => !v)}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition-colors duration-200 text-[var(--foreground)]"
            >
              <span>{t("nav.more")}</span>
              <ChevronDownIcon aria-hidden className={`w-4 h-4 transition-transform duration-200 ${openMore ? 'rotate-180' : ''}`} />
            </button>
            {openMore && (
              <ul className="absolute right-0 mt-5 w-26 rounded-lg border border-ui bg-background shadow-lg origin-top-right animate-dropdown whitespace-nowrap">
                <li>
                  <a href="https://plugins.astrbot.app/" className="block px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]">{t("nav.plugin")}</a>
                </li>
                <li>
                  <a href="https://blog.astrbot.app" className="block px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]">{t("nav.blog")}</a>
                </li>
                <li>
                  <a href="https://astrbot.featurebase.app/roadmap" className="block px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06]">{t("nav.roadmap")}</a>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-ui bg-background/80 backdrop-blur transition active:scale-[0.98]"
          onClick={() => setOpenMenu((v) => !v)}
          aria-label="menu"
          aria-expanded={openMenu}
        >
          <div className="relative w-4 h-4">
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-foreground transition-transform duration-300 ${openMenu ? 'rotate-45' : '-translate-y-[4px]'}`} />
            <span className={`absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-foreground transition-transform duration-300 ${openMenu ? '-rotate-45' : 'translate-y-[4px]'}`} />
          </div>
        </button>
      </div>
      {openMenu && (
        <div className="md:hidden absolute left-0 right-0 top-16 z-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-4 mt-2">
            <div className="rounded-2xl border border-ui bg-background/90 backdrop-blur shadow-lg p-4 animate-dropdown origin-top">
              <ul className="flex flex-col gap-2 text-sm">
                <li><a href="https://docs.astrbot.app" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.quickStart")}</a></li>
                <li><a href="https://plugins.astrbot.app/" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.plugin")}</a></li>
                <li><a href="https://blog.astrbot.app" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.blog")}</a></li>
                <li><a href="https://astrbot.featurebase.app/roadmap" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.roadmap")}</a></li>
                <li>
                  <a
                    href="https://github.com/AstrBotDevs/AstrBot"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ui opacity-80 hover:opacity-100 transition"
                    aria-label={t("nav.github")}
                    title="GitHub"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.77.08-.76.08-.76 1.22.09 1.86 1.26 1.86 1.26 1.08 1.87 2.83 1.33 3.52 1.02.11-.8.42-1.33.76-1.64-2.67-.31-5.47-1.37-5.47-6.08 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.55.12-3.22 0 0 1.01-.33 3.31 1.26.96-.27 1.98-.4 3-.41 1.02 0 2.04.14 3 .41 2.3-1.59 3.31-1.26 3.31-1.26.66 1.67.24 2.91.12 3.22.77.86 1.24 1.96 1.24 3.3 0 4.72-2.8 5.77-5.47 6.08.43.38.81 1.1.81 2.22 0 1.61-.02 2.91-.02 3.31 0 .32.22.69.82.57C20.56 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0Z" />
                    </svg>
                  </a>
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-ui">
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={toggleTheme} aria-label="切换深浅模式" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ui" style={{ lineHeight: 1 }}>
                    <span className="grid place-items-center">
                      <svg className="w-5 h-5 brand-text col-start-1 row-start-1 transition-opacity duration-300" style={{opacity: isDark ? 0 : 1}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                      <svg className="w-5 h-5 brand-text col-start-1 row-start-1 transition-opacity duration-300" style={{opacity: isDark ? 1 : 0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={() => setOpenLangMobile((v) => !v)}
                    aria-expanded={openLangMobile}
                    aria-label="语言"
                    className="inline-flex h-10 px-3 items-center justify-center rounded-full border border-ui gap-2 opacity-80 hover:opacity-100 transition duration-200"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                    </svg>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${openLangMobile ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  {openLangMobile && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => { setLocale('zh-CN'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs transition duration-200 ${locale === 'zh-CN' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>简体中文</button>
                      <button onClick={() => { setLocale('en-US'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs transition duration-200 ${locale === 'en-US' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>English</button>
                      <button onClick={() => { setLocale('ja-JP'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs transition duration-200 ${locale === 'ja-JP' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>日本語</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
