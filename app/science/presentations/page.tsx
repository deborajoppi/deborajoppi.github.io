"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

type Entry = {
  category: "abstract" | "presentation";
  year: number;
  title: string;
  authors?: string;
  venue?: string;
  href?: string;
};

function groupByYear(items: Entry[]) {
  const byYear = new Map<number, Entry[]>();
  items.forEach((item) => {
    const current = byYear.get(item.year) ?? [];
    current.push(item);
    byYear.set(item.year, current);
  });
  return [...byYear.entries()].sort((a, b) => b[0] - a[0]);
}

function EntryList({ items, linkLabel }: { items: Entry[]; linkLabel: string }) {
  return (
    <div className="space-y-8">
      {groupByYear(items).map(([year, yearItems]) => (
        <div key={year}>
          <div className="text-sm font-medium text-neutral-500">{year}</div>
          <ol className="mt-3 space-y-3">
            {yearItems.map((item, index) => (
              <li key={`${item.title}-${index}`} className="text-sm leading-relaxed">
                {item.authors ? <span className="text-neutral-700">{item.authors}. </span> : null}
                <span className="font-medium">{item.title}</span>
                {item.venue ? <> — <span className="text-neutral-600">{item.venue}</span></> : null}
                {item.href ? (
                  <>
                    {" "}
                    <a className="underline underline-offset-4" href={item.href} target="_blank">
                      {linkLabel}
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default function PresentationsPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);
  const abstracts = copy.presentations.items.filter((item) => item.category === "abstract");
  const presentations = copy.presentations.items.filter((item) => item.category === "presentation");

  return (
    <section className="space-y-10" id="presentations">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{copy.presentations.title}</h1>
        <p className="mt-3 max-w-3xl text-neutral-700 leading-relaxed">{copy.presentations.intro}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          {copy.presentations.abstractsTitle}
        </h2>
        <div className="mt-5">
          <EntryList items={abstracts} linkLabel={copy.presentations.linkLabel} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          {copy.presentations.presentationsTitle}
        </h2>
        <div className="mt-5">
          <EntryList items={presentations} linkLabel={copy.presentations.linkLabel} />
        </div>
      </div>
    </section>
  );
}
