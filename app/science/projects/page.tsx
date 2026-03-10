import Link from "next/link";

const projects = [
  {
    href: "/science/projects/stats",
    title: "Stats",
    summary:
      "A Prism-like analysis studio for quick grouped and XY plots, summary statistics, and common tests from pasted tables.",
    status: "Live",
    external: false,
  },
  {
    href: "/science/projects/cloneflow",
    title: "CloneFlow",
    summary:
      "A local-first molecular cloning planning app with config-driven workflow logic, kept in its own standalone repository.",
    status: "External Repo",
    external: false,
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
          <ProjectCard key={project.href} {...project} />
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
}: {
  href: string;
  title: string;
  summary: string;
  status: string;
  external: boolean;
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
      <p className="mt-5 text-sm font-medium text-neutral-900 group-hover:underline">Open project</p>
    </>
  );

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
