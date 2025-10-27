"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import MorphCircleIconButton from "../MorphCircleIconButton";

export interface ScrollDownButtonProps {
  href?: string;
  size?: number;
  ariaLabel?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  buttonColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  borderColor?: string;
  glassBlur?: number;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const ScrollDownButton: React.FC<ScrollDownButtonProps> = ({
  href = "#features",
  size = 48,
  ariaLabel = "Scroll down",
  className = "",
  ease = "power3.out",
  baseColor = "var(--foreground)",
  buttonColor = "var(--background)",
  iconColor = "var(--foreground)",
  hoverIconColor = "var(--background)",
  borderColor = "var(--border-ui)",
  glassBlur = 10,
  onClick,
}) => {
  const rippleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const rippleTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const setupRipple = () => {
      rippleTlRef.current?.kill();
      const rings = rippleRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!rings.length) return;

      gsap.set(rings, { opacity: 0, scale: 1, borderColor: baseColor });
      const totalDur = 1.8;
      const offset = 0.6;
      const rtl = gsap.timeline({ repeat: -1 });
      rings.forEach((el, i) => {
        const at = i * offset;
        rtl.to(el, { opacity: 0.35, duration: 0.25, ease }, at);
        rtl.to(el, { scale: 2.2, opacity: 0, duration: totalDur, ease }, at);
      });
      rippleTlRef.current = rtl;
    };

    setupRipple();
    return () => {
      rippleTlRef.current?.kill();
      rippleTlRef.current = null;
    };
  }, [ease, baseColor]);

  const defaultHandleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sizeStr = `${size}px`;

  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: sizeStr, height: sizeStr }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            rippleRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: sizeStr,
            height: sizeStr,
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: baseColor,
            opacity: 0,
          }}
        />
      ))}

      <MorphCircleIconButton
        as="a"
        href={href}
        ariaLabel={ariaLabel}
        size={size}
        ease={ease}
        baseColor={baseColor}
        buttonColor={buttonColor}
        iconColor={iconColor}
        hoverIconColor={hoverIconColor}
        borderColor={borderColor}
        glassBlur={glassBlur}
        Icon={ArrowDownIcon}
        iconClassName="w-7 h-7"
        onClick={(onClick ?? defaultHandleClick) as React.MouseEventHandler<HTMLAnchorElement>}
        className={className}
      />
    </span>
  );
};

export default ScrollDownButton;
