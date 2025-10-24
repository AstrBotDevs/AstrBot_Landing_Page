"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import MorphCircleIconButton from "../ui/MorphCircleIconButton";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Reveal from "../ui/Reveal";
import { useI18n } from "../i18n/I18nProvider";

export default function Platforms() {
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
                <MorphCircleIconButton
                  as="button"
                  ariaLabel={t("carousel.prev")}
                  size={40}
                  ease="power3.out"
                  baseColor="var(--foreground)"
                  buttonColor="var(--background)"
                  iconColor="var(--foreground)"
                  hoverIconColor="var(--background)"
                  borderColor="var(--border-ui)"
                  glassBlur={0}
                  Icon={ArrowLeftIcon}
                  iconClassName="w-5 h-5"
                  onClick={() => {
                    go(-1);
                    startAuto();
                  }}
                  className="!absolute left-3 top-1/2 -translate-y-1/2"
                />
                <MorphCircleIconButton
                  as="button"
                  ariaLabel={t("carousel.next")}
                  size={40}
                  ease="power3.out"
                  baseColor="var(--foreground)"
                  buttonColor="var(--background)"
                  iconColor="var(--foreground)"
                  hoverIconColor="var(--background)"
                  borderColor="var(--border-ui)"
                  glassBlur={0}
                  Icon={ArrowRightIcon}
                  iconClassName="w-5 h-5"
                  onClick={() => {
                    go(1);
                    startAuto();
                  }}
                  className="!absolute right-3 top-1/2 -translate-y-1/2"
                />
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
