import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

type Entry = { url: string; lastmod?: string };

async function fetchSitemap(): Promise<string> {
  const res = await fetch("https://blog.astrbot.app/sitemap.xml", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  return await res.text();
}

type UrlNode = { loc?: string; lastmod?: string };
type UrlSet = { url?: UrlNode | UrlNode[] };
type SiteMapNode = { loc?: string };
type SiteMapIndex = { sitemap?: SiteMapNode | SiteMapNode[] };

async function parseSitemap(xml: string): Promise<Entry[]> {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const obj = parser.parse(xml);

  const collectFromUrlset = (urlset: UrlSet): Entry[] => {
    const urls: UrlNode[] = Array.isArray(urlset?.url) ? urlset.url : urlset?.url ? [urlset.url] : [];
    return urls
      .map((u: UrlNode) => ({ url: String(u?.loc || "").trim(), lastmod: u?.lastmod ? String(u.lastmod).trim() : undefined }))
      .filter((e: Entry) => !!e.url);
  };

  const smi: SiteMapIndex | undefined = obj?.sitemapindex;
  if (smi?.sitemap) {
    const smList: SiteMapNode[] = Array.isArray(smi.sitemap) ? smi.sitemap : [smi.sitemap];
    const xmlList = await Promise.all(
      smList.map(async (sm: SiteMapNode) => {
        const loc = String(sm?.loc || "").trim();
        if (!loc) return "";
        try {
          const res = await fetch(loc, { cache: "no-store" });
          return res.ok ? await res.text() : "";
        } catch {
          return "";
        }
      })
    );
    const all: Entry[] = [];
    for (const x of xmlList) {
      if (!x) continue;
      try {
        const o: { urlset?: UrlSet } = parser.parse(x);
        if (o?.urlset) all.push(...collectFromUrlset(o.urlset));
      } catch {}
    }
    return all;
  }

  const us: UrlSet | undefined = obj?.urlset;
  if (us) {
    return collectFromUrlset(us);
  }

  return [];
}

async function fetchTitle(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;
    const html = await res.text();
    const $ = cheerio.load(html);
    const og = $('meta[property="og:title"]').attr('content') || $('meta[name="og:title"]').attr('content');
    if (og && og.trim()) return cleanupTitle(decodeHtml(og.trim()));
    const t = $('title').first().text();
    if (t && t.trim()) return cleanupTitle(decodeHtml(t.trim()));
  } catch {}
  return undefined;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanupTitle(t: string): string {
  const parts = t.split(" - ");
  return parts.length > 1 ? parts[0] : t;
}

export async function GET() {
  try {
    const xml = await fetchSitemap();
    const parsed = await parseSitemap(xml);
    const entries: Entry[] = parsed
      .filter((e: Entry) => {
        try {
          const u = new URL(e.url);
          if (!u.pathname.startsWith("/posts/")) return false;
          const normalized = u.pathname.replace(/\/+$/g, "");
          // 排除根链接 /posts 和 /posts/
          if (normalized === "/posts") return false;
          return true;
        } catch {
          return false;
        }
      });

    entries.sort((a: Entry, b: Entry) => {
      const ta = a.lastmod ? Date.parse(a.lastmod) : 0;
      const tb = b.lastmod ? Date.parse(b.lastmod) : 0;
      return tb - ta;
    });

    const top = entries.slice(0, 4);
    const withTitles = await Promise.all(
      top.map(async (e: Entry) => {
        const title = await fetchTitle(e.url);
        return { url: e.url, lastmod: e.lastmod, title: title ?? slugToTitle(e.url) };
      })
    );

    return new NextResponse(JSON.stringify({ items: withTitles }), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "s-maxage=1800, stale-while-revalidate=1800",
      },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "fetch_failed";
    return new NextResponse(JSON.stringify({ error: message }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 500,
    });
  }
}

function slugToTitle(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    return last
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}
