"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements | React.ElementType;
  className?: string;
  children: React.ReactNode;
  /** 动画类型：上移渐显 or 纯渐显 */
  animation?: "up" | "fade";
  /** 触发后是否只执行一次 */
  once?: boolean;
  /** 动画延迟（毫秒） */
  delay?: number;
  /** IntersectionObserver 参数 */
  threshold?: number;
  rootMargin?: string;
};

export default function Reveal({
  as = "div",
  className,
  children,
  animation = "up",
  once = true,
  delay = 0,
  threshold = 0.2,
  rootMargin = "0px",
  ...rest
}: RevealProps & Record<string, unknown>) {
  const Comp = as as React.ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible && once) return; // 已可见且只执行一次

    const io = new IntersectionObserver(
      (entries) => {
        const isInView = entries[0].isIntersecting;
        if (isInView) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, once, threshold, rootMargin]);

  const animClass = animation === "fade" ? "reveal-fade" : "reveal-up";

  const cls = [
    "reveal-init",
    visible ? animClass : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const styleFromDelay: React.CSSProperties | undefined = delay
    ? { animationDelay: `${Math.max(0, delay)}ms` }
    : undefined;
  const mergedStyle = rest && rest.style
    ? { ...(rest.style as React.CSSProperties), ...(styleFromDelay || {}) }
    : styleFromDelay;

  return (
    <Comp ref={ref} className={cls} style={mergedStyle} {...rest}>
      {children}
    </Comp>
  );
}
