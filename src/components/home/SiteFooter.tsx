"use client";

import { useI18n } from "../i18n/I18nProvider";
import { HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden border-t border-ui" style={{ backgroundColor: "var(--footer-bg)" }}>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="AstrBot Logo"
                width={24}
                height={24}
                className="h-6 w-6"
                priority={false}
              />
              <span>AstrBot</span>
            </h2>
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
                <li><a href="mailto:community@astrbot.app">{t("footer.contact")}</a></li>
                <li><a href="https://github.com/AstrBotDevs/AstrBot/issues">{t("footer.issues")}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm opacity-70">
          <p>© {new Date().getFullYear()} AstrBot. {t("footer.copyright")}</p>
          <p className="mt-2 inline-flex items-center gap-2">
            <span>{t("footer.madeWith")}</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
