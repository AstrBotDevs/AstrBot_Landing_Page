"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { useI18n } from "../i18n/I18nProvider";
import MorphCircleIconButton from "./MorphCircleIconButton";

export default function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const size = 48;
  const ease = "power3.out";
  const baseColor = "var(--foreground)";
  const buttonColor = "var(--background)";
  const iconColor = "var(--foreground)";
  const hoverIconColor = "var(--background)";
  const borderColor = "var(--border-ui)";
  const glassBlur = 10;

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

  useEffect(() => {
  }, [size, buttonColor, borderColor]);

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
    <MorphCircleIconButton
      as="button"
      ariaLabel={label}
      title={label}
      size={size}
      ease={ease}
      baseColor={baseColor}
      buttonColor={buttonColor}
      iconColor={iconColor}
      hoverIconColor={hoverIconColor}
      borderColor={borderColor}
      glassBlur={glassBlur}
      Icon={ArrowUpIcon}
      iconClassName="w-6 h-6"
      onClick={scrollToTop}
      className={[
        "!fixed right-15 bottom-20 z-40",
        "transition-opacity transition-transform duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    />
  );
}
