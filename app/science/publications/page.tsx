// app/science/publications/page.tsx
"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

export default function Publications() {
  const { language } = useLanguage();
  const copy = getCopy(language);
  const byYear = new Map<number, Pub[]>();
  copy.publications.items.forEach((p) => {
    const arr = byYear.get(p.year) ?? [];
    arr.push(p);
    byYear.set(p.year, arr);
  });
  const sorted = [...byYear.entries()].sort((a, b) => b[0] - a[0]);

  return (
    <section id="publications">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.publications.title}</h1>
      <div className="mt-6 space-y-8">
        {sorted.map(([year, items]) => (
          <div key={year}>
            <div className="text-sm font-medium text-neutral-500">{year}</div>
            <ol className="mt-3 space-y-3">
              {items.map((p, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  {p.authors ? <span className="text-neutral-700">{p.authors}. </span> : null}
                  <span className="font-medium">{p.title}</span>
                  {p.venue ? <> — <em>{p.venue}</em></> : null}
                  {p.note ? <> — <span className="text-neutral-500">{p.note}</span></> : null}
                  {p.href ? (
                    <>
                      {" "}
                      <a className="underline underline-offset-4" href={p.href} target="_blank">
                        {copy.publications.linkLabel}
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

type Pub = {
  year: number;
  title: string;
  venue?: string;
  authors?: string;
  href?: string;
  note?: string;
};
