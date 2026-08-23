"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const questions = [
  ["What can UptimeSentinel monitor?", "Public HTTP and HTTPS endpoints are the foundation. The product vision extends the same monitoring model to SSL certificate expiry, DNS records, and regional availability."],
  ["How are incidents created?", "A threshold-aware state machine opens one incident after qualifying failures, ignores repeated DOWN checks, and resolves only after the configured recovery threshold is satisfied."],
  ["How does UptimeSentinel avoid duplicate alerts?", "Incident state and notification intent are stored durably. Repeated failures update the same incident rather than creating new incidents or sending the same notification repeatedly."],
  ["Can checks run from multiple regions?", "The full product vision includes independently deployed regional workers, regional latency views, and a global UP, DOWN, or DEGRADED state."],
  ["Which alert channels are supported?", "Email is the first delivery channel. Slack, Discord, and HMAC-signed generic webhooks are part of the integration roadmap."],
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-b border-white/[0.07] py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Questions, answered</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-white">The important details.</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/35">Clear product boundaries are part of reliable software.</p>
        </div>

        <div className="border-t border-white/[0.09]">
          {questions.map(([question, answer], index) => {
            const open = openIndex === index;
            return (
              <div key={question} className="border-b border-white/[0.09]">
                <button type="button" onClick={() => setOpenIndex(open ? -1 : index)} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span className="text-sm font-medium text-white/70">{question}</span>
                  <ChevronDown className={`size-4 shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="max-w-2xl pb-5 text-xs leading-6 text-white/35">{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
