"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Overview", href: "#overview" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Integrations", href: "#integrations" },
  { label: "Network", href: "#network" },
  { label: "FAQ", href: "#faq" },
];

const LandingNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#080b0d]/75 px-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
        <Link href="#overview" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <Activity className="size-4" strokeWidth={2.4} />
          </span>
          <span className="text-sm font-semibold tracking-[-0.02em] text-white">
            UptimeSentinel
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-white/55 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-9 items-center px-3 text-xs font-medium text-white/55 transition-colors hover:text-white sm:flex"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-white px-3.5 text-xs font-semibold text-[#07090a] transition-transform hover:-translate-y-0.5 sm:flex"
          >
            Start monitoring
            <ArrowUpRight className="size-3.5" />
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/60 md:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute inset-x-0 top-[calc(100%+8px)] rounded-2xl border border-white/10 bg-[#080b0d]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-xs font-medium text-white/55 hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-xs font-medium text-white/55 hover:bg-white/[0.05] hover:text-white sm:hidden"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black sm:hidden"
            >
              Start monitoring <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default LandingNav;
