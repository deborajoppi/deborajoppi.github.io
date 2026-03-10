import Link from "next/link";

const repoUrl = "https://github.com/deborajoppi/CloneFlow";
const liveUrl = "https://clone-flow.vercel.app";

const capabilities = [
  "Config-driven cloning logic with editable workflow and vector rule files",
  "Local-first project history and imported plasmid handling in the browser",
  "Sequence planning support for cloning, mutagenesis, and validation workflows",
  "Deployable as a standalone Next.js app without merging it into this website repo",
];

export default function CloneFlowProjectPage() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <Link href="/science/projects" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to Projects
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Project</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">CloneFlow</h1>
          <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">
            CloneFlow is a local-first Next.js app for molecular cloning planning. It stays in its own repository, but
            this page makes it part of the Projects section on your website.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.25fr_0.9fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">What it does</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            The app is designed around config-driven cloning workflows rather than hardcoded UI logic. That makes it
            easier to extend vectors, rule sets, and workflow types without rewriting the interface each time.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">
            {capabilities.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7AA69A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-[#f6f1e7] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Access</p>
          <p className="mt-3 text-sm leading-6 text-neutral-700">
            CloneFlow remains a separate standalone repo, but the live app is also available directly. Visitors can
            open the deployed site or inspect the codebase from here.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#7AA69A] bg-[#7AA69A] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Open Live App
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Open GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
