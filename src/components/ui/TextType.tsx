"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TextTypeProps = {
  text: string[];
  typingSpeed?: number; // ms per character
  pauseDuration?: number; // ms to wait after a phrase completes
  deleteSpeed?: number; // ms per character when deleting
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  deleteSpeed = 45,
  loop = true,
  showCursor = true,
  cursorCharacter = "|",
  className = "",
}) => {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const reduced = useMemo(prefersReducedMotion, []);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (!text || text.length === 0) return;

    if (reduced) {
      // Accessibility: show the first full phrase without animation
      setDisplay(text[0]);
      return;
    }

    const current = text[index % text.length];

    if (phase === "typing") {
      if (display.length < current.length) {
        timerRef.current = window.setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1));
        }, typingSpeed) as unknown as number;
      } else {
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      timerRef.current = window.setTimeout(() => setPhase("deleting"), pauseDuration) as unknown as number;
    } else if (phase === "deleting") {
      if (display.length > 0) {
        timerRef.current = window.setTimeout(() => {
          setDisplay(display.slice(0, -1));
        }, deleteSpeed) as unknown as number;
      } else {
        if (index + 1 < text.length) {
          setIndex(index + 1);
          setPhase("typing");
        } else if (loop) {
          setIndex(0);
          setPhase("typing");
        }
      }
    }

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, index, display, phase, typingSpeed, pauseDuration, deleteSpeed, reduced]);

  return (
    <span className={className} aria-label={display}>
      {display}
      {showCursor && (
        <span
          aria-hidden
          className="inline-block select-none opacity-80 ml-0.5"
          style={{
            animation: "tt-blink 1s steps(2, start) infinite",
          }}
        >
          {cursorCharacter}
        </span>
      )}
      <style>{`
        @keyframes tt-blink { 0%, 50% { opacity: 1 } 50.01%, 100% { opacity: 0 } }
      `}</style>
    </span>
  );
};

export default TextType;
 