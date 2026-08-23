"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import AuroraBackground from "@/components/ui/aurora-background";
import UptimeSentinelOverviewPreview from "./statusforge-overview-preview";
import styles from "../landing-page.module.css";

const HeroSection = () => {
  const reduceMotion = useReducedMotion();
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "end start"],
  });
  const previewScale = useTransform(
    scrollYProgress,
    [0, 0.42, 1],
    reduceMotion ? [1, 1, 1] : [0.88, 1, 0.98],
  );
  const previewY = useTransform(
    scrollYProgress,
    [0, 0.42, 1],
    reduceMotion ? [0, 0, 0] : [72, 0, -18],
  );
  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <section
      id="overview"
      className="relative isolate overflow-hidden border-b border-white/[0.07] pt-32"
    >
      <AuroraBackground
        colorStops={["#065f46", "#2563eb", "#22d3ee"]}
        className="absolute inset-x-0 -top-36 -z-20 h-[1180px] w-full opacity-55"
      />
      <div className={`absolute inset-0 -z-10 opacity-40 ${styles.grid}`} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,8,0.05)_64%,#050708_98%)]" />

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          {...reveal}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-[11px] font-medium text-emerald-200">
            <span className="relative flex size-2">
              <span className={`absolute inset-0 rounded-full bg-emerald-400 ${styles.pulse}`} />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            Monitoring built for modern APIs
            <span className="text-emerald-200/40">·</span>
            Live dashboard and incident alerts
          </div>

          <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px]">
            Your APIs should never
            <span className="block bg-gradient-to-r from-emerald-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              fail in silence.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-white/55 sm:text-lg">
            Monitor uptime and latency, investigate every incident, and notify
            the right people when an endpoint goes down or recovers.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#060809] shadow-[0_0_45px_rgba(255,255,255,0.12)] transition-transform hover:-translate-y-0.5"
            >
              Start monitoring free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#integrations"
              className="flex h-11 items-center rounded-xl border border-white/12 bg-white/[0.04] px-5 text-sm font-medium text-white/75 backdrop-blur-md transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Explore the platform
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-white/40">
            {["No credit card", "Set up in minutes", "Recovery alerts included"].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-3 text-emerald-400" />
                  {item}
                </span>
              ),
            )}
          </div>

        </motion.div>

        <motion.div
          ref={previewRef}
          style={{ scale: previewScale, y: previewY }}
          className="relative mx-auto mt-16 max-w-[1120px] origin-top rounded-t-[28px] border border-white/10 border-b-0 bg-[#0a0d0f]/90 p-2 shadow-[0_-30px_100px_rgba(34,197,94,0.08),0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl will-change-transform"
        >
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <UptimeSentinelOverviewPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
