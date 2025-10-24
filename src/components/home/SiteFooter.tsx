"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useScrollY } from "../hooks/useScrollY";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function SiteFooter() {
  const { t } = useI18n();
  const scrollY = useScrollY();
  const footerRef = useRef<HTMLElement | null>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
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
