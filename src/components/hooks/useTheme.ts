"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const compute = () =>
      !!(root.classList.contains("dark") || root.getAttribute("data-theme") === "dark");

    setIsDark(compute());

    const observer = new MutationObserver(() => setIsDark(compute()));
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });

    let mql: MediaQueryList | null = null;
    const onMqlChange = () => setIsDark(compute());
    let teardownFallback: (() => void) | null = null;
    try {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", onMqlChange);
      } else {
        const onWindow = () => setIsDark(compute());
        window.addEventListener("resize", onWindow);
        window.addEventListener("focus", onWindow);
        document.addEventListener("visibilitychange", onWindow);
        teardownFallback = () => {
          window.removeEventListener("resize", onWindow);
          window.removeEventListener("focus", onWindow);
          document.removeEventListener("visibilitychange", onWindow);
        };
      }
    } catch {}

    return () => {
      observer.disconnect();
      if (mql && typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onMqlChange);
      }
      if (teardownFallback) teardownFallback();
    };
  }, []);

  return isDark;
}
