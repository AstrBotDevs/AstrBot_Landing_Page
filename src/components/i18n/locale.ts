import zhCN from "../../../i18n/zh-CN.json";
import enUS from "../../../i18n/en-US.json";
import jaJP from "../../../i18n/ja-JP.json";

export type Locale = "zh-CN" | "en-US" | "ja-JP";
export type TranslationValue = string | TranslationDict;
export type TranslationDict = { [key: string]: TranslationValue };

export const OG_LOCALE_MAP: Record<Locale, string> = {
  "zh-CN": "zh_CN",
  "en-US": "en_US",
  "ja-JP": "ja_JP",
};

const DICTS: Record<Locale, TranslationDict> = {
  "zh-CN": zhCN as unknown as TranslationDict,
  "en-US": enUS as unknown as TranslationDict,
  "ja-JP": jaJP as unknown as TranslationDict,
};

export function getDict(locale: Locale): TranslationDict {
  return DICTS[locale];
}

export function getFromDict(dict: TranslationDict, key: string): string {
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

export function normalizeLocale(v?: string): Locale | undefined {
  if (!v) return undefined;
  if (v === "zh-CN" || v === "en-US" || v === "ja-JP") return v;
  return undefined;
}

export function detectLocaleFromAccept(al: string): Locale {
  const low = al.toLowerCase();
  if (low.startsWith("zh") || low.includes(",zh")) return "zh-CN";
  if (low.startsWith("ja") || low.includes(",ja")) return "ja-JP";
  return "en-US";
}

export function getSiteMeta(locale: Locale): { title: string; description: string } {
  const dict = DICTS[locale];
  const title = getFromDict(dict, "site.title");
  const description = getFromDict(dict, "site.description");
  return {
    title: title === "site.title" ? "AstrBot" : title,
    description:
      description === "site.description"
        ? "AstrBot — Multi-platform LLM Bot Infrastructure"
        : description,
  };
}
