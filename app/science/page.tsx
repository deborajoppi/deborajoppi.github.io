// app/science/page.tsx
"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function About() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <section id="about">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0">
          <div className="size-32 md:size-40 rounded-full overflow-hidden ring-1 ring-neutral-200 bg-neutral-100">
            <img
              src={`${base}/debora-portrait.jpg`}
              alt="Débora Joppi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{copy.about.title}</h1>
          <p className="mt-3 text-neutral-700 leading-relaxed">
            {copy.about.intro}
          </p>

          <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-neutral-700">
            {copy.about.interests.map((ri) => (
              <li key={ri} className="flex items-start gap-2">
                <span className="mt-[6px] size-1.5 rounded-full bg-neutral-400" />
                <span>{ri}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
