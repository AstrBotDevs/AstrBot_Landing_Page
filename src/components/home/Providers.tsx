"use client";

import Reveal from "../Reveal";
import { useI18n } from "../i18n/I18nProvider";
import LogoLoop from "../ui/LogoLoop";

export default function Providers() {
  const { t } = useI18n();
  type ProviderItem = { name: string; src: string; href?: string };
  const items: ProviderItem[] = [
    { name: "OpenAI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/openai.svg" },
    { name: "xAI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/xai.svg" },
    { name: "Anthropic", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/anthropic.svg" },
    { name: "Ollama", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ollama.svg" },
    { name: "LM Studio", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/lmstudio.svg" },
    { name: "Gemini", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/gemini-color.svg" },
    { name: "DeepSeek", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/deepseek.svg" },
    { name: "智谱 AI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/zhipu.svg" },
    { name: "Kimi", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/kimi.svg" },
    { name: "MiniMax", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/minimax.svg" },
    { name: "FishAudio", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fishaudio.svg" },
    { name: "Azure", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/azure.svg" },
    { name: "302.AI", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ai302-color.svg", href: "https://302.ai/?ref=rr1M3l&snid=1757049012429930388_SbBUfEJs&x_collect_uid=d57a632ff7304a00880a3a0dfd293683" },
    { name: "PPIO派欧云", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ppio.svg" },
    { name: "硅基流动", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/siliconcloud.svg" },
    { name: "优云智算", src: "/show/ucloud_compshare.png", href: "https://www.compshare.cn/?ytag=GPU_YY-gh_astrbot&referral_code=FV7DcGowN4hB5UuXKgpE74" },
    { name: "Dify", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/dify-color.svg" },
    { name: "阿里云百炼", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/alibabacloud-color.svg" },
    { name: "FastGPT", src: "https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/fastgpt-color.svg" },
  ];
  // 将 provider 按轮询分成 3 组，避免每行内容完全一致
  const groups: ProviderItem[][] = [[], [], []];
  items.forEach((it, idx) => {
    groups[idx % 3].push(it);
  });
  const [group1, group2, group3] = groups.map((g) => g.map((it) => ({ src: it.src, alt: it.name, title: it.name, href: it.href })));
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8 gradient-title" delay={0}>{t("models.title")}</Reveal>
        <Reveal as="p" className="text-center mt-2 text-sm opacity-80 mb-10 sm:mb-12" delay={150}>{t("models.subtitle")}</Reveal>
        <div className="mt-6 space-y-6 sm:space-y-8">
          <Reveal delay={100}>
            <LogoLoop
              logos={group1}
              speed={130}
              direction="left"
              logoHeight={56}
              gap={48}
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
              logoHeight={56}
              gap={44}
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
              logoHeight={56}
              gap={52}
              pauseOnHover
              scaleOnHover
              fadeOut
              ariaLabel={`${t("models.title")} row 3`}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
