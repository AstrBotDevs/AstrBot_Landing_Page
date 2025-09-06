"use client";

import React, { useEffect, useMemo, useState } from "react";

type OrbDef = {
  className: string;
  left: string;
  top: string;
};

export default function OrbsLayer() {
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

  const parallaxY = useMemo(() => {
    // Slight parallax: move a bit slower than content
    return -(scrollY * 0.06);
  }, [scrollY]);

  // Generate a smooth HSL color based on scroll position and orb index
  const colorFor = (index: number): string => {
    const hue = (scrollY * 0.12 + index * 28) % 360; // scroll-driven hue with per-orb phase offset
    const saturation = 70;
    const lightness = 62;
    return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
  };

  const orbs: OrbDef[] = useMemo(() => (
    [
      { className: "absolute w-4 h-4 rounded-full bg-[#60a5fa] opacity-60 shadow-lg", left: "8%", top: "3%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "26%", top: "2%" },
      { className: "absolute w-5 h-5 rounded-full bg-[#f472b6] opacity-55 shadow-lg", left: "62%", top: "3%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#34d399] opacity-60 shadow-lg", left: "84%", top: "4.7%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f59e0b] opacity-60 shadow-lg", left: "14%", top: "7%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#a78bfa] opacity-55 shadow-lg", left: "48%", top: "8.3%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "72%", top: "10.7%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#60a5fa] opacity-60 shadow-lg", left: "10%", top: "13%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f472b6] opacity-60 shadow-lg", left: "36%", top: "15.3%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#f59e0b] opacity-55 shadow-lg", left: "68%", top: "18%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#34d399] opacity-60 shadow-lg", left: "20%", top: "21%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#a78bfa] opacity-60 shadow-lg", left: "56%", top: "23%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "82%", top: "25.3%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#60a5fa] opacity-60 shadow-lg", left: "12%", top: "28%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#a78bfa] opacity-55 shadow-lg", left: "44%", top: "30.7%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#34d399] opacity-60 shadow-lg", left: "70%", top: "32.7%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f59e0b] opacity-60 shadow-lg", left: "28%", top: "35%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#22d3ee] opacity-55 shadow-lg", left: "60%", top: "38%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#f472b6] opacity-60 shadow-lg", left: "84%", top: "40.7%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#60a5fa] opacity-60 shadow-lg", left: "18%", top: "43.3%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#34d399] opacity-55 shadow-lg", left: "52%", top: "46%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#a78bfa] opacity-60 shadow-lg", left: "76%", top: "48.7%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "24%", top: "51.3%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f59e0b] opacity-60 shadow-lg", left: "58%", top: "54%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#60a5fa] opacity-55 shadow-lg", left: "80%", top: "56.7%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f472b6] opacity-60 shadow-lg", left: "14%", top: "59.3%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#34d399] opacity-60 shadow-lg", left: "46%", top: "62%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#a78bfa] opacity-60 shadow-lg", left: "72%", top: "64.7%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "30%", top: "67.3%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#60a5fa] opacity-55 shadow-lg", left: "62%", top: "70%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#f59e0b] opacity-60 shadow-lg", left: "86%", top: "75%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#34d399] opacity-60 shadow-lg", left: "22%", top: "80%" },
      { className: "absolute w-3.5 h-3.5 rounded-full bg-[#a78bfa] opacity-55 shadow-lg", left: "54%", top: "85%" },
      { className: "absolute w-4 h-4 rounded-full bg-[#f472b6] opacity-60 shadow-lg", left: "78%", top: "90%" },
      { className: "absolute w-3 h-3 rounded-full bg-[#22d3ee] opacity-60 shadow-lg", left: "26%", top: "83%" },
    ]
  ), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
      style={{ top: "calc(100vh)", transform: `translateY(${parallaxY}px)` }}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`${o.className} animate-orb-sway`}
          style={{
            left: o.left,
            top: o.top,
            animationDelay: `${-(i % 7) * 0.6}s`,
            backgroundColor: colorFor(i),
            transition: "background-color 200ms linear",
          }}
        />
      ))}
    </div>
  );
}


