"use client";

import { motion, useReducedMotion } from "motion/react";
import { Activity, MapPin, Radar, Route, Server } from "lucide-react";
import styles from "../landing-page.module.css";

const regions = [
  { code: "BOM", city: "Mumbai", latency: "42 ms", position: "left-[7%] top-[18%]" },
  { code: "FRA", city: "Frankfurt", latency: "81 ms", position: "right-[7%] top-[18%]" },
  { code: "IAD", city: "Virginia", latency: "104 ms", position: "left-[3%] bottom-[18%]" },
  { code: "SIN", city: "Singapore", latency: "58 ms", position: "right-[3%] bottom-[18%]" },
];

const NetworkSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section id="network" className="relative overflow-hidden border-b border-white/[0.07] py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div initial={reduceMotion ? undefined : { opacity: 0, x: -20 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/75">Global signal network</p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">See the internet from where your users are.</h2>
          <p className="mt-5 max-w-lg text-sm leading-6 text-white/45 sm:text-base sm:leading-7">Independent regional checks distinguish a global outage from a local routing problem, then roll every signal into one authoritative state.</p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[['4', 'active regions'], ['12s', 'detection'], ['99.99%', 'network SLO']].map(([value,label]) => <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3"><p className="font-mono text-lg text-white/85">{value}</p><p className="mt-1 text-[8px] text-white/25">{label}</p></div>)}
          </div>
        </motion.div>

        <motion.div initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }} whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative mx-auto aspect-square w-full max-w-[570px]">
          <div className="absolute inset-[9%] rounded-full border border-white/[0.07]" />
          <div className="absolute inset-[23%] rounded-full border border-dashed border-white/[0.09]" />
          <div className="absolute inset-[36%] rounded-full border border-white/[0.08]" />

          <div className={`absolute inset-[9%] ${styles.orbit}`}>
            <span className="absolute left-1/2 top-0 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/20 bg-[#081012] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,.18)]"><Radar className="size-3.5"/></span>
            <span className="absolute bottom-0 left-1/2 flex size-8 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-blue-300/20 bg-[#080d13] text-blue-300"><Route className="size-3.5"/></span>
          </div>
          <div className={`absolute inset-[23%] ${styles.orbitReverse}`}>
            <span className="absolute right-0 top-1/2 flex size-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-300/20 bg-[#0d0913] text-violet-300"><Server className="size-3"/></span>
          </div>

          <div className="absolute inset-[36%] flex items-center justify-center rounded-full border border-emerald-300/20 bg-[#07100d] shadow-[0_0_80px_rgba(52,211,153,.12)]">
            <div className="text-center"><span className="mx-auto flex size-12 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300"><Activity className="size-5"/></span><p className="mt-2 text-xs font-semibold text-white/80">Global state</p><p className="mt-1 font-mono text-[8px] text-emerald-300">OPERATIONAL</p></div>
          </div>

          {regions.map((region, index) => <motion.div key={region.code} initial={reduceMotion ? undefined : { opacity: 0, y: 8 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .12 }} className={`absolute ${region.position} w-28 rounded-xl border border-white/[0.09] bg-[#0a0d0f]/90 p-3 shadow-xl shadow-black/30 backdrop-blur-xl`}><div className="flex items-center justify-between"><span className="flex items-center gap-1 font-mono text-[9px] text-white/55"><MapPin className="size-2.5 text-emerald-300"/>{region.code}</span><span className="size-1.5 rounded-full bg-emerald-300"/></div><p className="mt-2 text-[9px] text-white/30">{region.city}</p><p className="mt-1 font-mono text-[10px] text-white/65">{region.latency}</p></motion.div>)}
        </motion.div>
      </div>
    </section>
  );
};

export default NetworkSection;
