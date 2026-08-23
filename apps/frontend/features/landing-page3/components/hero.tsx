"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BellRing,
  Check,
  CircleCheck,
  Clock3,
  RadioTower,
  ShieldCheck,
} from "lucide-react";
import styles from "../landing-page3.module.css";

const latency = [34, 42, 38, 55, 47, 64, 53, 69, 61, 74, 62, 70, 66, 82, 71, 78];

const ProductPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 28, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
    className="relative mx-auto w-full max-w-[650px]"
  >
    <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle,rgba(255,119,89,.15),transparent_62%)] blur-2xl" />
    <div className="overflow-hidden rounded-[18px] border border-white/12 bg-[#0b0e14]/95 shadow-[0_44px_120px_rgba(0,0,0,.55)]">
      <header className="flex h-11 items-center justify-between border-b border-white/[.07] px-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-[#71e0b1]" />
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[.18em] text-white/25">statusforge / production</span>
        <span className="flex items-center gap-1.5 text-[8px] font-medium text-[#71e0b1]">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#71e0b1]/50" />
            <span className="relative size-1.5 rounded-full bg-[#71e0b1]" />
          </span>
          LIVE
        </span>
      </header>

      <div className="grid lg:grid-cols-[154px_1fr]">
        <aside className="hidden border-r border-white/[.07] bg-[#090c11] p-3 lg:block">
          <p className="px-2 pt-1 text-[7px] font-semibold uppercase tracking-[.16em] text-white/20">Workspace</p>
          {["Overview", "Monitors", "Incidents", "Email alerts"].map((item, index) => (
            <div
              key={item}
              className={`mt-1 rounded-[7px] px-2 py-2 text-[8px] ${index === 0 ? "bg-white/[.06] text-white/75" : "text-white/28"}`}
            >
              {item}
            </div>
          ))}
          <div className="mt-8 rounded-[9px] border border-[#71e0b1]/15 bg-[#71e0b1]/[.055] p-2.5">
            <p className="text-[7px] text-[#71e0b1]">System health</p>
            <p className="mt-1 text-[9px] font-medium text-white/70">12 of 12 healthy</p>
          </div>
        </aside>

        <div className="p-4 sm:p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[7px] font-semibold uppercase tracking-[.17em] text-white/25">Operations</p>
              <h3 className="mt-1 text-sm font-semibold tracking-[-.03em] text-white/85">Everything looks healthy.</h3>
            </div>
            <span className="rounded-[6px] border border-white/[.08] px-2 py-1 text-[7px] text-white/28">Last 24 hours</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["AVAILABILITY", "99.98%", "Healthy"],
              ["P95 LATENCY", "184ms", "−12ms"],
              ["OPEN INCIDENTS", "0", "All clear"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-[9px] border border-white/[.07] bg-white/[.025] p-3">
                <p className="truncate text-[6px] font-semibold tracking-[.13em] text-white/22">{label}</p>
                <p className="mt-2 text-base font-semibold tracking-[-.04em] text-white/85 sm:text-lg">{value}</p>
                <p className="mt-1 text-[7px] text-[#71e0b1]">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-[1.45fr_.75fr]">
            <div className="relative h-[170px] overflow-hidden rounded-[9px] border border-white/[.07] bg-white/[.02] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium text-white/40">Response time</span>
                <div className="flex gap-3 text-[7px] text-white/25"><span>p50</span><span className="text-[#ff8b70]">p95</span></div>
              </div>
              <div className={`absolute inset-x-3 bottom-5 top-10 ${styles.chartGrid}`} />
              <svg viewBox="0 0 320 110" preserveAspectRatio="none" className="absolute inset-x-3 bottom-5 h-[105px] w-[calc(100%-1.5rem)]">
                <defs>
                  <linearGradient id="hero-fill-three" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#ff7759" stopOpacity=".26" />
                    <stop offset="1" stopColor="#ff7759" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 84 C30 76 40 82 66 64 S106 73 130 47 S171 62 199 39 S241 52 265 29 S295 41 320 18 L320 110 L0 110Z" fill="url(#hero-fill-three)" />
                <path d="M0 84 C30 76 40 82 66 64 S106 73 130 47 S171 62 199 39 S241 52 265 29 S295 41 320 18" fill="none" stroke="#ff8468" strokeWidth="2" />
                {latency.map((value, index) => (
                  <circle key={index} cx={(index / (latency.length - 1)) * 320} cy={105 - value} r="1.4" fill="#ffd1c7" opacity={index % 3 === 0 ? .9 : .25} />
                ))}
              </svg>
            </div>

            <div className="rounded-[9px] border border-white/[.07] bg-white/[.02] p-3">
              <p className="text-[8px] font-medium text-white/40">Recent checks</p>
              <div className="mt-3 space-y-3">
                {[
                  ["Public API", "48ms"],
                  ["Checkout", "92ms"],
                  ["Auth service", "61ms"],
                  ["TLS certificate", "Valid"],
                ].map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-[7px] text-white/38">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#71e0b1]" />
                      <span className="truncate">{name}</span>
                    </span>
                    <span className="font-mono text-[7px] text-white/25">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-7 -left-3 hidden w-44 rounded-[12px] border border-white/10 bg-[#10141b]/94 p-3 shadow-2xl backdrop-blur-xl sm:block"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-[8px] bg-[#71e0b1]/10 text-[#71e0b1]"><CircleCheck className="size-4" /></span>
        <div><p className="text-[8px] font-semibold text-white/72">Recovery confirmed</p><p className="mt-0.5 text-[7px] text-white/28">Checkout API · 2m ago</p></div>
      </div>
    </motion.div>

    <motion.div
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      className="absolute -right-3 -top-6 hidden w-40 rounded-[12px] border border-white/10 bg-[#10141b]/94 p-3 shadow-2xl backdrop-blur-xl md:block"
    >
      <div className="flex items-center justify-between"><span className="text-[7px] text-white/30">Worker queue</span><RadioTower className="size-3 text-[#88a7ff]" /></div>
      <p className="mt-2 text-xl font-semibold tracking-[-.05em] text-white/82">1,248</p>
      <p className="mt-1 text-[7px] text-[#71e0b1]">checks completed today</p>
    </motion.div>
  </motion.div>
);

const Hero = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden border-b border-white/[.07] pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#07090d]" />
      <div className={`pointer-events-none absolute inset-0 -z-10 opacity-65 ${styles.heroGrid}`} />
      <div className={`pointer-events-none absolute -left-44 -top-48 -z-10 size-[720px] rounded-full bg-[#ff6848]/12 blur-[130px] ${reduceMotion ? "" : styles.driftOne}`} />
      <div className={`pointer-events-none absolute -right-64 top-20 -z-10 size-[720px] rounded-full bg-[#5579ff]/10 blur-[140px] ${reduceMotion ? "" : styles.driftTwo}`} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,#07090d_86%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[.88fr_1.12fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] px-3 py-1.5 text-[10px] font-medium text-white/52">
            <span className="size-1.5 rounded-full bg-[#ff7759] shadow-[0_0_12px_#ff7759]" />
            Production reliability platform
            <span className="text-white/18">/</span>
            Complete V18 stack
          </div>

          <h1 className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[.96] tracking-[-.06em] text-white sm:text-6xl lg:text-[72px]">
            Reliability you can
            <span className="block bg-gradient-to-r from-[#ff8064] via-[#ffb18c] to-[#8ea9ff] bg-clip-text text-transparent">see, explain, and improve.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-white/50 sm:text-lg">
            Monitor APIs, infrastructure, certificates, DNS, ports, and inbound events from a global probe network. StatusForge correlates every signal, coordinates response, and proves recovery from one production workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="group inline-flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[#ff7759] px-5 text-sm font-semibold text-[#160704] shadow-[0_14px_40px_rgba(255,119,89,.2)] transition hover:-translate-y-0.5 hover:bg-[#ff8a70]">
              Start monitoring <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="#platform-stack" className="inline-flex h-11 items-center justify-center rounded-[9px] border border-white/12 bg-white/[.035] px-5 text-sm font-medium text-white/72 transition-colors hover:bg-white/[.07] hover:text-white">
              Explore the platform
            </Link>
          </div>

          <div className="mt-7 grid max-w-lg gap-2 sm:grid-cols-3">
            {[
              [ShieldCheck, "Secure by default"],
              [Clock3, "Global live checks"],
              [BellRing, "Multi-channel response"],
            ].map(([Icon, label]) => {
              const ItemIcon = Icon as typeof Check;
              return <span key={label as string} className="flex items-center gap-2 text-[10px] text-white/34"><ItemIcon className="size-3 text-[#71e0b1]" />{label as string}</span>;
            })}
          </div>
        </motion.div>

        <ProductPreview />
      </div>
    </section>
  );
};

export default Hero;
