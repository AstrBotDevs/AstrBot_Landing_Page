"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export interface UseMorphCircleHoverOptions {
  hostRef: React.RefObject<HTMLElement>;
  ease?: string;
  baseColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
}

export interface UseMorphCircleHoverReturn {
  circleRef: React.RefObject<HTMLSpanElement | null>;
  defaultIconRef: React.RefObject<SVGSVGElement | null>;
  hoverIconRef: React.RefObject<SVGSVGElement | null>;
  handleEnter: () => void;
  handleLeave: () => void;
}

export function useMorphCircleHover(options: UseMorphCircleHoverOptions): UseMorphCircleHoverReturn {
  const { hostRef, ease = "power3.out", baseColor = "var(--foreground)", iconColor = "var(--foreground)", hoverIconColor = "var(--background)" } = options;

  const circleRef = useRef<HTMLSpanElement | null>(null);
  const defaultIconRef = useRef<SVGSVGElement | null>(null);
  const hoverIconRef = useRef<SVGSVGElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const host = hostRef.current;
      if (!circle || !host) return;

      const rect = host.getBoundingClientRect();
      const { width: w, height: h } = rect;
      if (h <= 0 || w <= 0) return;

      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });

      const defaultIcon = defaultIconRef.current;
      const hoverIcon = hoverIconRef.current;

      if (defaultIcon)
        gsap.set(defaultIcon, { y: 0, opacity: 1, color: iconColor, willChange: "transform, opacity" });
      if (hoverIcon)
        gsap.set(hoverIcon, { y: Math.ceil(h + 20), opacity: 0, color: hoverIconColor, willChange: "transform, opacity" });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.2, duration: 1.2, ease, overwrite: "auto" }, 0);
      if (defaultIcon)
        tl.to(defaultIcon, { y: -(h + 8), opacity: 0, duration: 0.8, ease, overwrite: "auto" }, 0);
      if (hoverIcon)
        tl.to(hoverIcon, { y: 0, opacity: 1, duration: 0.8, ease, overwrite: "auto" }, 0);
      tlRef.current = tl;
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);
    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }
    return () => window.removeEventListener("resize", onResize);
  }, [hostRef, ease, baseColor, iconColor, hoverIconColor]);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.tweenTo(tl.duration(), { duration: 0.6, ease, overwrite: "auto" });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.tweenTo(0, { duration: 0.4, ease, overwrite: "auto" });
  };

  return { circleRef, defaultIconRef, hoverIconRef, handleEnter, handleLeave };
}

export default useMorphCircleHover;
