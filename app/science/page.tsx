// app/science/page.tsx
"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function About() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <section id="about" className="space-y-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="shrink-0">
          <div className="size-32 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 md:size-40">
            <img src={`${base}/debora-portrait.jpg`} alt="Débora Joppi" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{copy.about.title}</h1>
          <p className="mt-3 leading-relaxed text-neutral-700">{copy.about.intro}</p>

          <ul className="mt-4 grid gap-2 text-sm text-neutral-700 sm:grid-cols-2">
            {copy.about.interests.map((ri) => (
              <li key={ri} className="flex items-start gap-2">
                <span className="mt-[6px] size-1.5 rounded-full bg-neutral-400" />
                <span>{ri}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{copy.about.educationTitle}</h2>
          <div className="mt-5 space-y-5">
            {copy.about.education.map((item) => (
              <div
                key={`${item.period}-${item.degree}`}
                className="border-b border-neutral-200 pb-5 last:border-b-0 last:pb-0"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{item.period}</p>
                <h3 className="mt-2 text-base font-semibold text-neutral-900">{item.degree}</h3>
                <p className="text-sm text-neutral-700">{item.institution}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{copy.about.highlightsTitle}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700">
            {copy.about.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
