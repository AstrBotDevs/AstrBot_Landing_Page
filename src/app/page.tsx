"use client";

import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Platforms from "../components/home/Platforms";
import Providers from "../components/home/Providers";
import Business from "../components/home/Business";
import Plugins from "../components/home/Plugins";
import Community from "../components/home/Community";
import MoreThings from "../components/home/MoreThings";
import GetStarted from "../components/home/GetStarted";
import SiteFooter from "../components/home/SiteFooter";
import ImageToTop from "../components/ui/ImageToTop";
import BackToTop from "../components/ui/BackToTop";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Platforms />
      <Providers />
      <Plugins />
      <Community />
      <MoreThings />
      <GetStarted />
      <Business />
      <SiteFooter />
      {/* Mobile-only sprite button */}
      <div className="sm:hidden">
        <ImageToTop
          imageUrl="/backtotop.png"
          framesCount={3}
          hoverFrameIndex={1}
          endingFrameIndex={2}
          frameWidth={108}
          frameHeight={144}
          offsetFixFrame2={1.98}
          offsetFixFrame3={-0.5}
          frame2Scale={1.06}
          frame2ShiftX={-2.8}
          frame2ShiftY={2.4}
          threshold={200}
          showOnMobile={true}
          mobileBreakpoint={640}
        />
      </div>
      {/* Desktop-and-up modern button */}
      <div className="hidden sm:block">
        <BackToTop />
      </div>
    </div>
  );
}
