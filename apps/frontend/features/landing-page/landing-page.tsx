"use client";

import { motion, MotionConfig, useScroll, useSpring } from "motion/react";
import LandingNav from "./components/landing-nav";
import HeroSection from "./components/hero-section";
import CapabilitiesSection from "./components/capabilities-section";
import IntegrationSection from "./components/integration-section";
import CoreFeatureSection from "./components/core-feature-section";
import NetworkSection from "./components/network-section";
import ReliabilitySection from "./components/reliability-section";
import StatusCommunicationSection from "./components/status-communication-section";
import FaqSection from "./components/faq-section";
import LandingFooter from "./components/landing-footer";
import HandsCtaSection from "./components/hands-cta-section";
import styles from "./landing-page.module.css";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.25,
  });

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-x-hidden bg-[#050708] text-white selection:bg-emerald-300 selection:text-black">
        <div className={`pointer-events-none fixed inset-0 z-[60] opacity-[0.025] ${styles.noise}`} />
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress }}
          className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400"
        />
        <LandingNav />
        <HeroSection />
        <CapabilitiesSection />
        <IntegrationSection />
        <CoreFeatureSection />
        <NetworkSection />
        <StatusCommunicationSection />
        <ReliabilitySection />
        <FaqSection />
        <HandsCtaSection />
        <LandingFooter />
      </main>
    </MotionConfig>
  );
};

export default LandingPage;
