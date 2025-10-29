"use client";

import React, { useEffect, useRef, useState } from "react";

type ImageToTopProps = {
  imageUrl?: string;
  threshold?: number;
  frameWidth?: number;
  frameHeight?: number;
  framesCount?: number;
  hoverFrameIndex?: number;
  endingFrameIndex?: number;
  offsetFixFrame2?: number;
  offsetFixFrame3?: number;
  frame2Scale?: number;
  frame2ShiftX?: number;
  frame2ShiftY?: number;
  showOnMobile?: boolean;
  mobileBreakpoint?: number;
  className?: string;
  ariaLabel?: string;
  title?: string;
};

type Status = "hidden" | "visible" | "leaving";

function useScrollAbove(threshold = 200) {
  const [isAbove, setIsAbove] = useState(false);
  useEffect(() => {
    let scheduled = false;
    const read = () => (window.scrollY || document.documentElement.scrollTop || 0) >= threshold;
    const loop = () => {
      scheduled = false;
      try {
        const next = read();
        setIsAbove((prev) => (prev !== next ? next : prev));
      } catch {}
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(loop);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return isAbove;
}

export default function ImageToTop({
  imageUrl = "/backtotop.png",
  threshold = 200,
  frameWidth = 108,
  frameHeight = 150,
  framesCount = 3,
  hoverFrameIndex = 1,
  endingFrameIndex = 2,
  offsetFixFrame2 = 0,
  offsetFixFrame3,
  frame2Scale = 1,
  frame2ShiftX = 0,
  frame2ShiftY = 0,
  showOnMobile = false,
  mobileBreakpoint = 725,
  className,
  ariaLabel = "返回顶部",
  title = "返回顶部",
}: ImageToTopProps) {
  const isAbove = useScrollAbove(threshold);
  const [status, setStatus] = useState<Status>("hidden");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // toggle visible/hidden based on scroll, ignore changes while leaving
  useEffect(() => {
    setStatus(prev => {
      if (prev === "leaving") return prev;
      if (isAbove && prev === "hidden") return "visible";
      if (!isAbove && prev === "visible") return "hidden";
      return prev;
    });
  }, [isAbove]);

  const spriteHeight = frameHeight * framesCount;
  const safeHoverIndex = Math.max(0, Math.min(framesCount - 1, hoverFrameIndex));
  const safeEndingIndex = Math.max(0, Math.min(framesCount - 1, endingFrameIndex));
  const offset2 = frameHeight * safeHoverIndex + offsetFixFrame2;
  const offset3 = frameHeight * safeEndingIndex + (offsetFixFrame3 ?? offsetFixFrame2);

  const handleClick = () => {
    if (status !== "visible") return;
    setStatus("leaving");
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

  const onAnimationEnd: React.AnimationEventHandler<HTMLDivElement> = (e) => {
    // only react to container slide-out finishing
    if (status === "leaving" && e.animationName === "slide-out") {
      setStatus("hidden");
    }
  };

  const classes = [
    "back-to-top",
    status,
    className || "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <div
        ref={containerRef}
        className={classes}
        onClick={handleClick}
        onAnimationEnd={onAnimationEnd}
        aria-label={ariaLabel}
        title={title}
  data-hide-mobile={showOnMobile ? "false" : "true"}
        style={{
          "--frame-w": `${frameWidth}px`,
          "--frame-h": `${frameHeight}px`,
          "--sprite-h": `${spriteHeight}px`,
          "--offset-2": `${offset2}px`,
          "--offset-3": `${offset3}px`,
          "--frame2-scale": `${frame2Scale}`,
          "--frame2-shift-x": `${frame2ShiftX}px`,
          "--frame2-shift-y": `${frame2ShiftY}px`,
        } as React.CSSProperties}
      >
        <div className="frame2" />
      </div>
      <style jsx>{`
        .back-to-top {
          position: fixed;
          z-index: 99999;
          right: calc(-1 * var(--frame-w));
          bottom: 0;
          width: var(--frame-w);
          height: var(--frame-h);
          background: url(${imageUrl}) no-repeat 0 0;
          background-size: var(--frame-w) var(--sprite-h);
          opacity: 0.6;
          cursor: pointer;
          background-repeat: no-repeat;
          /* disable transitions; keyframes will drive motion */
          transition: none;
        }

        .back-to-top.hidden { pointer-events: none; }
        .back-to-top.visible { pointer-events: auto; animation: slide-in 800ms ease-in-out forwards; }
        .back-to-top.leaving { pointer-events: none; animation: slide-out 800ms ease-in-out forwards; }

        .back-to-top.visible:hover { opacity: 1; }

        .back-to-top .frame2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(${imageUrl}) no-repeat 0 0;
          background-size: var(--frame-w) var(--sprite-h);
          background-position: 0 calc(-1 * var(--offset-2));
          transform: translate(var(--frame2-shift-x), var(--frame2-shift-y)) scale(var(--frame2-scale));
          transform-origin: center center;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        /* hover shows frame2 overlay; leaving keeps it for the first 120ms then fades it out */
        .back-to-top.visible:hover .frame2 { animation: frame2-fade-in 120ms ease-out forwards; }
        .back-to-top.leaving .frame2 { opacity: 1; animation: frame2-fade-out 60ms ease-in 120ms forwards; }

        .back-to-top::after {
          content: "";
          position: fixed;
          z-index: 2;
          right: 0;
          bottom: 0;
          width: var(--frame-w);
          height: var(--frame-h);
          background: url(${imageUrl}) no-repeat 0 0;
          background-size: var(--frame-w) var(--sprite-h);
          background-position: 0 calc(-1 * var(--offset-3));
          opacity: 0;
          pointer-events: none;
        }

        /* show third frame immediately while leaving to avoid flashing frame1 */
        .back-to-top.leaving::after { animation: end-fade-in 60ms linear 180ms forwards; }

        @keyframes slide-in  { from { right: calc(-1 * var(--frame-w)); } to { right: 0; } }
        @keyframes slide-out { from { right: 0; }                          to { right: calc(-1 * var(--frame-w)); } }
        @keyframes frame2-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes frame2-fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes end-fade-in { from { opacity: 0; } to { opacity: 1; } }

        @media (max-width: ${mobileBreakpoint}px) {
          .back-to-top[data-hide-mobile="true"] { display: none; }
        }
      `}</style>
    </>
  );
}

