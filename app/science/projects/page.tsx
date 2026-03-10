"use client";

import Link from "next/link";

const projects = [
  {
    href: "/science/projects/stats",
    title: "Stats",
    summary:
      "A Prism-like analysis studio for quick grouped and XY plots, summary statistics, and common tests from pasted tables.",
    status: "Live",
  },
];

export default function ProjectsPage() {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Projects</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Computational tools and side builds</h1>
        <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">
          Small, focused tools that support my research workflow and data analysis. Stats lives here as a project rather
          than a top-level science section.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="group rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-900">{project.title}</h2>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {project.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-700">{project.summary}</p>
            <p className="mt-5 text-sm font-medium text-neutral-900 group-hover:underline">Open project</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
