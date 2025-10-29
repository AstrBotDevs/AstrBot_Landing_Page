import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Entry = { url: string; lastmod?: string };

async function fetchSitemap(): Promise<string> {
  const res = await fetch("https://blog.astrbot.app/sitemap.xml", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  return await res.text();
}

function parseSitemap(xml: string): Entry[] {
  const entries: Entry[] = [];
  const urlRe = /<url>([\s\S]*?)<\/url>/gi;
  let m: RegExpExecArray | null;
  while ((m = urlRe.exec(xml))) {
    const block = m[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/i);
    if (!locMatch) continue;
    const url = locMatch[1].trim();
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1]?.trim();
    entries.push({ url, lastmod });
  }
  return entries;
}

async function fetchTitle(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;
    const html = await res.text();
    // Prefer og:title
    const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i)?.[1];
    if (og) return decodeHtml(og.trim());
    const t = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    if (t) return cleanupTitle(decodeHtml(t.trim()));
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
    const entries = parseSitemap(xml)
      .filter((e) => {
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

    entries.sort((a, b) => {
      const ta = a.lastmod ? Date.parse(a.lastmod) : 0;
      const tb = b.lastmod ? Date.parse(b.lastmod) : 0;
      return tb - ta;
    });

    const top = entries.slice(0, 4);
    const withTitles = await Promise.all(
      top.map(async (e) => {
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
