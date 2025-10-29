"use client";

import React, { useRef, useEffect, CSSProperties } from 'react';

type CSSVars = { [key: `--${string}`]: string | number };

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  containerSize = '80vmin',
  lineColor = '#efefef',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const centersRef = useRef<Array<{ x: number; y: number }>>([]);
  const roRef = useRef<ResizeObserver | null>(null);
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null); // client 坐标
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLSpanElement>('span');
    const computeCenters = () => {
      const contRect = container.getBoundingClientRect();
      const centers: Array<{ x: number; y: number }> = [];
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        centers.push({ x: r.left - contRect.left + r.width / 2, y: r.top - contRect.top + r.height / 2 });
      });
      centersRef.current = centers;
    };

    const schedule = () => {
      if (rafIdRef.current != null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        const lp = latestPointerRef.current;
        if (!lp) return;

        const contRect = container.getBoundingClientRect();
        const px = lp.x - contRect.left;
        const py = lp.y - contRect.top;

        const centers = centersRef.current;
        if (centers.length !== items.length) computeCenters();

        items.forEach((item, idx) => {
          const c = centers[idx];
          if (!c) return;
          const dx = px - c.x;
          const dy = py - c.y;
          const hyp = Math.hypot(dy, dx) || 1;
          const deg = (Math.acos(dx / hyp) * 180) / Math.PI * (py > c.y ? 1 : -1);
          item.style.setProperty('--rotate', `${deg}deg`);
        });
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      latestPointerRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const ro = new ResizeObserver(() => {
      computeCenters();
      if (latestPointerRef.current) schedule();
    });
    ro.observe(container);
    roRef.current = ro;

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    computeCenters();
    if (items.length) {
      const contRect = container.getBoundingClientRect();
      const mid = Math.floor(items.length / 2);
      const center = centersRef.current[mid];
      if (center) {
        latestPointerRef.current = { x: center.x + contRect.left, y: center.y + contRect.top };
        schedule();
      }
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove as EventListener);
      const id = rafIdRef.current; if (id != null) cancelAnimationFrame(id);
      rafIdRef.current = null;
      ro.disconnect();
      roRef.current = null;
    };
  }, []);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className="block origin-center"
      style={{
        backgroundColor: lineColor,
        width: lineWidth,
        height: lineHeight,
        ['--rotate']: `${baseAngle}deg`,
        transform: 'rotate(var(--rotate))',
        willChange: 'transform'
      } as CSSProperties & CSSVars}
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`grid place-items-center ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style
      }}
    >
      {spans}
    </div>
  );
};

export default MagnetLines;
