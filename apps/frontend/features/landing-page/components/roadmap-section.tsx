"use client";

import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, CircleDashed } from "lucide-react";
import styles from "../landing-page.module.css";

const phases = [
  ["V0—V3", "Foundation", "Checks · persistence · auth · scheduling", "complete"],
  ["V4—V6", "Reliability engine", "Workers · incidents · analytics · live UI", "active"],
  ["V7—V10", "Monitoring depth", "Rules · SSL · DNS · status pages · security", "next"],
  ["V11—V13", "Global scale", "Aggregates · regions · integrations", "planned"],
  ["V15—V18", "Production maturity", "Observability · testing · deployment · SLOs", "planned"],
];

const RoadmapSection = () => {
  const reduceMotion = useReducedMotion();
  const repeated = [...phases, ...phases];

  return (
    <section id="roadmap" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(59,130,246,.11),transparent_38%)]" />
      <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6">
        <motion.div initial={reduceMotion ? undefined : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/75">From first check to production SLO</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">A platform designed to grow into its own operations team.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/45 sm:text-base">Every phase adds reliability depth without replacing the foundation underneath it.</p>
        </motion.div>
      </div>

      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className={`flex w-max gap-4 px-4 ${styles.marquee}`}>
          {repeated.map(([version,title,detail,status], index) => <div key={`${version}-${index}`} className="w-[310px] shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="flex items-center justify-between"><span className="font-mono text-[9px] text-white/25">{version}</span><span className={`flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider ${status === 'complete' ? 'text-emerald-300' : status === 'active' ? 'text-blue-300' : 'text-white/25'}`}>{status === 'complete' ? <CheckCircle2 className="size-2.5"/> : <CircleDashed className="size-2.5"/>}{status}</span></div><h3 className="mt-5 text-base font-semibold text-white/75">{title}</h3><p className="mt-2 text-[10px] leading-4 text-white/30">{detail}</p></div>)}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
