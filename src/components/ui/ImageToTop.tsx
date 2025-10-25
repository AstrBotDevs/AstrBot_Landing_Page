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
  const [isShow, setIsShow] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaved, setIsLeaved] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const lockRef = useRef(false);
  const isLeavingRef = useRef(false);
  const thresholdRef = useRef(threshold);

  const t120Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t390Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t1500Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2000Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = () => {
    if (lockRef.current) return;
    try {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop >= thresholdRef.current) {
        setIsShow(prev => {
          if (!prev && !isLeavingRef.current) {
            setIsLeaved(false);
          }
          return true;
        });
      } else {
        setIsShow(false);
      }
    } catch {}
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    isLeavingRef.current = isLeaving;
  }, [isLeaving]);

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    return () => {
      [t120Ref, t390Ref, t1500Ref, t2000Ref].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
    };
  }, []);

  const handleClick = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    setIsLeaving(true);
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

    t120Ref.current = setTimeout(() => {
      setIsEnding(true);
    }, 120);

    t390Ref.current = setTimeout(() => {
      setIsLeaving(false);
      setIsLeaved(true);
    }, 390);

    t1500Ref.current = setTimeout(() => {
      setIsShow(false);
    }, 1500);

    t2000Ref.current = setTimeout(() => {
      setIsLeaving(false);
      setIsEnding(false);
      setIsShow(false);
      setIsLeaved(false);
      lockRef.current = false;
    }, 2000);
  };

  const classes = [
    "back-to-top",
    isShow ? "load" : "",
    isLeaving ? "ani-leave" : "",
    isLeaved ? "leaved" : "",
    isEnding ? "ending" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const spriteHeight = frameHeight * framesCount;
  const safeHoverIndex = Math.max(0, Math.min(framesCount - 1, hoverFrameIndex));
  const safeEndingIndex = Math.max(0, Math.min(framesCount - 1, endingFrameIndex));
  const offset2 = frameHeight * safeHoverIndex + offsetFixFrame2;
  const offset3 = frameHeight * safeEndingIndex + (offsetFixFrame3 ?? offsetFixFrame2);

  return (
    <>
      <div
        className={classes}
        onClick={handleClick}
        aria-label={ariaLabel}
        title={title}
        data-hide-mobile={!showOnMobile ? "true" : "false"}
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
          transition: opacity 0.3s, right 0.8s;
          cursor: pointer;
          background-repeat: no-repeat;
        }

        .back-to-top:hover {
          opacity: 1;
        }

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
          transition: opacity 120ms ease-out;
          pointer-events: none;
          z-index: 1;
        }

        .back-to-top:hover .frame2,
        .back-to-top.ani-leave .frame2 {
          opacity: 1;
        }

        .back-to-top.ending .frame2 {
          opacity: 0;
          transition: opacity 60ms ease-in;
        }

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
          transition: opacity 0.3s;
          opacity: 0;
          pointer-events: none;
        }

        .back-to-top.load {
          right: 0;
        }

        .back-to-top.ani-leave {
          animation: ani-leave 800ms ease-in-out forwards;
        }


        @keyframes ani-leave {
          0% { right: 0; }
          100% { right: calc(-1 * var(--frame-w)); }
        }

        .back-to-top.leaved,
        .back-to-top.ending {
          pointer-events: none;
        }

        .back-to-top.leaved {
          background: none;
          transition: none;
        }

        .back-to-top.ending::after {
          opacity: 1;
          transition-delay: 0s;
        }

        @media (max-width: ${mobileBreakpoint}px) {
          .back-to-top[data-hide-mobile="true"] { display: none; }
        }

      `}</style>
    </>
  );
}

