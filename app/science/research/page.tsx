// app/science/research/page.tsx
"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";

function Card({ title, summary, href }: { title: string; summary: string; href?: string }) {
  return (
    <div className="shadow-sm border border-neutral-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
      {href ? (
        <a className="block hover:underline underline-offset-4" href={href}>
          <h3 className="font-medium leading-snug">{title}</h3>
        </a>
      ) : (
        <h3 className="font-medium leading-snug">{title}</h3>
      )}
      <p className="mt-2 text-sm text-neutral-800">{summary}</p>
    </div>
  );
}

export default function Research() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return (
    <section id="research">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.research.title}</h1>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {copy.research.cards.map((card) => (
          <Card key={card.title} title={card.title} summary={card.summary} />
        ))}
      </div>
    </section>
  );
}
