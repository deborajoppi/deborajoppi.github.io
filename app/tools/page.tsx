"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ToolsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
  };

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-neutral-900 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(0,0,0,0.08),transparent)]" />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6"
      >
        <motion.header variants={item} className="mb-10 text-center">
          <Link href="/" className="text-xs uppercase tracking-[0.22em] text-neutral-500 hover:text-neutral-800">
            Home
          </Link>
          <p className="mt-3 text-base md:text-lg text-neutral-700">
            Utility pages that do not need to sit on the front page.
          </p>
        </motion.header>

        <motion.div variants={item} className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-6">
          <SelectorCard href="/stats" label="stats" bg="bg-[#f4e9c5]" ring="ring-[#c5a868]" />
          <SelectorCard href="/finance" label="finance" bg="bg-[#d9e7fb]" ring="ring-[#7d9ecf]" />
        </motion.div>

        <motion.p variants={item} className="mt-10 text-xs md:text-sm text-neutral-600 text-center">
          Tip: press <kbd className="px-1 py-0.5 border rounded">G</kbd> or <kbd className="px-1 py-0.5 border rounded">F</kbd> to jump.
        </motion.p>
      </motion.main>

      <ToolShortcuts />
    </div>
  );
}

function SelectorCard({ href, label, bg, ring }: { href: string; label: string; bg: string; ring: string }) {
  return (
    <Link href={href} aria-label={`Go to ${label}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative cursor-pointer rounded-3xl border border-neutral-900/70 shadow-[6px_6px_0_0_rgba(0,0,0,0.9)] ${bg}`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-neutral-900/10" />
        <div className={`pointer-events-none absolute inset-2 rounded-2xl ring-2 ${ring} ring-offset-4 ring-offset-transparent opacity-90`} />
        <div className="relative z-10 flex h-56 md:h-60 flex-col items-center justify-center p-8">
          <div className="text-2xl md:text-3xl font-semibold tracking-wide">{label}</div>
          <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-full border border-neutral-900/50 bg-white/70 px-3 py-1 text-xs">enter →</span>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 rounded-t-3xl bg-white/20 mix-blend-soft-light" />
      </motion.div>
    </Link>
  );
}

function ToolShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      if (key === "g") window.location.href = "/stats";
      if (key === "f") window.location.href = "/finance";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
