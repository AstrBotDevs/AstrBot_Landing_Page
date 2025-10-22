"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useScrollY() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    let raf = 0 as number | 0;
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0 as number | 0;
          onStoreChange();
        }) as unknown as number;
      }
    };
    // Initial read after mount
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const getSnapshot = useCallback(() => (typeof window === "undefined" ? 0 : window.scrollY || 0), []);
  const getServerSnapshot = useCallback(() => 0, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
