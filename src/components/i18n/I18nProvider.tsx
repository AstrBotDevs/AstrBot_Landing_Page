"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import zhCN from "../../../i18n/zh-CN.json";
import enUS from "../../../i18n/en-US.json";
import jaJP from "../../../i18n/ja-JP.json";

type Locale = "zh-CN" | "en-US" | "ja-JP";
type TranslationValue = string | TranslationDict;
type TranslationDict = { [key: string]: TranslationValue };

const DICTS: Record<Locale, TranslationDict> = {
  "zh-CN": zhCN as unknown as TranslationDict,
  "en-US": enUS as unknown as TranslationDict,
  "ja-JP": jaJP as unknown as TranslationDict,
};

function getFromDict(dict: TranslationDict, key: string): string {
  const parts = key.split(".");
  let cur: TranslationValue = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as TranslationDict)) {
      cur = (cur as TranslationDict)[p];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}

export const I18nContext = createContext<{
  locale: Locale;
  t: (k: string) => string;
  setLocale: (l: Locale) => void;
}>({ locale: "zh-CN", t: (k) => k, setLocale: () => {} });

export default function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "en-US");

  useEffect(() => {
    try { document.documentElement.lang = locale; } catch {}
  }, [locale]);

  const t = useMemo(() => {
    const dict = DICTS[locale];
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
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);


