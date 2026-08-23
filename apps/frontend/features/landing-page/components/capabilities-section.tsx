"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  BellRing,
  Braces,
  ChartNoAxesCombined,
  Globe2,
  LockKeyhole,
  RadioTower,
} from "lucide-react";
import SpotlightCard from "./spotlight-card";
import {
  AlertRoutingVisual,
  BentoAnalyticsVisual,
  CertificateGauge,
  RegionalScanVisual,
  StatusBarsVisual,
} from "./bento-visuals";

const CapabilitiesSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="capabilities" className="relative border-b border-white/[0.07] py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/75">One operational surface</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">Everything between a check and a confident recovery.</h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/45 sm:text-base">Monitoring depth without dashboard sprawl. Every capability feeds the same incident and analytics model.</p>
        </motion.div>

        <div className="mt-14 grid auto-rows-[230px] gap-4 md:grid-cols-6">
          <SpotlightCard className="row-span-2 md:col-span-4" spotlightColor="rgba(59,130,246,0.15)">
            <div className="relative z-10 p-6 sm:p-8">
              <FeatureLabel icon={ChartNoAxesCombined} label="Live analytics" />
              <h3 className="mt-4 max-w-sm text-2xl font-semibold tracking-[-0.035em] text-white">See latency become an incident before it becomes a complaint.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/40">Time-window analytics, uptime trends, response percentiles, and regional context share one timeline.</p>
            </div>
            <BentoAnalyticsVisual />
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" spotlightColor="rgba(251,191,36,0.13)">
            <div className="p-6"><FeatureLabel icon={LockKeyhole} label="SSL & DNS" /><h3 className="mt-4 text-lg font-semibold text-white">Know what expires and what changed.</h3><CertificateGauge /></div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" spotlightColor="rgba(52,211,153,0.13)">
            <div className="p-6"><FeatureLabel icon={BellRing} label="Alert routing" /><h3 className="mt-4 text-lg font-semibold text-white">One event. Every required channel.</h3><AlertRoutingVisual /></div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" spotlightColor="rgba(167,139,250,0.13)">
            <div className="p-6"><FeatureLabel icon={Braces} label="Health rules" /><div className="mt-5 rounded-xl border border-white/[0.07] bg-black/25 p-4 font-mono text-[9px] leading-5 text-white/35">{[["expect","status 200..299"],["timeout","5s"],["fail_after","3 checks"],["recover_after","2 checks"]].map(([key,value],index) => <motion.p key={key} initial={reduceMotion ? undefined : { opacity: 0, x: -5 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index*.12 }}><span className="text-violet-300">{key}</span> {value}{index === 3 && <span className="ml-1 inline-block h-3 w-px animate-pulse bg-violet-300"/>}</motion.p>)}</div></div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" spotlightColor="rgba(34,211,238,0.13)">
            <div className="p-6"><FeatureLabel icon={Globe2} label="Public status" /><h3 className="mt-4 text-lg font-semibold text-white">Communicate without another tool.</h3><StatusBarsVisual /></div>
          </SpotlightCard>

          <SpotlightCard className="md:col-span-2" spotlightColor="rgba(248,113,113,0.11)">
            <div className="p-6"><FeatureLabel icon={RadioTower} label="Multi-region" /><h3 className="mt-4 text-lg font-semibold text-white">Outage or geography? Know the difference.</h3><RegionalScanVisual /></div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

const FeatureLabel = ({ icon: Icon, label }: { icon: typeof BellRing; label: string }) => (
  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35"><span className="flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-emerald-300"><Icon className="size-3.5" /></span>{label}</div>
);

export default CapabilitiesSection;
