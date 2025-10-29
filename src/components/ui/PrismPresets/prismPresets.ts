import type { PrismProps } from "../Prism";

const base: PrismProps = {
  animationType: "3drotate",
  scale: 4.3,
  height: 2.5,
  baseWidth: 4.5,
  noise: 0.15,
  glow: 0.5,
  hueShift: -0.14,
  colorFrequency: 1.15,
  transparent: false,
  suspendWhenOffscreen: true,
};

export const prismMobileConfig: PrismProps = {
  ...base,
  timeScale: 0.28,
  quality: "low",
  maxDpr: 1.25,
  fpsCap: 30,
};

export const prismDesktopConfig: PrismProps = {
  ...base,
  timeScale: 0.3,
  quality: "medium",
  maxDpr: 1.5,
};
