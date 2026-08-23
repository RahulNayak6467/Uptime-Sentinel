"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Activity } from "lucide-react";

export const BrandMark = ({ compact = false }: { compact?: boolean }) => (
  <span className="inline-flex items-center gap-2.5">
    <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-[9px] border border-[#ff7759]/35 bg-[#ff7759]/12 text-[#ff8b70]">
      <span className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-[#ff9d87] to-transparent" />
      <Activity className="size-4" strokeWidth={2.2} />
    </span>
    {!compact && (
      <span className="text-[15px] font-semibold tracking-[-0.035em] text-white">
        StatusForge
      </span>
    )}
  </span>
);

export const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StatusBadge = ({
  children,
  tone = "live",
}: {
  children: ReactNode;
  tone?: "live" | "cut";
}) => {
  const tones = {
    live: "border-[#71e0b1]/25 bg-[#71e0b1]/10 text-[#85e7be]",
    cut: "border-white/10 bg-white/[.035] text-white/35",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  align?: "left" | "center";
}) => (
  <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff8b70]">
      {eyebrow}
    </p>
    <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl">
      {title}
    </h2>
    <p className={`mt-5 text-sm leading-7 text-white/46 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"}`}>
      {copy}
    </p>
  </Reveal>
);
