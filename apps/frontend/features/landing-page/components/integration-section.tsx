"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  BellRing,
  Cloud,
  Database,
  GitCommitHorizontal,
  Mail,
  MessageSquare,
  RadioTower,
  Webhook,
} from "lucide-react";
import styles from "../landing-page.module.css";

const sources = [
  { label: "Endpoints", icon: RadioTower, color: "text-cyan-300" },
  { label: "Workers", icon: Cloud, color: "text-blue-300" },
  { label: "Checks", icon: Database, color: "text-violet-300" },
];

const destinations = [
  { label: "Email", icon: Mail, color: "text-emerald-300" },
  { label: "Slack", icon: MessageSquare, color: "text-pink-300" },
  { label: "Webhooks", icon: Webhook, color: "text-amber-300" },
];

const IntegrationSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="integrations" className="relative overflow-hidden border-b border-white/[0.07] py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.10),transparent_42%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/80">
            Connected operations
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            One signal layer for your entire stack.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-6 text-white/45 sm:text-base">
            Checks flow in from every service. Context-rich alerts flow out to the
            tools your response workflow already depends on.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 min-h-[470px] max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-10">
          <div className={`absolute inset-0 opacity-35 ${styles.grid}`} />
          <svg
            viewBox="0 0 1000 460"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden size-full md:block"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="beamIn" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#22d3ee" stopOpacity="0.15" />
                <stop offset="0.55" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="beamOut" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#34d399" />
                <stop offset="0.5" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#fbbf24" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {[115, 230, 345].map((y, index) => (
              <path
                key={`in-${y}`}
                d={`M170 ${y} C310 ${y}, 330 230, 445 230`}
                fill="none"
                stroke="url(#beamIn)"
                strokeWidth="2"
                className={index === 1 ? styles.flowPathSlow : styles.flowPath}
              />
            ))}
            {[115, 230, 345].map((y, index) => (
              <path
                key={`out-${y}`}
                d={`M555 230 C675 230, 690 ${y}, 830 ${y}`}
                fill="none"
                stroke="url(#beamOut)"
                strokeWidth="2"
                className={index === 1 ? styles.flowPathSlow : styles.flowPath}
              />
            ))}
          </svg>

          <div className="relative grid min-h-[390px] items-center gap-8 md:grid-cols-[1fr_0.85fr_1fr]">
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-6">
              {sources.map((source, index) => (
                <IntegrationNode key={source.label} {...source} align="left" delay={index * 0.08} />
              ))}
            </div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="relative mx-auto flex size-40 items-center justify-center rounded-full border border-emerald-300/20 bg-[#08110e] shadow-[0_0_70px_rgba(52,211,153,0.13)]"
            >
              <span className="absolute inset-3 rounded-full border border-dashed border-emerald-300/15" />
              <span className="absolute inset-7 rounded-full border border-emerald-300/10" />
              <div className="relative flex flex-col items-center">
                <span className="flex size-11 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                  <Activity className="size-5" />
                </span>
                <strong className="mt-2 text-sm font-semibold text-white">UptimeSentinel</strong>
                <span className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-emerald-300/50">
                  Signal engine
                </span>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-6">
              {destinations.map((destination, index) => (
                <IntegrationNode key={destination.label} {...destination} align="right" delay={index * 0.08 + 0.3} />
              ))}
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.07] pt-6 text-[10px] text-white/35 md:mt-0">
            <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
              <BellRing className="size-3 text-emerald-300" /> Deduplicated alerts
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
              <GitCommitHorizontal className="size-3 text-blue-300" /> Auditable delivery
            </span>
            <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
              HMAC-signed webhooks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const IntegrationNode = ({
  label,
  icon: Icon,
  color,
  align,
  delay,
}: {
  label: string;
  icon: typeof Mail;
  color: string;
  align: "left" | "right";
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: align === "left" ? -14 : 14 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay }}
    className={`flex flex-col items-center gap-2 md:flex-row ${align === "right" ? "md:flex-row-reverse" : ""}`}
  >
    <span className={`flex size-12 items-center justify-center rounded-xl border border-white/10 bg-[#0b0e11] shadow-xl shadow-black/20 ${color}`}>
      <Icon className="size-5" />
    </span>
    <span className="hidden text-[10px] font-medium uppercase tracking-[0.12em] text-white/30 lg:block">
      {label}
    </span>
  </motion.div>
);

export default IntegrationSection;
