"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { type Locale, getDict, getFromDict } from "./locale";

export const I18nContext = createContext<{
  locale: Locale;
  t: (k: string) => string;
  setLocale: (l: Locale) => void;
}>({ locale: "zh-CN", t: (k) => k, setLocale: () => {} });

export default function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "en-US");
  const router = useRouter();

  useEffect(() => {
    try { document.documentElement.lang = locale; } catch {}
  }, [locale]);

  const t = useMemo(() => {
    const dict = getDict(locale);
    return (k: string) => getFromDict(dict, k);
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("locale", l);
    } catch {}
    try {
      const maxAge = 60 * 60 * 24 * 365; 
      document.cookie = `locale=${l}; path=/; max-age=${maxAge}`;
    } catch {}
    // 刷新当前路由以让服务端重新生成 metadata（基于新的 Cookie）
    try {
      router.refresh();
    } catch {}
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);


