"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

export default function ProjectsPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{copy.projects.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{copy.projects.title}</h1>
        <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">
          {copy.projects.intro}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {copy.projects.items.map((project) => (
          <ProjectCard key={project.href} openLabel={copy.projects.openProject} {...project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({
  href,
  title,
  summary,
  status,
  openLabel,
}: {
  href: string;
  title: string;
  summary: string;
  status: string;
  openLabel: string;
}) {
  const className =
    "group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {status}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-neutral-700">{summary}</p>
      <p className="mt-5 text-sm font-medium text-neutral-900 group-hover:underline">{openLabel}</p>
    </>
  );

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
