"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "../Reveal";
import TextType from "../ui/TextType";
import { useI18n } from "../i18n/I18nProvider";
import { useScrollY } from "../hooks/useScrollY";
import { formatCompactNumber } from "../utils/number";
import webui1 from "../../../public/webui-1.webp";

export default function Hero() {
  const scrollY = useScrollY();
  const { t } = useI18n();
  const parallax1 = { transform: `translateY(${scrollY * 0.08}px)` } as React.CSSProperties;
  const parallax2 = { transform: `translateY(${scrollY * 0.06}px)` } as React.CSSProperties;
  const parallax3 = { transform: `translateY(${scrollY * 0.04}px)` } as React.CSSProperties;
  const parallax4 = { transform: `translateY(${scrollY * 0.02}px)` } as React.CSSProperties;
  const parallaxImage = { transform: `translateY(${scrollY * -0.04}px)` } as React.CSSProperties;
  const isAtTop = scrollY <= 10;
  const tiltDeg = Math.max(0, 8 - scrollY * 0.08); // start ~8deg at top, ease to 0deg as you scroll
  const [heroStars, setHeroStars] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/plugins", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setHeroStars(typeof d?.github?.stars === "number" ? d.github.stars : null))
      .catch(() => setHeroStars(null));
  }, []);
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex flex-col items-start">
      <div className="absolute -z-10 left-1/2 -translate-x-1/2 top-[-200px] h-[480px] w-[480px] rounded-full bg-[#6aa1ff]/20 blur-3xl animate-orb-pulse" style={{ animationDelay: "0s" }} />
      <div className="absolute -z-10 top-[8%] left-[-120px] h-[280px] w-[280px] rounded-full bg-[#f0abfc]/30 blur-3xl animate-orb-pulse" style={{...parallax1, animationDelay: "1s"}} />
      <div className="absolute -z-10 top-[18%] right-[-140px] h-[340px] w-[340px] rounded-full bg-[#a78bfa]/25 blur-3xl animate-orb-pulse" style={{...parallax2, animationDelay: "2.5s"}} />
      <div className="absolute -z-10 bottom-[14%] left-[10%] h-[320px] w-[320px] rounded-full bg-[#22d3ee]/25 blur-3xl animate-orb-pulse" style={{...parallax3, animationDelay: "4s"}} />
      <div className="absolute -z-10 bottom-[-60px] right-[22%] h-[260px] w-[260px] rounded-full bg-[#f59e0b]/20 blur-3xl animate-orb-pulse" style={{...parallax4, animationDelay: "5.5s"}} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-28 pb-10">
        <div className="flex flex-col items-center text-center gap-6">
            <h1 className="slogan text-5xl sm:text-5xl font-semibold tracking-tight brand-text">
              {/* 移动端：仅打 AstrBot */}
              <span className="block sm:hidden">
                <TextType
                  text={["AstrBot AI", "OmniMind"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                />
              </span>
              {/* 桌面端：完整打字内容 */}
              <span className="hidden sm:grid">
                <span className="col-start-1 row-start-1">
                  <TextType
                    text={["AstrBot AI", "We rise together", "back to the moon and beyond"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="_"
                  />
                </span>
                <span className="col-start-1 row-start-1 invisible select-none pointer-events-none" aria-hidden>
                  back to the moon and beyond
                </span>
              </span>
            </h1>
            {/* Subtitle removed as requested */}
            <Reveal className="trendshift-badge mt-6 flex flex-wrap sm:flex-nowrap justify-center gap-3" delay={300}>
              <a href="https://trendshift.io/api/badge/repositories/12875">
                <Image src="https://trendshift.io/api/badge/repositories/12875" alt="AstrBot | Trendshift" width={250} height={55} unoptimized priority loading="eager" fetchPriority="high" />
              </a>
              <a href="https://hellogithub.com/repository/AstrBotDevs/AstrBot" target="_blank">
                <Image src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=d127d50cd5e54c5382328acc3bb25483&claim_uid=ZO9by7qCXgSd6Lp" alt="Featured｜HelloGitHub" width={250} height={55} unoptimized priority loading="eager" fetchPriority="high" />
              </a>
            </Reveal>
            <div className="hero-buttons mt-6 flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3">
              <Reveal as="span" delay={400}>
                <a href="https://docs.astrbot.app/what-is-astrbot.html" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full btn-brand text-sm font-medium transition">{t("hero.startButton")}</a>
              </Reveal>
              <Reveal as="span" delay={500}>
                <a href="https://github.com/AstrBotDevs/AstrBot" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full btn-outline-brand text-sm font-medium transition border" target="_blank">
                  <span>{t("hero.githubButton")}</span>
                  <span className="github-stars ml-2 inline-flex items-center gap-1 text-xs opacity-80">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 17.3l-5.4 3 1-5.8-4.4-4.3 6-.9L12 3l2.8 5.3 6 .9-4.4 4.3 1 5.8z" />
                    </svg>
                    {heroStars !== null ? formatCompactNumber(heroStars) : "..."}
                  </span>
                </a>
              </Reveal>
            </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center will-change-transform" style={parallaxImage}>
        <Reveal animation="fade" delay={300}>
          <div style={{ perspective: "1100px" }}>
            <Image
              src={isAtTop ? "/webui-1.webp" : webui1}
              alt="AstrBot WebUI界面"
              width={1200}
              height={800}
              sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 60vw, 92vw"
              placeholder={isAtTop ? "empty" : "blur"}
              priority
              quality={70}
              style={{ transform: `rotateX(${tiltDeg}deg)`, transformOrigin: "bottom center" }}
              className="hidden sm:block h-auto w-auto max-w-[92vw] md:max-w-[60vw] xl:max-w-[50vw] max-h-[70vh] object-contain drop-shadow-xl rounded-2xl transition-transform duration-500 ease-out"
            />
          </div>
        </Reveal>
      </div>
      <div className="absolute inset-x-0 bottom-12 z-20 flex justify-center">
        <a href="#features" aria-label="Scroll down">
          <svg className="w-16 h-16 brand-text animate-arrow-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background z-[15]" />
    </section>
  );
}