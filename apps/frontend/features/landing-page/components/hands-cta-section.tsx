"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const HandsCtaSection = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden border-b border-white/[0.07] bg-black sm:min-h-[780px]">
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 1.04 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="/landing-page/statusforge-hands-footer.png"
          alt="An organic wooden hand and a graphite technical hand connected by a monitoring pulse"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#050708_0%,rgba(5,7,8,.6)_20%,transparent_46%,rgba(0,0,0,.1)_72%,#050708_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,.2)_54%,rgba(0,0,0,.78)_100%)]" />

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-24 text-center sm:px-6 sm:pt-28"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/70">
          Close the distance between failure and recovery
        </p>
        <h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          Make every signal count.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/45 sm:text-base">
          Start with one endpoint. Build an operational picture you can trust.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,.1)] transition-transform hover:-translate-y-0.5"
          >
            Start monitoring free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#overview"
            className="flex h-11 items-center rounded-xl border border-white/[0.12] bg-black/20 px-5 text-sm font-medium text-white/60 backdrop-blur-md transition-colors hover:text-white"
          >
            View the product
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HandsCtaSection;
