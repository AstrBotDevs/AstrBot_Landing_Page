import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next"
import I18nProvider from "../components/i18n/I18nProvider";
import "../assets/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AstrBot | 多平台大模型机器人基础设施",
  description: "AstrBot —— 快速构建、部署和管理跨平台的智能聊天机器人",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "AstrBot | 多平台大模型机器人基础设施",
    description: "AstrBot —— 快速构建、部署和管理跨平台的智能聊天机器人",
    images: [
      {
        url: "/logo.webp",
        width: 800,
        height: 800,
        alt: "AstrBot Logo",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  type Locale = "zh-CN" | "en-US" | "ja-JP";
  const cookieStore = await cookies();
  const headerStore = await headers();
  const rawCookie = cookieStore.get("locale")?.value as string | undefined;
  const accept = headerStore.get("accept-language") || "";

  const normalize = (v: string | undefined): Locale | undefined => {
    if (!v) return undefined;
    if (v === "zh-CN" || v === "en-US" || v === "ja-JP") return v;
    return undefined;
  };

  const detectFromHeader = (al: string): Locale => {
    const low = al.toLowerCase();
    if (low.startsWith("zh") || low.includes(",zh")) return "zh-CN";
    if (low.startsWith("ja") || low.includes(",ja")) return "ja-JP";
    return "en-US";
  };

  const initialLocale: Locale = normalize(rawCookie) ?? detectFromHeader(accept);

  return (
    <html lang={initialLocale}>
      <body className={`antialiased`}>
        <div className="relative">
        <I18nProvider initialLocale={initialLocale}>
          <div className="relative z-20">
            {children}
          </div>
        </I18nProvider>
        <Analytics />
        </div>
      </body>
    </html>
  );
}
