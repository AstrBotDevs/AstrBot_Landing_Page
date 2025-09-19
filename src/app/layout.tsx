import type { Metadata } from "next";
import "../assets/globals.css";
import OrbsLayer from "../components/OrbsLayer";
import I18nProvider from "../components/i18n/I18nProvider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        <div className="relative">
        <OrbsLayer />
        <I18nProvider>
          <div className="relative z-20">
            {children}
          </div>
        </I18nProvider>
        </div>
      </body>
    </html>
  );
}
