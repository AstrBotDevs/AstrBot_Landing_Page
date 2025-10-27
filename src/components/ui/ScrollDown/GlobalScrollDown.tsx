"use client";

import { useEffect, useState } from "react";
import ScrollDownButton from "./ScrollDownButton";

type Props = {
  bottomOffsetPx?: number;
};

export default function GlobalScrollDown({ bottomOffsetPx = 48 }: Props) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const footer = document.querySelector("footer");
    if (!footer) {
      setHide(false);
      return;
    }

    const safeZone = Math.max(0, bottomOffsetPx + 80); 
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        setHide(vis);
      },
      { root: null, threshold: 0, rootMargin: `0px 0px -${safeZone}px 0px` }
    );
    io.observe(footer);

    const onScroll = () => {
      const rect = (footer as HTMLElement).getBoundingClientRect();
      const distFromBottom = window.innerHeight - rect.top; 
      setHide(distFromBottom > (window.innerHeight > 0 ? 0 : 0) || rect.top < window.innerHeight - safeZone);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [bottomOffsetPx]);

  if (hide) return null;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    try {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const EPS = 4; 
      const sections = Array.from(document.querySelectorAll("section[id]") as NodeListOf<HTMLElement>)
        .filter((el) => !el.closest("footer"))
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const pageTop = rect.top + (window.scrollY || 0);
          return { el, pageTop };
        })
        .sort((a, b) => a.pageTop - b.pageTop);

      if (sections.length === 0) return;

      const probeY = Math.min(window.innerHeight - 2, Math.max(2, 64 + 2));
      const probeX = Math.max(1, Math.floor(window.innerWidth / 2));
      const elAtPoint = document.elementFromPoint(probeX, probeY) as HTMLElement | null;
      const sectionAtPoint = elAtPoint?.closest("section[id]") as HTMLElement | null;

      let currentIdx = -1;
      if (sectionAtPoint) {
        currentIdx = sections.findIndex((s) => s.el === sectionAtPoint);
      }
      if (currentIdx < 0) {
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].pageTop <= scrollY + EPS) currentIdx = i;
          else break;
        }
      }

      if (currentIdx >= sections.length - 1) {
        const footer = document.querySelector("footer") as HTMLElement | null;
        if (footer) footer.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const nextIdx = Math.min(currentIdx + 1, sections.length - 1);
      sections[nextIdx].el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {}
  };

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{ bottom: bottomOffsetPx }}
      aria-hidden={false}
    >
      <div className="pointer-events-auto">
        <ScrollDownButton href="#" onClick={handleClick} />
      </div>
    </div>
  );
}
