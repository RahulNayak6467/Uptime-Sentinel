"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./primitives";

const links = [
  ["Product", "#product"],
  ["Monitoring", "#monitoring"],
  ["Architecture", "#architecture"],
  ["Platform stack", "#platform-stack"],
  ["FAQ", "#faq"],
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex h-14 max-w-7xl items-center justify-between rounded-[14px] border border-white/10 bg-[#090b10]/78 px-4 shadow-[0_18px_60px_rgba(0,0,0,.28)] backdrop-blur-xl sm:px-5">
        <Link href="/landing-page-3" aria-label="StatusForge home">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-medium text-white/48 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 text-xs font-medium text-white/48 hover:text-white sm:block">
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden h-9 items-center gap-1.5 rounded-[8px] bg-white px-3.5 text-xs font-semibold text-[#090b10] transition-transform hover:-translate-y-0.5 sm:flex"
          >
            Start monitoring <ArrowUpRight className="size-3.5" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex size-9 items-center justify-center rounded-[8px] border border-white/10 text-white/65 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute inset-x-0 top-[calc(100%+8px)] rounded-[14px] border border-white/10 bg-[#0b0d12]/96 p-2 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[8px] px-3 py-3 text-xs font-medium text-white/55 hover:bg-white/[.05] hover:text-white"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/[.07] pt-2 sm:hidden">
                <Link href="/login" className="rounded-[8px] border border-white/10 px-3 py-3 text-center text-xs text-white/65">
                  Sign in
                </Link>
                <Link href="/register" className="rounded-[8px] bg-white px-3 py-3 text-center text-xs font-semibold text-black">
                  Get started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navigation;
