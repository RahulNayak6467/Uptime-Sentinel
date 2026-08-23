"use client";

import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import { Hero, Nav } from "./components/hero";
import { Marquee } from "./components/primitives";
import { EcosystemSection, FaqAndCta, Footer, OperationsSection, PlatformSection, SignalNetworkSection, VisionSection, WhySection } from "./components/sections";
import styles from "./landing-page2.module.css";

const LandingPageTwo = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 25, mass: .2 });

  return (
    <MotionConfig reducedMotion="user">
      <main className={`relative min-h-screen overflow-x-hidden selection:bg-[#65f2a5] selection:text-black ${styles.page}`}>
        <div className={`pointer-events-none fixed inset-0 z-[80] opacity-[.025] ${styles.noise}`} />
        <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[90] h-px origin-left bg-gradient-to-r from-[#65f2a5] to-[#75a7ff]" />
        <Nav />
        <Hero />
        <Marquee items={["Uptime monitoring", "Latency analytics", "Incident intelligence", "Email alerts", "Public status", "Multi-region", "Observability", "SLO operations"]} />
        <PlatformSection />
        <WhySection />
        <OperationsSection />
        <EcosystemSection />
        <SignalNetworkSection />
        <VisionSection />
        <FaqAndCta />
        <Footer />
      </main>
    </MotionConfig>
  );
};

export default LandingPageTwo;
