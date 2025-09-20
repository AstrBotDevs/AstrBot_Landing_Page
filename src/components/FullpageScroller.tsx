"use client";

import React from "react";

type FullpageScrollerProps = {
  slides: Array<React.ReactNode>;
  demo?: (position: number) => React.ReactNode;
  demoRange?: { startIndex: number; endIndex: number };
  className?: string;
  style?: React.CSSProperties;
  initialIndex?: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sign(value: number, epsilon = 0): number {
  if (value > epsilon) return 1;
  if (value < -epsilon) return -1;
  return 0;
}

function interval(value: number, begin: number, end: number): number {
  if (value < begin) return begin - value;
  if (value > end) return end - value;
  return 0;
}

/**
 * A two-track fullpage scroller similar to the provided Vue example.
 * - Main track translates by -position * 100vh.
 * - Demo track is fixed and only translates when position is outside demoRange.
 */
export default function FullpageScroller({
  slides,
  demo,
  demoRange,
  className,
  style,
  initialIndex = 0,
}: FullpageScrollerProps) {
  const total = slides.length;
  const [position, setPosition] = React.useState<number>(clamp(initialIndex, 0, Math.max(0, total - 1)));
  const [moving, setMoving] = React.useState<boolean>(false);

  const lastMoveRef = React.useRef<number>(0);
  const startYRef = React.useRef<number>(0);
  const lastYRef = React.useRef<number>(0);
  const posRef = React.useRef<number>(position);
  posRef.current = position;

  const restrict = React.useCallback((value: number) => {
    return clamp(value, 0, Math.max(0, total - 1));
  }, [total]);

  const move = React.useCallback((offset: number) => {
    const next = restrict(Math.round(posRef.current + offset));
    if (next !== posRef.current) setPosition(next);
  }, [restrict]);

  const isMasked = React.useCallback((target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    const el = target.closest("a,button,input,textarea,select,[data-scroll-mask]");
    return !!el;
  }, []);

  const findScrollable = React.useCallback((target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof HTMLElement)) return null;
    // Prefer explicit masked container
    const masked = target.closest('[data-scroll-mask]') as HTMLElement | null;
    const el = masked ?? target;
    let node: HTMLElement | null = el as HTMLElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      const canOverflow = /(auto|scroll)/.test(style.overflowY);
      if (canOverflow && node.scrollHeight > node.clientHeight + 1) return node;
      node = node.parentElement as HTMLElement | null;
    }
    return null;
  }, []);

  const canScrollWithin = React.useCallback((scroller: HTMLElement, deltaY: number): boolean => {
    if (!scroller) return false;
    const top = scroller.scrollTop;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const epsilon = 8; // allow section switch when within 8px of edges
    if (deltaY > 0) {
      // scrolling down
      return top < max - epsilon;
    } else if (deltaY < 0) {
      // scrolling up
      return top > epsilon;
    }
    return false;
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        move(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  // Wheel navigation
  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY;
      if (e.ctrlKey || e.shiftKey) return;
      if (isMasked(e.target)) {
        const scroller = findScrollable(e.target);
        if (scroller && canScrollWithin(scroller, deltaY)) {
          return;
        }
        const now = Date.now();
        if (now - lastMoveRef.current >= 80) {
          move(Math.sign(deltaY));
        }
        lastMoveRef.current = now;
        return;
      }
      if (Math.abs(deltaY) < 50) return;
      const now = Date.now();
      if (now - lastMoveRef.current >= 100) {
        move(Math.sign(deltaY));
      }
      lastMoveRef.current = now;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel as EventListener);
  }, [isMasked, findScrollable, canScrollWithin, move]);

  // Touch navigation
  React.useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      setMoving(true);
      const y = e.changedTouches[0]?.clientY ?? 0;
      startYRef.current = y;
      lastYRef.current = y;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!moving) return;
      const clientY = e.changedTouches[0]?.clientY ?? 0;
      const deltaYpx = lastYRef.current - clientY; // >0 means moving up the page (scroll down)
      if (isMasked(e.target)) {
        const scroller = findScrollable(e.target);
        if (scroller && canScrollWithin(scroller, deltaYpx)) {
          // Let inner scroller consume touch move
          lastYRef.current = clientY;
          return;
        }
        // Fallthrough to drive fullpage when inner cannot scroll further
      }
      const delta = deltaYpx / (window.innerHeight || 1);
      const destination = posRef.current + delta;
      const clamped = restrict(destination);
      setPosition(clamped);
      if (clamped === destination) {
        // do not prevent default at the top or bottom
        e.preventDefault();
      }
      lastYRef.current = clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      setMoving(false);
      const clientY = e.changedTouches[0]?.clientY ?? 0;
      const deltaY = startYRef.current - clientY;
      const now = Date.now();
      if (now - lastMoveRef.current >= 100) {
        // snap before deciding the next section
        const snapPos = posRef.current - (lastYRef.current - startYRef.current) / (window.innerHeight || 1);
        setPosition(restrict(snapPos));
        move(sign(deltaY, 50));
      }
      lastMoveRef.current = now;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("touchend", onTouchEnd as EventListener);
    };
  }, [moving, isMasked, move, restrict]);

  // External controls via CustomEvent
  React.useEffect(() => {
    const onMove = (e: Event) => {
      const ce = e as CustomEvent<number>;
      const delta = typeof ce.detail === "number" ? ce.detail : 0;
      if (delta) move(delta);
    };
    const onGo = (e: Event) => {
      const ce = e as CustomEvent<number>;
      const index = typeof ce.detail === "number" ? ce.detail : posRef.current;
      setPosition(restrict(index));
    };
    window.addEventListener("fullpage:move", onMove as EventListener);
    window.addEventListener("fullpage:go", onGo as EventListener);
    return () => {
      window.removeEventListener("fullpage:move", onMove as EventListener);
      window.removeEventListener("fullpage:go", onGo as EventListener);
    };
  }, [move, restrict]);

  const mainStyle = React.useMemo<React.CSSProperties>(() => ({
    transform: `translateY(${-position * 100}vh)`,
  }), [position]);

  const demoStyle = React.useMemo<React.CSSProperties>(() => {
    if (!demoRange) return {};
    const off = interval(position, demoRange.startIndex, demoRange.endIndex);
    return { transform: `translateY(${off * 100}vh)` };
  }, [position, demoRange]);

  return (
    <div className={`fps-container${moving ? " moving" : ""}${className ? ` ${className}` : ""}`} style={style}>
      <div className="fps-track fps-track-main" style={mainStyle}>
        {slides.map((child, i) => (
          <div key={i} className="fps-screen">
            {child}
          </div>
        ))}
      </div>
      {typeof demo === "function" && (
        <div className="fps-track fps-track-demo" style={demoStyle}>
          {demo(position)}
        </div>
      )}
    </div>
  );
}


