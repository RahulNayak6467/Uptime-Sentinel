"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Globe2, Megaphone, Radio } from "lucide-react";

const services = [
  ["API", "Operational", "99.99%"],
  ["Dashboard", "Operational", "99.98%"],
  ["Webhooks", "Operational", "99.97%"],
  ["Email delivery", "Operational", "99.96%"],
];

const StatusCommunicationSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, x: -18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/75">
            Public communication
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            One source of truth, even when something is wrong.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
            Publish current health, maintenance notices, and incident recovery
            without exposing internal monitoring data or writing the same update twice.
          </p>

          <div className="mt-8 space-y-4">
            {[
              [Globe2, "Selective public visibility", "Only explicitly published monitors leave the private workspace."],
              [Megaphone, "Incident-aware updates", "Detected and resolved events become a coherent public timeline."],
              [CheckCircle2, "Verified recovery", "Public status changes only after the configured recovery threshold."],
            ].map(([Icon, title, detail], index) => {
              const FeatureIcon = Icon as typeof Globe2;
              return (
                <motion.div
                  key={title as string}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-3"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-emerald-300">
                    <FeatureIcon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white/70">{title as string}</p>
                    <p className="mt-1 max-w-md text-[11px] leading-5 text-white/30">{detail as string}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 24, rotateX: 3 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65 }}
          className="relative"
        >
          <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle,rgba(52,211,153,.09),transparent_64%)]" />
          <div className="overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#f5f6f8] p-2 shadow-[0_35px_100px_rgba(0,0,0,.4)]">
            <div className="overflow-hidden rounded-[19px] border border-black/[0.08] bg-white text-[#111827]">
              <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#111827] text-white">
                    <Radio className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold">UptimeSentinel Cloud</p>
                    <p className="text-[7px] text-[#7c8594]">status.uptimesentinel.dev</p>
                  </div>
                </div>
                <span className="text-[8px] font-medium text-[#7c8594]">Incident history</span>
              </div>

              <div className="px-5 py-8 sm:px-8">
                <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#15803d]">
                    <CheckCircle2 className="size-3.5" /> All systems operational
                  </div>
                  <p className="mt-1 pl-5.5 text-[8px] text-[#5f6875]">Last updated moments ago</p>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border border-[#dce1e7]">
                  {services.map(([service, status, uptime], index) => (
                    <div key={service} className="flex items-center justify-between border-b border-[#eef1f4] px-4 py-3 last:border-b-0">
                      <div>
                        <p className="text-[10px] font-semibold">{service}</p>
                        <p className="mt-0.5 text-[7px] text-[#7c8594]">{uptime} uptime · 90 days</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[8px] font-medium text-[#16a34a]">
                        <span className="size-1.5 rounded-full bg-[#16a34a]" /> {status}
                      </div>
                      <div className="hidden gap-0.5 sm:flex">
                        {Array.from({ length: 28 }, (_, day) => (
                          <span key={day} className={`h-5 w-1.5 rounded-sm ${index === 2 && day === 18 ? "bg-[#fbbf24]" : "bg-[#4ade80]"}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold">Past incidents</p>
                    <span className="text-[7px] text-[#7c8594]">Last 30 days</span>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#dce1e7] px-4 py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="text-[9px] font-semibold">Elevated webhook latency</p><p className="mt-1 text-[7px] leading-3 text-[#7c8594]">Resolved after upstream capacity recovered.</p></div>
                      <span className="rounded-full bg-[#f0fdf4] px-2 py-1 text-[7px] font-medium text-[#16a34a]">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatusCommunicationSection;
