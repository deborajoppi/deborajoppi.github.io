"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import LanguageToggle from "@/app/components/language-toggle";
import { useLanguage } from "@/app/components/language-provider";
import SiteMark from "@/app/components/site-mark";
import { getCopy } from "@/app/lib/site-copy";
import NavTabs from "@/app/science/nav-tabs";

export default function ScienceShell({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight">
              <SiteMark className="h-9 w-9 shrink-0" />
              <span>Débora Joppi</span>
            </a>
            <LanguageToggle />
          </div>
          <Suspense fallback={null}>
            <NavTabs />
          </Suspense>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>

      <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-neutral-500 text-center">
        © {new Date().getFullYear()} {copy.shell.copyright}
      </footer>
    </main>
  );
}
