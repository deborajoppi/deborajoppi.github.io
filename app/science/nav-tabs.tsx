// app/science/nav-tabs.tsx
"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname() || "";
  const { language } = useLanguage();
  const copy = getCopy(language);
  const tabs = [
    { href: "/", label: copy.nav.about },
    { href: "/science/research", label: copy.nav.research },
    { href: "/science/publications", label: copy.nav.publications },
    { href: "/science/projects", label: copy.nav.projects },
  ];

  return (
    <nav className="mt-3 flex flex-wrap gap-3 text-sm">
      {tabs.map((t) => {
        const active =
          t.href === "/"
            ? pathname === "/" || pathname === "/science"
            : pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.label}
            href={t.href}
            className={[
              "rounded-full border px-3 py-1.5",
              active
                ? "bg-neutral-900 text-white border-neutral-900"
                : "hover:bg-neutral-100 border-neutral-300",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
