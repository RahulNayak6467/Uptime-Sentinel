"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Gauge,
  MapPin,
  ScanSearch,
} from "lucide-react";

const timeline = [
  { label: "Detected", detail: "3 failed checks · 14:32:08", color: "bg-red-400" },
  { label: "Investigating", detail: "Regional traces correlated", color: "bg-amber-300" },
  { label: "Monitoring", detail: "Latency returning to baseline", color: "bg-blue-300" },
  { label: "Resolved", detail: "Recovery confirmed · 14:47:41", color: "bg-emerald-300" },
];

const CoreFeatureSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="incident-intelligence" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_55%,rgba(16,185,129,0.08),transparent_33%),radial-gradient(circle_at_85%_40%,rgba(59,130,246,0.08),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, x: -20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
            <ScanSearch className="size-3" /> Incident intelligence
          </div>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
            Every outage becomes a story you can act on.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
            UptimeSentinel connects failed checks, regional signals, alert delivery,
            and recovery into one durable timeline—without opening duplicate
            incidents every time another check fails.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              [CircleDot, "Threshold-aware detection"],
              [MapPin, "Regional degradation"],
              [Gauge, "MTTR and SLO context"],
              [CheckCircle2, "Verified recovery"],
            ].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof CircleDot;
              return (
                <div key={label as string} className="flex items-center gap-2.5 text-xs text-white/55">
                  <span className="flex size-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-emerald-300">
                    <FeatureIcon className="size-3.5" />
                  </span>
                  {label as string}
                </div>
              );
            })}
          </div>

          <button className="group mt-9 flex items-center gap-1.5 text-xs font-semibold text-white/80 transition-colors hover:text-white">
            Explore incident workflows
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="rounded-[26px] border border-white/[0.09] bg-[#090c0e] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.38)]"
        >
          <div className="overflow-hidden rounded-[19px] border border-white/[0.07] bg-[#07090b]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-50" />
                  <span className="relative size-2.5 rounded-full bg-red-400" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white/85">Checkout API outage</p>
                  <p className="mt-0.5 font-mono text-[9px] text-white/30">INC-2026-0718 · ACTIVE 15M</p>
                </div>
              </div>
              <span className="rounded-full border border-red-400/20 bg-red-400/[0.08] px-2.5 py-1 text-[9px] font-semibold text-red-300">
                SEV-1
              </span>
            </div>

            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[#090b0d] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Event timeline
                </p>
                <ol className="mt-5">
                  {timeline.map((event, index) => (
                    <li key={event.label} className="relative flex gap-3 pb-6 last:pb-0">
                      {index < timeline.length - 1 && (
                        <span className="absolute left-[4px] top-3 h-full w-px bg-white/[0.08]" />
                      )}
                      <span className={`relative z-10 mt-1 size-2.5 shrink-0 rounded-full ring-4 ring-[#090b0d] ${event.color}`} />
                      <div>
                        <p className="text-[11px] font-medium text-white/70">{event.label}</p>
                        <p className="mt-1 text-[9px] leading-4 text-white/30">{event.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-[#07090b] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                    Regional impact
                  </p>
                  <span className="font-mono text-[9px] text-amber-300/70">DEGRADED</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    ["BOM", "218 ms", "up"],
                    ["FRA", "timeout", "down"],
                    ["IAD", "304 ms", "warn"],
                  ].map(([region, latency, status]) => (
                    <div key={region} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-white/35">{region}</span>
                        <span className={`size-1.5 rounded-full ${status === "up" ? "bg-emerald-300" : status === "down" ? "bg-red-400" : "bg-amber-300"}`} />
                      </div>
                      <p className="mt-2 font-mono text-[10px] text-white/65">{latency}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-[9px] text-white/30">
                    <span>Recovery confidence</span>
                    <span className="font-mono text-emerald-300">92%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-300"
                    />
                  </div>
                  <p className="mt-3 text-[9px] leading-4 text-white/30">
                    4 consecutive successful checks across all selected regions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreFeatureSection;
