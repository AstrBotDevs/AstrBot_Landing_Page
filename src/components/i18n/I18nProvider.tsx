"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import zhCN from "../../../i18n/zh-CN.json";
import enUS from "../../../i18n/en-US.json";
import jaJP from "../../../i18n/ja-JP.json";

type Locale = "zh-CN" | "en-US" | "ja-JP";
type Dict = Record<string, any>;

const DICTS: Record<Locale, Dict> = {
  "zh-CN": zhCN as Dict,
  "en-US": enUS as Dict,
  "ja-JP": jaJP as Dict,
};

function getFromDict(dict: Dict, key: string): string {
  const parts = key.split(".");
  let cur: any = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else return key;
  }
  return typeof cur === "string" ? cur : key;
}

export const I18nContext = createContext<{
  locale: Locale;
  t: (k: string) => string;
  setLocale: (l: Locale) => void;
}>({ locale: "zh-CN", t: (k) => k, setLocale: () => {} });

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-CN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("locale") as Locale | null;
      if (saved && DICTS[saved]) setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { document.documentElement.lang = locale; } catch {}
  }, [locale]);

  const t = useMemo(() => {
    const dict = DICTS[locale];
    return (k: string) => getFromDict(dict, k);
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("locale", l); } catch {}
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);


