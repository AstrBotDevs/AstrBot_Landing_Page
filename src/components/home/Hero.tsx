"use client";

import { useEffect, useState } from "react";
import Reveal from "../ui/Reveal";
import TextType from "../ui/TextType";
import { useI18n } from "../i18n/I18nProvider";
import { formatCompactNumber } from "../utils/number";
import Prism from "../ui/Prism";

export default function Hero() {
  const { t } = useI18n();
  const [heroStars, setHeroStars] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/plugins", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setHeroStars(typeof d?.github?.stars === "number" ? d.github.stars : null))
      .catch(() => setHeroStars(null));
  }, []);
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-black text-white">
      {/* Prism 背景：移动端与桌面端分别使用不同性能配置 */}
      {/* 移动端：低画质、DPR 上限 1.25、30 FPS、屏外暂停 */}
      <div className="block sm:hidden absolute inset-0 z-0">
        <Prism
          animationType="3drotate"
          timeScale={0.28}
          scale={4.3}
          height={2.5}
          baseWidth={4.5}
          noise={0.15}
          glow={0.5}
          hueShift={-0.14}
          colorFrequency={1.15}
          transparent={false}
          suspendWhenOffscreen={true}
          quality="low"
          maxDpr={1.25}
          fpsCap={30}
        />
      </div>
      {/* 桌面端：中画质、DPR 上限 1.5、不限 FPS、屏外暂停 */}
      <div className="hidden sm:block absolute inset-0 z-0">
        <Prism
          animationType="3drotate"
          timeScale={0.3}
          scale={4.3}
          height={2.5}
          baseWidth={4.5}
          noise={0.15}
          glow={0.5}
          hueShift={-0.14}
          colorFrequency={1.15}
          transparent={false}
          suspendWhenOffscreen={true}
          quality="medium"
          maxDpr={1.5}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="flex flex-col items-center text-center gap-6">
            <h1 className="slogan text-5xl sm:text-5xl font-semibold tracking-tight">
              {/* 移动端：部分文字 */}
              <span className="block sm:hidden">
                <TextType
                  text={["AstrBot AI", "OmniMind"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                  className="text-white"
                  style={{ textShadow: "0 0 24px rgba(255,255,255,0.28), 0 2px 10px rgba(255,255,255,0.35)" }}
                />
              </span>
              {/* 桌面端：完整内容 */}
              <span className="hidden sm:grid">
                <span className="col-start-1 row-start-1">
                  <TextType
                    text={["AstrBot AI", "We rise together", "back to the moon and beyond"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="_"
                    className="text-white"
                    style={{ textShadow: "0 0 24px rgba(255,255,255,0.28), 0 2px 10px rgba(255,255,255,0.35)" }}
                  />
                </span>
                <span className="col-start-1 row-start-1 invisible select-none pointer-events-none" aria-hidden>
                  back to the moon and beyond
                </span>
              </span>
            </h1>
            {/* 徽章太丑了，删了 */}
            <div className="hero-buttons mt-6 flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3">
              <Reveal as="span" delay={400}>
                <a href="https://docs.astrbot.app/what-is-astrbot.html" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full btn-brand text-sm font-medium transition">{t("hero.startButton")}</a>
              </Reveal>
              <Reveal as="span" delay={500}>
                <a href="https://github.com/AstrBotDevs/AstrBot" className="inline-flex items-center justify-center h-12 sm:h-11 px-5 rounded-full bg-white text-black text-sm font-medium transition hover:opacity-90" target="_blank">
                  <span>{t("hero.githubButton")}</span>
                  <span className="github-stars ml-2 inline-flex items-center text-xs text-black/70">
                    {heroStars !== null ? formatCompactNumber(heroStars) : "..."}
                  </span>
                </a>
              </Reveal>
            </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background z-[15]" />
    </section>
  );
}