"use client";

import { useLanguage, type SiteLanguage } from "@/app/components/language-provider";

const options: { value: SiteLanguage; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "pt", label: "PT" },
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white p-1 text-xs font-medium">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={[
            "rounded-full px-3 py-1 transition",
            language === option.value
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100",
          ].join(" ")}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
