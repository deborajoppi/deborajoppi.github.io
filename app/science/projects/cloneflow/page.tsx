"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

const repoUrl = "https://github.com/deborajoppi/CloneFlow";
const liveUrl = "https://clone-flow.vercel.app";

export default function CloneFlowProjectPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <Link href="/science/projects" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← {copy.cloneflow.back}
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{copy.cloneflow.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{copy.cloneflow.title}</h1>
          <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">
            {copy.cloneflow.intro}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.25fr_0.9fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">{copy.cloneflow.whatItDoes}</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            {copy.cloneflow.whatItDoesBody}
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">
            {copy.cloneflow.capabilities.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7AA69A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-[#f6f1e7] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{copy.cloneflow.access}</p>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            {copy.cloneflow.accessBody}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#7AA69A] bg-[#7AA69A] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              {copy.cloneflow.openLive}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              {copy.cloneflow.openRepo}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
