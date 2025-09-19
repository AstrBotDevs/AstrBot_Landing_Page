"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useI18n } from "../components/i18n/I18nProvider";
import Reveal from "../components/Reveal";
import { SparklesIcon, HeartIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Platforms />
      <Providers />
      <Plugins />
      <Community />
      <MoreThings />
      <GetStarted />
      <SiteFooter />
    </div>
  );
}

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let raf = 0 as number | 0;
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setScrollY(window.scrollY || 0);
          raf = 0 as number | 0;
        }) as unknown as number;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return scrollY;
}

function Navbar() {
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { t, setLocale, locale } = useI18n();
  const navRef = useRef<HTMLElement | null>(null);
  const langRef = useRef<HTMLLIElement | null>(null);
  const [openLangMobile, setOpenLangMobile] = useState(false);
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
    try { root.setAttribute("data-theme", next ? "dark" : "light"); } catch {}
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
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
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openLang, openMenu]);

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
            <a href="https://docs.astrbot.app" className="inline-flex items-center h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">
              {t("nav.quickStart")}
            </a>
          </li>
          <li>
            <a href="https://plugins.astrbot.app/" className="inline-flex items-center h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">
              {t("nav.plugin")}
            </a>
          </li>
          <li>
            <a href="https://github.com/AstrBotDevs/AstrBot" className="inline-flex items-center h-9 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">
              {t("nav.github")}
            </a>
          </li>
          <li>
            <button onClick={toggleTheme} aria-label="切换深浅模式" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui" style={{ lineHeight: 1 }}>
              <span className="grid place-items-center">
                <svg className="w-4 h-4 brand-text col-start-1 row-start-1 transition-opacity duration-300" style={{opacity: isDark ? 0 : 1}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <svg className="w-4 h-4 brand-text col-start-1 row-start-1 transition-opacity duration-300" style={{opacity: isDark ? 1 : 0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </span>
            </button>
          </li>
          <li ref={langRef} className="relative">
            <button aria-expanded={openLang} onClick={() => setOpenLang((v) => !v)} className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-ui">
              <span className="current-language">{langLabel}</span>
              <span aria-hidden>▾</span>
            </button>
            {openLang && (
              <ul className="absolute right-0 mt-2 w-36 rounded-lg border border-ui bg-background shadow">
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("zh-CN"); setOpenLang(false); }}>简体中文</li>
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("en-US"); setOpenLang(false); }}>English</li>
                <li className="px-3 py-2 hover:bg-black/[.04] dark:hover:bg-white/[.06] cursor-pointer" onClick={() => { setLocale("ja-JP"); setOpenLang(false); }}>日本語</li>
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
            <div className="rounded-2xl border border-ui bg-background/90 backdrop-blur shadow-lg p-4">
              <ul className="flex flex-col gap-2 text-sm">
                <li><a href="https://docs.astrbot.app" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.quickStart")}</a></li>
                <li><a href="https://plugins.astrbot.app/" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.plugin")}</a></li>
                <li><a href="https://github.com/AstrBotDevs/AstrBot" className="inline-flex items-center h-10 px-3 rounded-full border border-ui opacity-80 hover:opacity-100 transition">{t("nav.github")}</a></li>
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
                    className="inline-flex h-10 px-3 items-center justify-center rounded-full border border-ui gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                    </svg>
                    <svg className={`w-4 h-4 transition-transform ${openLangMobile ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openLangMobile && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => { setLocale('zh-CN'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs ${locale === 'zh-CN' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>简体中文</button>
                      <button onClick={() => { setLocale('en-US'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs ${locale === 'en-US' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>English</button>
                      <button onClick={() => { setLocale('ja-JP'); setOpenMenu(false); }} className={`inline-flex items-center h-9 px-3 rounded-full border border-ui text-xs ${locale === 'ja-JP' ? 'bg-black/[.06] dark:bg-white/[.08]' : 'opacity-80 hover:opacity-100'}`}>日本語</button>
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

function Hero() {
  const scrollY = useScrollY();
  const { t, locale } = useI18n();
  // slower translate for parallax layers
  const parallax1 = { transform: `translateY(${scrollY * 0.08}px)` } as React.CSSProperties;
  const parallax2 = { transform: `translateY(${scrollY * 0.06}px)` } as React.CSSProperties;
  const parallax3 = { transform: `translateY(${scrollY * 0.04}px)` } as React.CSSProperties;
  const parallax4 = { transform: `translateY(${scrollY * 0.02}px)` } as React.CSSProperties;
  const parallaxImg = { transform: `translateY(${scrollY * 0.1}px) rotate(3deg) scale(1.10)` } as React.CSSProperties;
  const [heroStars, setHeroStars] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/plugins", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setHeroStars(typeof d?.github?.stars === "number" ? d.github.stars : null))
      .catch(() => setHeroStars(null));
  }, []);
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-start">
      <div className="absolute -z-10 left-1/2 -translate-x-1/2 top-[-200px] h-[480px] w-[480px] rounded-full bg-[#6aa1ff]/20 blur-3xl animate-orb-pulse" style={{ animationDelay: "0s" }} />
      {/* additional colorful glow orbs */}
      <div className="absolute -z-10 top-[8%] left-[-120px] h-[280px] w-[280px] rounded-full bg-[#f0abfc]/30 blur-3xl animate-orb-pulse" style={{...parallax1, animationDelay: "1s"}} />
      <div className="absolute -z-10 top-[18%] right-[-140px] h-[340px] w-[340px] rounded-full bg-[#a78bfa]/25 blur-3xl animate-orb-pulse" style={{...parallax2, animationDelay: "2.5s"}} />
      <div className="absolute -z-10 bottom-[14%] left-[10%] h-[320px] w-[320px] rounded-full bg-[#22d3ee]/25 blur-3xl animate-orb-pulse" style={{...parallax3, animationDelay: "4s"}} />
      <div className="absolute -z-10 bottom-[-60px] right-[22%] h-[260px] w-[260px] rounded-full bg-[#f59e0b]/20 blur-3xl animate-orb-pulse" style={{...parallax4, animationDelay: "5.5s"}} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-28 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8">
          <div className="text-left lg:col-span-8">
            <Reveal as="h1" className="slogan text-5xl sm:text-5xl font-semibold tracking-tight gradient-title" delay={0}>
              {locale === "zh-CN" ? (
                <>
                  <span className="sm:hidden">
                    <span>多平台大模型</span>
                    <br />
                    <span>机器人基础设施</span>
                  </span>
                  <span className="hidden sm:inline">{t("hero.slogan")}</span>
                </>
              ) : (
                t("hero.slogan")
              )}
            </Reveal>
            <Reveal as="p" className="sub-slogan mt-4 text-sm sm:text-base opacity-80 inline-flex items-center gap-2" delay={150}>
              <SparklesIcon className="w-4 h-4 brand-text" />
              <span>{t("hero.subSlogan")}</span>
              <SparklesIcon className="w-4 h-4 brand-text" />
            </Reveal>
            <Reveal className="trendshift-badge mt-6 flex justify-start" delay={300}>
              <a href="https://trendshift.io/api/badge/repositories/12875">
                <Image src="https://trendshift.io/api/badge/repositories/12875" alt="AstrBot | Trendshift" width={250} height={55} unoptimized />
              </a>
            </Reveal>
            <div className="hero-buttons mt-6 flex flex-row flex-nowrap items-center gap-2 sm:gap-3">
              <Reveal as="span" delay={400}>
                <a href="https://docs.astrbot.app" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full btn-brand text-sm font-medium transition">{t("hero.startButton")}</a>
              </Reveal>
              <Reveal as="span" delay={500}>
                <a href="https://github.com/AstrBotDevs/AstrBot" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full btn-outline-brand text-sm font-medium transition border" target="_blank">
                <span>{t("hero.githubButton")}</span>
                <span className="github-stars ml-2 inline-flex items-center gap-1 text-xs opacity-80">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 17.3l-5.4 3 1-5.8-4.4-4.3 6-.9L12 3l2.8 5.3 6 .9-4.4 4.3 1 5.8z" />
                  </svg>
                  {heroStars !== null ? heroStars.toLocaleString() : "..."}
                </span>
                </a>
              </Reveal>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-4" />
        </div>
      </div>
      <div className="pointer-events-none select-none absolute bottom-[70px] right-0 md:right-[-100px] xl:right-[-160px] opacity-60 z-0" style={parallaxImg}>
        <Reveal animation="fade" delay={300}>
          <Image src="/webui-1.png" alt="AstrBot WebUI界面" width={1200} height={800} sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 60vw, 92vw" className="hidden sm:block h-auto w-auto max-w-[92vw] md:max-w-[60vw] xl:max-w-[50vw] max-h-[70vh] object-contain drop-shadow-xl" />
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
        <a href="#features" aria-label="Scroll down">
          <svg className="w-16 h-16 text-foreground animate-arrow-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background z-[5]" />
    </section>
  );
}

function Platforms() {
  const { t } = useI18n();
  const slides = [
    { key: "qq", label: "QQ", src: "/show/qq_demo_1.png" },
    { key: "wxkefu", label: "微信客服", src: "/show/wxkefu_demo_1.png" },
    { key: "wecom", label: "企业微信应用", src: "/show/wecom_demo_1.png" },
    { key: "wxoa", label: "微信公众号", src: "/show/wxoa_demo_1.png" },
    { key: "lark", label: "飞书", src: "/show/lark_demo_1.png" },
    { key: "dingtalk", label: "钉钉", src: "/show/dingtalk_demo_1.png" },
    { key: "telegram", label: "Telegram", src: "/show/telegram_demo_1.png" },
    { key: "slack", label: "Slack", src: "/show/slack_demo_1.png" },
    { key: "discord", label: "Discord", src: "/show/discord_demo_1.png" },
    { key: "kook", label: "KOOK", src: "/show/kook_demo_1.png" },
    { key: "vocechat", label: "VoceChat", src: "" },
  ];
  const [index, setIndex] = useState(0);
  const slidesLen = slides.length;
  const go = useCallback((n: number) => setIndex((i) => (i + n + slidesLen) % slidesLen), [slidesLen]);
  const autoRef = useRef(0 as number | 0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const startAuto = useCallback(() => {
    if (autoRef.current) window.clearInterval(autoRef.current as number);
    autoRef.current = window.setInterval(() => go(1), 5000) as unknown as number;
  }, [go]);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting;
      if (isVisible) {
        startAuto();
      } else if (autoRef.current) {
        window.clearInterval(autoRef.current as number);
        autoRef.current = 0 as number | 0;
      }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (autoRef.current) window.clearInterval(autoRef.current as number);
    };
  }, [startAuto]);
  return (
    <section ref={sectionRef} id="features" className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
  <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 gradient-title" delay={0}>{t("platforms.title")}</Reveal>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-2 text-center lg:text-left">
            <Reveal className="inline-flex items-center rounded-full border px-3 py-1 text-xs tag-brand" delay={100}>{t("platforms.current")}</Reveal>
            <Reveal as="h3" className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight" delay={200}>{slides[index].label}</Reveal>
            <div className="mt-5 hidden sm:flex flex-wrap gap-2">
              {slides.map((s, i) => (
                <Reveal key={s.key} as="span" delay={150 + i * 40}>
                  <button onClick={() => { setIndex(i); startAuto(); }} className={`px-3 py-1.5 rounded-full border border-ui text-xs ${i === index ? "bg-black/[.06] dark:bg-white/[.08]" : "opacity-80 hover:opacity-100"}`}>{s.label}</button>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-10">
            <div className="mx-auto w-full max-w-[960px] rounded-xl border border-ui overflow-hidden bg-background/80 backdrop-blur p-4 sm:p-6">
              <div className="relative h-[340px] sm:h-[360px] md:h-[460px] lg:h-[560px] xl:h-[640px]">
                {slides.map((s, i) => (
                  <div key={s.key} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
                    {s.src ? (
                      <Image src={s.src} alt={`${s.label} 平台演示`} width={1200} height={800} className="max-h-full w-auto mt-2 sm:mt-4 rounded-xl px-2 object-contain" />
                    ) : (
                      <div className="text-center text-sm opacity-80"><span>{t("platforms.vocechatSupport")}</span></div>
                    )}
                  </div>
                ))}
                <button aria-label={t("carousel.prev")} onClick={() => { go(-1); startAuto(); }} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-ui bg-background/80 backdrop-blur flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button aria-label={t("carousel.next")} onClick={() => { go(1); startAuto(); }} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-ui bg-background/80 backdrop-blur flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 pt-4">
                {slides.map((s, i) => (
                  <button key={s.key} onClick={() => { setIndex(i); startAuto(); }} aria-label={`Go to ${s.label}`} className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-foreground" : "w-3 bg-foreground/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Providers() {
  const { t } = useI18n();
  const items = [
    { name: "OpenAI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/openai.svg" },
    { name: "xAI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/xai.svg" },
    { name: "Anthropic", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/anthropic.svg" },
    { name: "Ollama", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ollama.svg" },
    { name: "LM Studio", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/lmstudio.svg" },
    { name: "Gemini", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/gemini-color.svg" },
    { name: "DeepSeek", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/deepseek.svg" },
    { name: "智谱 AI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/zhipu.svg" },
    { name: "Kimi", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/kimi.svg" },
    { name: "MiniMax", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/minimax.svg" },
    { name: "FishAudio", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fishaudio.svg" },
    { name: "Azure", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/azure.svg" },
    { name: "302.AI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ai302-color.svg", href: "https://302.ai/?ref=rr1M3l&snid=1757049012429930388_SbBUfEJs&x_collect_uid=d57a632ff7304a00880a3a0dfd293683" },
    { name: "PPIO派欧云", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ppio.svg" },
    { name: "硅基流动", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/siliconcloud.svg" },
    { name: "优云智算", src: "/show/ucloud_compshare.png", href: "https://www.compshare.cn/?ytag=GPU_YY-gh_astrbot&referral_code=FV7DcGowN4hB5UuXKgpE74" },
    { name: "Dify", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/dify-color.svg" },
    { name: "阿里云百炼", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/alibabacloud-color.svg" },
    { name: "FastGPT", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fastgpt-color.svg" },
  ];
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
  <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 gradient-title" delay={0}>{t("models.title")}</Reveal>
  <Reveal as="p" className="text-center mt-2 text-sm opacity-80 mb-10 sm:mb-12" delay={150}>{t("models.subtitle")}</Reveal>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((it, idx) => (
            it.href ? (
              <Reveal key={it.name} delay={100 + idx * 40} className="h-full">
                <a href={it.href} target="_blank" rel="noreferrer" className="h-full min-h-28 rounded-xl border border-ui p-3 sm:p-4 flex flex-col items-center gap-2 hover:bg-[var(--brand-soft)] transition">
                <div className="h-10 w-10 rounded-md bg-white dark:bg-white flex items-center justify-center ring-1 ring-black/[.06] dark:ring-white/[.12]">
                  <Image src={it.src} alt={it.name} width={24} height={24} className="h-6 w-auto" unoptimized />
                </div>
                <span className="text-sm opacity-80 underline underline-offset-4 brand-text">{it.name}</span>
                </a>
              </Reveal>
            ) : (
              <Reveal key={it.name} delay={100 + idx * 40} className="h-full">
                <div className="h-full min-h-28 rounded-xl border border-ui p-3 sm:p-4 flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-md bg-white dark:bg-white flex items-center justify-center ring-1 ring-black/[.06] dark:ring-white/[.12]">
                  <Image src={it.src} alt={it.name} width={24} height={24} className="h-6 w-auto" unoptimized />
                </div>
                <span className="text-sm opacity-80">{it.name}</span>
                </div>
              </Reveal>
            )
          ))}
          <Reveal delay={100 + items.length * 40} className="h-full">
            <div className="h-full min-h-28 rounded-xl border border-ui p-3 sm:p-4 flex items-center justify-center">...</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Plugins() {
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
                className="block rounded-2xl border border-ui p-4 sm:p-5 hover:bg-[var(--brand-soft)] transition"
                  delay={100 + idx * 60}
                >
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
                </Reveal>
              ))}
              <Reveal
                as="a"
                href="https://plugins.astrbot.app"
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-ui p-4 sm:p-5 hover:bg-[var(--brand-soft)] transition flex items-center justify-center"
                delay={100 + 8 * 60}
              >
                <span className="text-sm font-medium brand-text">{t("plugins.more")}</span>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Community() {
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
    <section className="py-12 sm:py-16">
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
            <Image src="https://contrib.rocks/image?repo=AstrBotDevs/AstrBot" width={800} height={200} alt="AstrBot 贡献者" className="rounded-xl border border-ui" unoptimized />
          </Reveal>
          <Reveal as="p" className="mt-3 text-sm opacity-80" delay={200}>{t("community.contributorsNote")}</Reveal>
        </div>
      </div>
    </section>
  );
}

function MoreThings() {
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

function GetStarted() {
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
          <a href="https://docs.astrbot.app" target="_blank" className="inline-flex items-center justify-center h-11 px-5 rounded-full btn-brand text-sm font-medium hover:opacity-90 transition">{t("getStarted.doc")}</a>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  const scrollY = useScrollY();
  const footerRef = useRef<HTMLElement | null>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Move opposite to scroll a little, but clamp to avoid hiding orbs
    const y = Math.max(-60, Math.min(60, -rect.top * 0.06));
    setParallaxY(y);
  }, [scrollY]);
  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-ui" style={{ backgroundColor: "var(--footer-bg)" }}>
      {/* Decorative blurred orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ transform: `translateY(${parallaxY}px)`, willChange: "transform" }}
      >
        <div
          className="absolute top-4 left-0 w-72 h-72 rounded-full blur-3xl opacity-25 dark:opacity-20 animate-orb-sway animate-orb-pulse"
          style={{ backgroundColor: "var(--brand)", animationDelay: "0s, 0.5s, 1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 dark:opacity-15 animate-orb-sway animate-orb-pulse"
          style={{ backgroundColor: "#22d3ee", animationDelay: "0.6s, 1.2s, 3s" }}
        />
        <div
          className="absolute top-6 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 dark:opacity-15 animate-orb-sway animate-orb-pulse"
          style={{ backgroundColor: "#a78bfa", animationDelay: "1.2s, 2.4s, 5s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold">AstrBot</h2>
            <p className="mt-1 text-sm opacity-80">{t("hero.slogan")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold">{t("footer.resources")}</h3>
              <ul className="mt-2 space-y-2 text-sm opacity-80">
                <li><a href="https://docs.astrbot.app">{t("footer.docs")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{t("footer.community")}</h3>
              <ul className="mt-2 space-y-2 text-sm opacity-80">
                <li><a href="https://github.com/AstrBotDevs/AstrBot">{t("footer.github")}</a></li>
                <li><a href="https://qm.qq.com/cgi-bin/qm/qr?k=wtbaNx7EioxeaqS9z7RQWVXPIxg2zYr7&jump_from=webapi&authKey=vlqnv/AV2DbJEvGIcxdlNSpfxVy+8vVqijgreRdnVKOaydpc+YSw4MctmEbr0k5">{t("footer.qq")}</a></li>
                <li><a href="https://t.me/+hAsD2Ebl5as3NmY1">{t("footer.telegram")}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{t("footer.support")}</h3>
              <ul className="mt-2 space-y-2 text-sm opacity-80">
                <li><a href="mailto:soulter@qq.com">{t("footer.contact")}</a></li>
                <li><a href="https://github.com/AstrBotDevs/AstrBot/issues">{t("footer.issues")}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm opacity-70">
          <p>© {new Date().getFullYear()} AstrBot. {t("footer.copyright")}</p>
          <p className="mt-2">{t("footer.partners")}: <a className="underline" href="https://www.rainyun.com/NjY3OTQ1_" target="_blank">雨云-新一代云服务商</a></p>
          <p className="mt-2">{t("footer.friendLinks")}: <a className="underline" href="https://ustb-806.github.io/" target="_blank">北京科技大学 806 学生创新实验室</a></p>
          <p className="mt-2 inline-flex items-center gap-2">
            <span>{t("footer.madeWith")}</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
      </footer>
  );
}
