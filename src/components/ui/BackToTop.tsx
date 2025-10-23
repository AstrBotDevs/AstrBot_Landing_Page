"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { useI18n } from "../i18n/I18nProvider";

export default function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      try {
        setVisible(window.scrollY > 240);
      } catch {}
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    try {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {}
  };

  const label = t("backToTop") || "Back to top";

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className={[
        "fixed right-6 bottom-10 z-40 inline-flex items-center justify-center",
        "h-12 w-12 rounded-full",
        "bg-[var(--brand)] text-white shadow-lg",
        "hover:shadow-xl hover:opacity-95 active:scale-[0.98]",
        "transition-opacity transition-transform duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      <ArrowUpIcon className="w-6 h-6" aria-hidden />
    </button>
  );
}
