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
    </div>
  );
}
