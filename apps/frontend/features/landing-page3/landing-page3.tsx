"use client";

import { MotionConfig, motion, useScroll, useSpring } from "motion/react";
import Hero from "./components/hero";
import Navigation from "./components/navigation";
import {
  ArchitectureSection,
  FaqAndCta,
  Footer,
  IncidentSection,
  MonitoringSection,
  OperationsSuiteSection,
  ProductSection,
  PlatformStackSection,
  SignalStrip,
} from "./components/sections";
import styles from "./landing-page3.module.css";

const LandingPageThree = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.22 });

  return (
    <MotionConfig reducedMotion="user">
      <main className={`relative min-h-screen overflow-x-hidden selection:bg-[#ff7759] selection:text-[#190704] ${styles.page}`}>
        <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[80] opacity-[.026] ${styles.noise}`} />
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="fixed inset-x-0 top-0 z-[90] h-px origin-left bg-gradient-to-r from-[#ff7759] via-[#ffb36b] to-[#88a7ff]"
        />
        <Navigation />
        <Hero />
        <SignalStrip />
        <ProductSection />
        <MonitoringSection />
        <IncidentSection />
        <OperationsSuiteSection />
        <ArchitectureSection />
        <PlatformStackSection />
        <FaqAndCta />
        <Footer />
      </main>
    </MotionConfig>
  );
};

export default LandingPageThree;
