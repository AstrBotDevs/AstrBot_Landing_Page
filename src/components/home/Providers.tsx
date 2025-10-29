"use client";

import React, { useEffect, useMemo, useState } from "react";
import Reveal from "../ui/Reveal";
import { useI18n } from "../i18n/I18nProvider";
import LogoLoop from "../ui/LogoLoop";
import type { LogoItem } from "../ui/LogoLoop";
import providersConfig from "../../config/providers.json";

export default function Providers() {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    try {
      const query = '(max-width: 639.98px)'; 
      const mq = window.matchMedia(query);
      setIsMobile(mq.matches);
      if (typeof mq.addEventListener === 'function') {
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
      }

      const onResize = () => setIsMobile(window.matchMedia(query).matches);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    } catch {
      setIsMobile(false);
      return () => {};
    }
  }, []);
  // 从配置构建 LogoItem 列表
  const all: LogoItem[] = useMemo(() => {
    return (providersConfig as Array<{
      key: string;
      title: string;
      alt?: string;
      src: string;
      href?: string;
      keepColor?: boolean;
    }>).map((p) => {
      const common = {
        title: p.title,
        ...(p.href ? { href: p.href } : {}),
      } as Partial<LogoItem>;

      if (p.keepColor) {
        // 对需要保留彩色的项，使用自定义节点，避免被全局的 logo-mono 过滤
        return {
          ...common,
          node: (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
              src={p.src}
              alt={p.alt || p.title}
              title={p.title}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ),
        } as LogoItem;
      }

      return {
        src: p.src,
        alt: p.alt || p.title,
        title: p.title,
        ...(p.href ? { href: p.href } : {}),
      } as LogoItem;
    });
  }, []);
  // 将 provider 按轮询分成 4 组，避免每行内容完全一致
  const groups: LogoItem[][] = [[], [], [], []];
  all.forEach((it, idx) => {
    groups[idx % 4].push(it);
  });
  const [group1, group2, group3, group4] = groups;
  // 高度与间距：桌面与移动端分别配置
  const H = isMobile ? 52 : 72;
  const GAP1 = isMobile ? 36 : 56;
  const GAP2 = isMobile ? 32 : 52;
  const GAP3 = isMobile ? 38 : 60;
  const GAP4 = isMobile ? 34 : 54;
  return (
    <section id="models" className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16 bg-[var(--brand-soft)]">
      <div className="w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 gradient-title" delay={0}>{t("models.title")}</Reveal>
          <Reveal as="p" className="text-center mt-2 text-sm opacity-80 mb-10 sm:mb-12" delay={150}>{t("models.subtitle")}</Reveal>
        </div>
        <div className="mt-6 space-y-6 sm:space-y-8">
          <Reveal delay={100}>
            <LogoLoop
              logos={group1}
              speed={130}
              direction="left"
              logoHeight={H}
              gap={GAP1}
              imgClassName="logo-mono"
              revealDelay={0}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel={`${t("models.title")} row 1`}
            />
          </Reveal>
          <Reveal delay={250}>
            <LogoLoop
              logos={group2}
              speed={110}
              direction="right"
              logoHeight={H}
              gap={GAP2}
              imgClassName="logo-mono"
              revealDelay={150}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel={`${t("models.title")} row 2`}
            />
          </Reveal>
          <Reveal delay={400}>
            <LogoLoop
              logos={group3}
              speed={150}
              direction="left"
              logoHeight={H}
              gap={GAP3}
              imgClassName="logo-mono"
              revealDelay={300}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel={`${t("models.title")} row 3`}
            />
          </Reveal>
          <Reveal delay={550}>
            <LogoLoop
              logos={group4}
              speed={120}
              direction="right"
              logoHeight={H}
              gap={GAP4}
              imgClassName="logo-mono"
              revealDelay={450}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel={`${t("models.title")} row 4`}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
