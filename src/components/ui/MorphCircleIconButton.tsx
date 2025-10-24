"use client";

import React, { useRef } from "react";
import useMorphCircleHover from "../utils/useMorphCircleHover";

export interface MorphCircleIconButtonProps {
  as?: "button" | "a";
  href?: string;
  ariaLabel?: string;
  title?: string;
  size?: number;
  className?: string;
  ease?: string;
  baseColor?: string;
  buttonColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  borderColor?: string;
  glassBlur?: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

const MorphCircleIconButton: React.FC<MorphCircleIconButtonProps> = ({
  as,
  href,
  ariaLabel,
  title,
  size = 48,
  className = "",
  ease = "power3.out",
  baseColor = "var(--foreground)",
  buttonColor = "var(--background)",
  iconColor = "var(--foreground)",
  hoverIconColor = "var(--background)",
  borderColor = "var(--border-ui)",
  glassBlur = 10,
  Icon,
  iconClassName = "w-6 h-6",
  style,
  onClick,
  onFocus,
  onBlur,
}) => {
  const hostIsAnchor = (as ?? (href ? "a" : "button")) === "a";
  const hostRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const { circleRef, defaultIconRef, hoverIconRef, handleEnter, handleLeave } = useMorphCircleHover({
    hostRef: (hostRef as unknown) as React.RefObject<HTMLElement>,
    ease,
    baseColor,
    iconColor,
    hoverIconColor,
  });

  const sizeStr = `${size}px`;

  const baseClassName = [
    "relative inline-flex items-center justify-center rounded-full overflow-hidden cursor-pointer",
    className,
  ].join(" ");

  const hostStyle: React.CSSProperties = {
    width: sizeStr,
    height: sizeStr,
    background: buttonColor,
    backdropFilter: `blur(${glassBlur}px)`,
    WebkitBackdropFilter: `blur(${glassBlur}px)`,
    border: `1px solid ${borderColor}`,
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    ...style,
  };

  return hostIsAnchor ? (
    <a
      ref={hostRef as unknown as React.Ref<HTMLAnchorElement>}
      href={href}
      aria-label={ariaLabel}
      title={title}
      className={baseClassName}
      style={hostStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={(e) => {
        handleEnter();
        (onFocus as unknown as React.FocusEventHandler<HTMLAnchorElement>)?.(e);
      }}
      onBlur={(e) => {
        handleLeave();
        (onBlur as unknown as React.FocusEventHandler<HTMLAnchorElement>)?.(e);
      }}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
    >
      <span
        className="absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
        style={{ background: baseColor, willChange: "transform" }}
        aria-hidden="true"
        ref={circleRef}
      />
      <span className="relative inline-flex items-center justify-center z-[2]">
        <Icon
          className={`arrow-default absolute ${iconClassName}`}
          aria-hidden="true"
          ref={defaultIconRef}
          style={{ willChange: "transform, opacity", color: iconColor }}
        />
        <Icon
          className={`arrow-hover absolute ${iconClassName}`}
          aria-hidden="true"
          ref={hoverIconRef}
          style={{ willChange: "transform, opacity", color: hoverIconColor }}
        />
      </span>
    </a>
  ) : (
    <button
      ref={hostRef as unknown as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={ariaLabel}
      title={title}
      className={baseClassName}
      style={hostStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={(e) => {
        handleEnter();
        (onFocus as unknown as React.FocusEventHandler<HTMLButtonElement>)?.(e);
      }}
      onBlur={(e) => {
        handleLeave();
        (onBlur as unknown as React.FocusEventHandler<HTMLButtonElement>)?.(e);
      }}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
    >
      <span
        className="absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
        style={{ background: baseColor, willChange: "transform" }}
        aria-hidden="true"
        ref={circleRef}
      />
      <span className="relative inline-flex items-center justify-center z-[2]">
        <Icon
          className={`arrow-default absolute ${iconClassName}`}
          aria-hidden="true"
          ref={defaultIconRef}
          style={{ willChange: "transform, opacity", color: iconColor }}
        />
        <Icon
          className={`arrow-hover absolute ${iconClassName}`}
          aria-hidden="true"
          ref={hoverIconRef}
          style={{ willChange: "transform, opacity", color: hoverIconColor }}
        />
      </span>
    </button>
  );
};

export default MorphCircleIconButton;
