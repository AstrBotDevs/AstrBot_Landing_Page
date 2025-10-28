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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLSpanElement>('span');

    let latestPointer: { x: number; y: number } | null = null;
    let animationFrameId: number | null = null;

    const updateItemsRotation = () => {
      if (!latestPointer) {
        animationFrameId = null;
        return;
      }

      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const b = latestPointer!.x - centerX;
        const a = latestPointer!.y - centerY;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r = ((Math.acos(b / c) * 180) / Math.PI) * (latestPointer!.y > centerY ? 1 : -1);

        item.style.setProperty('--rotate', `${r}deg`);
      });

      animationFrameId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      latestPointer = { x: e.clientX, y: e.clientY };
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateItemsRotation);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Initialize with a sensible default: point at the middle span's center
    if (items.length) {
      const middleIndex = Math.floor(items.length / 2);
      const rect = items[middleIndex].getBoundingClientRect();
      latestPointer = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      animationFrameId = window.requestAnimationFrame(updateItemsRotation);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove as EventListener);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
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
