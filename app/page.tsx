"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
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
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(0,0,0,0.08),transparent)]" />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6"
      >
        {/* Header */}
        <motion.header variants={item} className="mb-10 text-center">
          <p className="mt-3 text-base md:text-lg text-neutral-700">
            What would you like to see? 🙂
          </p>
        </motion.header>

        {/* Cards */}
        <motion.div variants={item} className="grid w-full max-w-3xl grid-cols-1 gap-6">
          <SelectorCard href="/science" label="science" bg="bg-[#cfe7de]" ring="ring-[#7aa69a]" />
        </motion.div>

        {/* Tip */}
        <motion.p variants={item} className="mt-10 text-xs md:text-sm text-neutral-600 text-center">
          Tip: press <kbd className="px-1 py-0.5 border rounded">S</kbd> to jump.
        </motion.p>

        <motion.p variants={item} className="mt-4 text-xs md:text-sm text-neutral-500 text-center">
          Other internal tools live at{" "}
          <Link href="/tools" className="underline underline-offset-4 hover:text-neutral-800">
            /tools
          </Link>
          .
        </motion.p>

        {/* Footer */}
        <motion.footer variants={item} className="mt-10 text-xs md:text-sm text-neutral-600 text-center">
          © {new Date().getFullYear()} Débora Joppi.
        </motion.footer>
      </motion.main>

      {/* Keyboard shortcuts */}
      <KeyShortcuts />
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

function KeyShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      if (key === "s") window.location.href = "/science";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
