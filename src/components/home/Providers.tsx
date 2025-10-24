"use client";

import React, { useEffect, useState } from "react";
import Reveal from "../ui/Reveal";
import { useI18n } from "../i18n/I18nProvider";
import LogoLoop from "../ui/LogoLoop";
import type { LogoItem } from "../ui/LogoLoop";

export default function Providers() {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    try {
      const query = '(max-width: 639.98px)'; // Tailwind sm 断点前
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
  // 302.AI 与 优云智算保留彩色，不应用滤镜
  const all: LogoItem[] = [
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/openai.svg", alt: "OpenAI", title: "OpenAI" },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
          src="https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/gemini-color.svg"
          alt="Gemini"
          title="Gemini"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      title: "Gemini",
    },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/anthropic.svg", alt: "Anthropic", title: "Anthropic" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/xai.svg", alt: "xAI", title: "xAI" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/kimi.svg", alt: "Kimi", title: "Kimi" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/deepseek.svg", alt: "DeepSeek", title: "DeepSeek" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/zhipu.svg", alt: "智谱 AI", title: "智谱 AI" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/minimax.svg", alt: "MiniMax", title: "MiniMax" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ollama.svg", alt: "Ollama", title: "Ollama" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/lmstudio.svg", alt: "LM Studio", title: "LM Studio" },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
          src="/show/tokenpony.png"
          alt="小马算力"
          title="小马算力"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      href: "https://www.tokenpony.cn/3YPyf",
      title: "小马算力",
    },
    // 优云智算（保留彩色、不要滤镜）
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain"
          src="/show/ucloud_compshare.png"
          alt="优云智算"
          title="优云智算"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      href: "https://www.compshare.cn/?ytag=GPU_YY-gh_astrbot&referral_code=FV7DcGowN4hB5UuXKgpE74",
      title: "优云智算",
    },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain"
          src="https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ai302-color.svg"
          alt="302.AI"
          title="302.AI"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      href: "https://share.302.ai/rr1M3l",
      title: "302.AI",
    },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ppio.svg", alt: "PPIO派欧云", title: "PPIO派欧云" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/siliconcloud.svg", alt: "硅基流动", title: "硅基流动" },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
          src="https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/dify-color.svg"
          alt="Dify"
          title="Dify"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      title: "Dify",
    },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/coze.svg", alt: "Coze", title: "Coze" },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
          src="https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/alibabacloud-color.svg"
          alt="阿里云百炼"
          title="阿里云百炼"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      title: "阿里云百炼",
    },
    {
      node: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast]"
          src="https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fastgpt-color.svg"
          alt="FastGPT"
          title="FastGPT"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ),
      title: "FastGPT",
    },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fishaudio.svg", alt: "FishAudio", title: "FishAudio" },
    { src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/azure.svg", alt: "Azure", title: "Azure" },
  ];
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
    <section className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16">
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
